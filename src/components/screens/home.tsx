import React, { useState, useCallback, useRef } from 'react';
import { Container } from 'native-base';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Animated,
} from 'react-native';
import { useEvents, FetchEventType } from '../../hooks/use-events';
import { wait } from '../../helpers';
import { EventFlow } from '../events/event-flow';
import { EventMapSelector } from '../events/events-map-selector';
import { IEvent } from '../../interfaces/event';
import { CommonActions } from '@react-navigation/native';
import { ShimmeringEvent } from '../events/event';
import { Heading } from '../heading';
import { Profile } from './profile';

export const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
    const {
        allEvents,
        localEvents,
        suggestedLocalEvents,
        suggestLocation,
        fetchEvents,
        currentCity,
    } = useEvents();

    const [refreshing, setRefreshing] = useState(false);
    const [eventFlowIndex, setEventFlowIndex] = useState<number>(1);
    const [
        showProposeLocationModal,
        setShowProposeLocationModal,
    ] = useState<IEvent | null>(null);
    const headerLock = useRef<boolean | undefined>();
    const [headerTitle, setHeaderTitle] = useState<string>('');
    const [showProfile, setShowProfile] = useState(false);
    const [fadeInHeader] = useState(new Animated.Value(0));

    const closeHeader = useCallback(() => {
        if (headerLock.current) {
            headerLock.current = false;
            Animated.timing(fadeInHeader, {
                toValue: 0,
                duration: 375,
                useNativeDriver: true,
            }).start();
        }
    }, [fadeInHeader]);

    const onScroll = useCallback(
        (e: NativeSyntheticEvent<NativeScrollEvent>, title: string) => {
            if (e.nativeEvent.contentOffset.y > 250) {
                if (!headerLock.current) {
                    headerLock.current = true;
                    setHeaderTitle(title);
                    Animated.timing(fadeInHeader, {
                        toValue: 1,
                        duration: 375,
                        useNativeDriver: true,
                    }).start();
                }
            }
            if (e.nativeEvent.contentOffset.y <= 99) {
                closeHeader();
            }
        },
        [closeHeader, fadeInHeader],
    );

    const onGoToLocation = useCallback(
        (event: IEvent) => {
            navigation.dispatch(
                CommonActions.navigate({
                    name: 'Karta',
                    params: {
                        event: event,
                    },
                }),
            );
        },
        [navigation],
    );

    const onRefresh = React.useCallback(
        (type: FetchEventType, currentIndex?: number) => {
            setRefreshing(true);
            if (currentIndex) {
                setEventFlowIndex(currentIndex);
            }

            fetchEvents(type);
            wait(2000).then(() => {
                setRefreshing(false);
            });
        },
        [fetchEvents],
    );

    return (
        <>
            <Profile
                open={showProfile}
                onClose={() => {
                    setShowProfile(false);
                }}
            />
            <Container style={styles.container}>
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

                <Animated.View
                    style={{
                        zIndex: 99,
                        opacity: fadeInHeader,
                        transform: [
                            {
                                scale: fadeInHeader.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.85, 1],
                                }),
                            },
                        ],
                        backgroundColor: '#151515e6',
                        borderBottomWidth: 0,
                        position: 'absolute',
                        top: 0,
                        height: 90,
                        width: '100%',
                    }}>
                    <View
                        style={{
                            alignSelf: 'center',
                            justifyContent: 'center',
                            flex: 1,
                        }}>
                        <Text
                            style={{
                                color: '#e3e3e3',
                                marginTop: 30,
                                fontWeight: 'bold',
                                fontSize: 18,
                            }}>
                            {headerTitle}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={{
                            backgroundColor: '#06d6a0',
                            borderRadius: 5,
                            position: 'absolute',
                            top: 40,
                            width: 38,
                            height: 38,
                            right: 10,
                        }}
                        onPress={() => {
                            setShowProfile(true);
                        }}>
                        <Text
                            style={{
                                fontSize: 33,
                                alignSelf: 'center',
                                top: 2,
                                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                                textShadowOffset: {
                                    width: -1,
                                    height: 0,
                                },
                                textShadowRadius: 7,
                            }}>
                            🕵️
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                <View
                    style={{
                        flex: 1,
                        alignContent: 'center',
                        justifyContent: 'center',
                        flexGrow: 1,
                        paddingTop: 35,
                    }}>
                    {allEvents ? (
                        <EventFlow
                            index={eventFlowIndex}
                            onGoToEventLocation={onGoToLocation}
                            allEvents={allEvents}
                            localSuggestions={suggestedLocalEvents}
                            localEvents={localEvents}
                            currentCity={currentCity}
                            onRefresh={onRefresh}
                            isRefreshing={refreshing}
                            onProposeEventLocation={setShowProposeLocationModal}
                            onScroll={onScroll}
                            closeHeader={closeHeader}
                        />
                    ) : (
                        <View
                            style={{
                                width: '100%',
                                flexGrow: 1,
                                height: 'auto',
                            }}>
                            <Heading title={'Hämtar din position...'} />
                            <View
                                style={{
                                    alignSelf: 'center',
                                }}>
                                {Array(3)
                                    .fill(Math.floor(Math.random() * 10000) + 1)
                                    .map(() => (
                                        <ShimmeringEvent />
                                    ))}
                            </View>
                        </View>
                    )}
                </View>
            </Container>
        </>
    );
};

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        flexGrow: 1,
    },
    container: {
        width: 'auto',
        height: '100%',
        backgroundColor: '#151515',
    },
    tabButtonText: {
        color: '#e3e3e3',
        fontWeight: 'bold',
        fontSize: 23,
    },
});
