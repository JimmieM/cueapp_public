import React, { useState, useCallback } from 'react';
import { EventsMapView } from '../events/map/events-map-view';
import { useEvents } from '../../hooks/use-events';
import { LoadingIndicator } from '../loading-indicator';
import { EventMapSelector } from '../events/events-map-selector';
import { IEvent } from '../../interfaces/event';
import { View, Dimensions, Text } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

export const EventsMap: React.FC<{ route: any }> = ({ route }) => {
    const {
        allEvents,
        suggestedLocalEvents,
        suggestLocation,
        fetchEvents,
    } = useEvents();
    const [refreshing, setRefreshing] = useState(false);

    const OnRefresh = useCallback(
        (done: () => void) => {
            setRefreshing(true);
            fetchEvents('all');
            setTimeout(() => {
                setRefreshing(false);
                done();
            }, 1000);
        },
        [fetchEvents],
    );

    const [
        showProposeLocationModal,
        setShowProposeLocationModal,
    ] = useState<IEvent | null>(null);

    return allEvents || refreshing ? (
        <View style={{ flex: 1 }}>
            {showProposeLocationModal && (
                <EventMapSelector
                    onClose={(region, radius) => {
                        if (region) {
                            suggestLocation(
                                {
                                    eventId: showProposeLocationModal.id,
                                    location: {
                                        gps: {
                                            lat: region?.latitude,
                                            lng: region?.longitude,
                                        },
                                        radius: radius || 0,
                                        timestamp: Date.now(),
                                    },
                                },
                                () => {
                                    setShowProposeLocationModal(null);
                                },
                            );
                        }
                        setShowProposeLocationModal(null);
                    }}
                    event={showProposeLocationModal}
                    promptOptions={{
                        title: 'Föreslå händelse position här?',
                        description: '',
                        input: false,
                        ContinueBtntitle: 'Föreslå',
                    }}
                    consentModal={{
                        title: 'Föreslå händelseplats',
                        description:
                            'Använd kartan för att föreslå en specifik plats där du tror eller vet att denna händelse utspelade sig.',
                    }}
                />
            )}

            <EventsMapView
                onRefresh={OnRefresh}
                events={
                    suggestedLocalEvents
                        ? [...(allEvents || []), ...suggestedLocalEvents]
                        : allEvents || []
                }
                goToEvent={route.params ? route.params.event : undefined}
                isRefreshing={false}
                onProposeEventLocation={(e) => {
                    setShowProposeLocationModal(e);
                }}
            />
            {refreshing && <SwiperPlaceHolder />}
        </View>
    ) : (
        <View
            style={{
                flex: 1,
            }}>
            <LoadingIndicator display={true} />
            <SwiperPlaceHolder />
        </View>
    );
};

const SwiperPlaceHolder = () => (
    <View
        style={{
            alignItems: 'center',
            position: 'absolute',
            bottom: 0,
        }}>
        <View
            style={{
                backgroundColor: '#2a2a2a',
                position: 'absolute',
                top: -24,
                right: 18,
                width: 55,
                height: 55,
                paddingTop: 13,
                borderRadius: 50,
                zIndex: 1,
            }}>
            <Text
                style={{
                    alignSelf: 'center',
                    fontSize: 22,
                }}>
                👀
            </Text>
        </View>
        <ShimmerPlaceHolder
            height={145}
            width={Dimensions.get('window').width}
            colorShimmer={['#1f1f1f', '#2a2a2a', '#1f1f1f']}
            autoRun={true}
        />
    </View>
);
