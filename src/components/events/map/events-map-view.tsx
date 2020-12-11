import React, { useState, useCallback, useEffect, useRef } from 'react';
import { usePositition } from '../../../hooks/use-position';
import MapView, { PROVIDER_DEFAULT } from 'react-native-maps';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IEvent } from '../../../interfaces/event';
import { useTheme } from '@react-navigation/native';
import { Button } from 'native-base';
import { MapFilterToggler } from './mapfilter-toggler';
import { MapEventSwiper } from './map-event-swiper';
import { EventMapMarker } from './event-map-marker';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface EventsMapViewProps {
    events: IEvent[];
    goToEvent?: IEvent;
    isRefreshing: boolean;
    onRefresh: (done: () => void) => void;
    onProposeEventLocation: (event: IEvent) => void;
}

export const EventsMapView: React.FC<EventsMapViewProps> = (props) => {
    const { events, goToEvent } = props;
    const { colors } = useTheme();

    const [position] = usePositition();
    const mapRef = useRef<any | null>(null);

    const [currentEvent, setCurrentEvent] = useState<IEvent | null>(null);
    const [currentSameLocationEvents, setCurrentSameLocationEvents] = useState<
        IEvent[] | null
    >(null);
    const [sortedEvents, setSortedEvents] = useState<IEvent[]>();
    const [selectedEvents, setSelectedEvents] = useState(sortedEvents);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const Refresh = () => {
        setIsRefreshing(true);
        setSortedEvents([]);
        props.onRefresh(() => {
            setIsRefreshing(false);
        });
    };

    const GoToEvent = useCallback(
        (eventIndex: number) => {
            setCurrentSameLocationEvents(null);
            setCurrentEvent(null);
            if (!props.events[eventIndex]) {
                return;
            }
            const lt = props.events[eventIndex].location.gps;
            if (lt && mapRef.current) {
                setCurrentEvent(events[eventIndex]);
                setCurrentSameLocationEvents(
                    events.filter(
                        (e) =>
                            e.location.gps.lat ===
                                events[eventIndex].location.gps.lat &&
                            e.location.gps.lng ===
                                events[eventIndex].location.gps.lng &&
                            e.id !== events[eventIndex].id,
                    ),
                );

                mapRef.current.animateToRegion(
                    {
                        latitude: lt.lat,
                        longitude: lt.lng,
                        latitudeDelta: 0.009,
                        longitudeDelta: 0.009,
                    },
                    1500,
                );
            }
        },
        [events],
    );

    useEffect(() => {
        if (goToEvent !== undefined && sortedEvents) {
            GoToEvent(
                sortedEvents.findIndex(
                    (d) =>
                        d.id === goToEvent.id &&
                        d.authorized === goToEvent.authorized,
                ),
            );
        } else {
            sortedEvents &&
                setSelectedEvents(
                    sortedEvents.filter((e) => {
                        const today = new Date();
                        today.setDate(today.getDate() + 1);

                        return new Date(e.datetime).getTime() < today.getTime();
                    }),
                );
        }
    }, [GoToEvent, goToEvent, sortedEvents]);

    const findDuplicatePositions = useCallback((events: IEvent[]) => {
        const object: any = {};
        const result = [];
        events.forEach(function (item) {
            const searchStr = `${item.location.gps.lat},${item.location.gps.lng}`;
            if (!object[searchStr]) object[searchStr] = 0;
            object[searchStr] += 1;
        });

        for (const prop in object) {
            if (object[prop] >= 2) {
                result.push(prop);
            }
        }

        return result;
    }, []);

    useEffect(() => {
        const duplicates = findDuplicatePositions(events);

        const mutableEvents = events;
        duplicates.length > 0 &&
            duplicates.map((dupl) => {
                const latLng: number[] = dupl.split(',').map((e) => Number(e));

                const duplEvents = events.filter(
                    (e) =>
                        e.location.gps.lat === latLng[0] &&
                        e.location.gps.lng === latLng[1],
                );

                duplEvents &&
                    duplEvents.length > 0 &&
                    duplEvents.map((duplEvent, i) => {
                        duplEvent.location.gps.lat =
                            duplEvent.location.gps.lat + 0.0008 * i;

                        duplEvent.location.gps.lng =
                            duplEvent.location.gps.lng + 0.0008 * i;

                        const index = mutableEvents.findIndex(
                            (e) => e.id === duplEvent.id,
                        );
                        if (index) {
                            mutableEvents[index] = duplEvent;
                        }
                    });
            });
        setSortedEvents(mutableEvents);
        setSelectedEvents(mutableEvents);
    }, [events, findDuplicatePositions]);

    const SetCurrentEventAndNearEvents = useCallback(
        (event: IEvent) => {
            setCurrentEvent(null);
            setCurrentSameLocationEvents(null);
            const oldEvent = events.find((e) => e.id === event.id);

            if (oldEvent) {
                const sameLocsEvents = events.filter(
                    (ev) =>
                        ev.location.gps.lat === oldEvent.location.gps.lat &&
                        ev.location.gps.lng === oldEvent.location.gps.lng,
                );
                setCurrentSameLocationEvents(sameLocsEvents);
                setCurrentEvent(oldEvent);
            }
        },
        [events, setCurrentEvent, setCurrentSameLocationEvents],
    );

    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#151515',
            flexDirection: 'row',
        },
        mapView: {
            ...StyleSheet.absoluteFillObject,

            width: 'auto',
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        map: {
            ...StyleSheet.absoluteFillObject,
        },
        eventSelectorContainer: {
            width: 'auto',
            height: 50,
            top: 10,
            position: 'absolute',
            flexDirection: 'row',
        },
        MapOptionButton: {
            backgroundColor: colors.primary,
            padding: 7,
            paddingRight: 15,
            margin: 5,
            paddingLeft: 15,
            borderRadius: 30,
        },
        mapOptionButtonText: {
            color: '#3f3f3f',
            fontWeight: 'bold',
            fontSize: 13,
        },
    });

    return (
        <View
            style={{
                flex: 1,
            }}>
            <View style={styles.mapView}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_DEFAULT}
                    style={styles.map}
                    zoomEnabled={true}
                    initialRegion={
                        position
                            ? {
                                  latitude: position.gps.lat,
                                  longitude: position.gps.lng,
                                  latitudeDelta: 0.008,
                                  longitudeDelta: 0.008,
                              }
                            : undefined
                    }>
                    {selectedEvents &&
                        selectedEvents.length > 0 &&
                        selectedEvents.map((event, i) => (
                            <EventMapMarker
                                index={i}
                                key={i}
                                onClick={() => null}
                                event={event}
                                onGoToEvent={GoToEvent}
                            />
                        ))}
                </MapView>

                {sortedEvents && (
                    <MapFilterToggler
                        events={sortedEvents}
                        setSelectedEvents={setSelectedEvents}
                    />
                )}
                <Button
                    onPress={Refresh}
                    transparent
                    style={{
                        zIndex: 999,
                        position: 'absolute',
                        top: Platform.OS === 'ios' ? 45 : 10,
                        alignItems: 'center',
                        left: 20,
                    }}>
                    {!isRefreshing ? (
                        <Ionicons
                            color={colors.primary}
                            size={25}
                            name={'ios-refresh'}
                        />
                    ) : (
                        <ActivityIndicator
                            size="small"
                            color={colors.primary}
                        />
                    )}
                </Button>
            </View>
            <MapEventSwiper
                onChangeEvent={(e, ewsl) => {
                    setCurrentEvent(e);
                    setCurrentSameLocationEvents(ewsl || null);
                }}
                event={currentEvent || events[0]}
                eventsWithSameLocation={currentSameLocationEvents || undefined}
                onProposeEventLocation={(e) => {
                    props.onProposeEventLocation(e);
                }}
            />
        </View>
    );
};
