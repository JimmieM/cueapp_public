/* eslint-disable react/jsx-key */
import React, {
    useState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import {
    View,
    ScrollView,
    RefreshControl,
    StyleSheet,
    Text,
    Button,
    AsyncStorage,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Dimensions,
} from 'react-native';
import { IEvent } from '../../interfaces/event';
import { ShimmeringEvent, SuggestedUserIcon } from './event';
import { Heading } from '../heading';
import { Event } from './event';
import { useTheme } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { Card, CardItem, Body } from 'native-base';
import { secondPrimaryColor, primaryColor } from '../../../App';
import { FetchEventType } from '../../hooks/use-events';
import { Ionicons } from '@expo/vector-icons';
import { CreateEvent } from './create-event';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface EventFlowProps {
    index: number;
    localEvents: IEvent[] | null;
    allEvents: IEvent[] | null;
    localSuggestions: IEvent[] | null;
    currentCity?: string;
    onRefresh: (type: FetchEventType, currentIndex?: number) => void;
    isRefreshing: boolean;
    onProposeEventLocation: (event: IEvent) => void;
    onGoToEventLocation: (event: IEvent) => void;
    onScroll: (
        e: NativeSyntheticEvent<NativeScrollEvent>,
        title: string,
    ) => void;
    closeHeader: () => void;
}

export const EventFlow: React.FC<EventFlowProps> = (props) => {
    const {
        index,
        localEvents,
        onRefresh,
        isRefreshing,
        allEvents,
        currentCity,
        localSuggestions,
        onProposeEventLocation,
        onGoToEventLocation,
        onScroll,
        closeHeader,
    } = props;
    const { colors } = useTheme();
    const [displayLocalEvents, setDisplayLocalEvents] = useState(20);
    const [displayAllEvents, setDisplayAllEvents] = useState(20);
    const [displayLocalSuggestions, setDisplayLocalSuggestions] = useState(20);
    const [
        showSuggestedEventsFlowConstent,
        setShowSuggestedEventsFlowConstent,
    ] = useState<boolean>(false);
    const [latestSwipedIndex, setLatestSwipedIndex] = useState<number>();

    const refresh = useCallback(
        (type: FetchEventType) => {
            onRefresh(type, latestSwipedIndex);
        },
        [latestSwipedIndex, onRefresh],
    );

    const getConsent = async () => {
        try {
            const value = await AsyncStorage.getItem(
                'SuggestedEventsFlowConstent',
            );

            if (value === null) {
                setShowSuggestedEventsFlowConstent(true);
            } else {
                setShowSuggestedEventsFlowConstent(false);
            }
        } catch (e) {
            setShowSuggestedEventsFlowConstent(true);
        }
    };

    useEffect(() => {
        //AsyncStorage.removeItem('SuggestedEventsFlowConstent');
        getConsent();
    }, []);

    const styles = StyleSheet.create({
        swiper: {
            height: 'auto',
        },
        view: {
            width: '100%',
            alignContent: 'center',
            height: 'auto',
        },
        container: {
            flexGrow: 1,
            backgroundColor: colors.background,
        },
        tabButtonText: {
            color: colors.text,
            fontWeight: 'bold',
            fontSize: 23,
        },
    });

    const CreateEventCard = () => {
        return (
            <View
                style={{
                    paddingTop: 20,
                    width: '95%',
                }}>
                <TouchableOpacity
                    style={{
                        alignSelf: 'flex-start',
                        width: '100%',
                    }}
                    onPress={() => {
                        if (!displayCreateEvent) {
                            setDisplayCreateEvent(true);
                        }
                    }}>
                    <Card
                        style={{
                            borderRadius: 10,
                            backgroundColor: colors.card,
                            borderWidth: 0,
                            width: '100%',
                            height: 65,
                            borderColor: 'transparent',
                        }}>
                        <CardItem
                            style={{
                                marginTop: 3,
                                backgroundColor: colors.card,
                                borderWidth: 0,
                                borderColor: 'transparent',
                                borderRadius: 10,
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-end',
                                }}>
                                <Ionicons
                                    color={primaryColor}
                                    size={40}
                                    name={'ios-add'}
                                    style={{
                                        paddingLeft: 10,
                                        paddingRight: 15,
                                        margin: 0,
                                    }}
                                />
                                <Text
                                    style={{
                                        color: '#e3e3e3',
                                        fontSize: 17,
                                        fontWeight: 'bold',
                                        alignSelf: 'center',
                                    }}>
                                    Rapportera ett brott eller händelse
                                </Text>
                            </View>
                        </CardItem>
                    </Card>
                </TouchableOpacity>
            </View>
        );
    };

    const SuggestedEventsConsentCard = () => {
        return (
            <Card
                style={{
                    borderRadius: 10,
                    backgroundColor: colors.card,
                    borderWidth: 0,
                    width: '95%',
                    minHeight: 120,
                    marginBottom: 20,
                    borderColor: 'transparent',
                }}>
                <CardItem
                    style={{
                        marginTop: 10,
                        backgroundColor: colors.card,
                        borderWidth: 0,
                        borderColor: 'transparent',
                        borderRadius: 10,
                    }}>
                    <Text
                        style={{
                            color: '#e3e3e3',
                            fontSize: 17,
                            fontWeight: 'bold',
                        }}>
                        Här visas enbart troliga händelser som har publicerats
                        av andra användare på Cue.
                    </Text>
                </CardItem>

                <CardItem
                    style={{
                        backgroundColor: colors.card,
                        borderWidth: 0,
                        borderColor: 'transparent',
                        borderRadius: 10,
                    }}>
                    <Body>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginBottom: 4,
                            }}>
                            <Text
                                style={{
                                    color: '#e3e3e3',
                                    alignSelf: 'center',
                                }}>
                                - Användare är anonyma och visas enbart som
                                {'    '}
                            </Text>
                            {SuggestedUserIcon()}
                        </View>

                        <View
                            style={{
                                marginBottom: 10,
                            }}>
                            <Text
                                style={{
                                    color: '#e3e3e3',
                                    alignSelf: 'center',
                                }}>
                                - Du kan verifiera en händelse genom 👍
                            </Text>
                        </View>

                        <View
                            style={{
                                marginBottom: 10,
                            }}>
                            <Text
                                style={{
                                    color: '#e3e3e3',
                                    alignSelf: 'center',
                                }}>
                                - Flagga händelser som är trolls eller fejk 🚩
                            </Text>
                        </View>

                        <Button
                            color={secondPrimaryColor}
                            onPress={async () => {
                                await AsyncStorage.setItem(
                                    'SuggestedEventsFlowConstent',
                                    'true',
                                );
                                getConsent();
                            }}
                            title={'Jag förstår.'}
                        />
                    </Body>
                </CardItem>
            </Card>
        );
    };

    const RenderLoading = useCallback(() => {
        return isRefreshing
            ? Array(3)
                  .fill(Math.floor(Math.random() * 10000) + 1)
                  .map(() => <ShimmeringEvent />)
            : null;
    }, [isRefreshing]);

    const RenderLocalEvents = useMemo(() => {
        if (localEvents) {
            if (localEvents.length > 0) {
                return localEvents.slice(0, displayLocalEvents).map((event) => (
                    <Event
                        key={event.id}
                        hideCity={true}
                        onRefreshFlow={refresh}
                        onProposeLocation={() => {
                            onProposeEventLocation(event);
                        }}
                        onOpenLocation={() => {
                            onGoToEventLocation(event);
                        }}
                        event={event}
                    />
                ));
            } else {
                return (
                    <Text
                        style={{
                            color: colors.text,
                            marginTop: 10,
                            fontSize: 13,
                            alignSelf: 'center',
                        }}>
                        Kunde inte hitta några händelser.. 🙁
                    </Text>
                );
            }
        } else {
            return RenderLoading();
        }
    }, [
        RenderLoading,
        colors.text,
        displayLocalEvents,
        localEvents,
        onGoToEventLocation,
        onProposeEventLocation,
        refresh,
    ]);

    const RenderAllEvents = useMemo(() => {
        if (allEvents) {
            if (allEvents.length > 0) {
                return allEvents.slice(0, displayAllEvents).map((event) => (
                    <Event
                        onRefreshFlow={refresh}
                        key={event.id}
                        onProposeLocation={() => {
                            onProposeEventLocation(event);
                        }}
                        onOpenLocation={() => {
                            onGoToEventLocation(event);
                        }}
                        event={event}
                    />
                ));
            }
            return (
                <Text
                    style={{
                        color: colors.text,
                        marginTop: 10,
                        fontSize: 13,
                        alignSelf: 'center',
                    }}>
                    Kunde inte hitta några händelser.. 🙁
                </Text>
            );
        } else {
            return RenderLoading();
        }
    }, [
        allEvents,
        colors.text,
        displayAllEvents,
        refresh,
        onProposeEventLocation,
        onGoToEventLocation,
        RenderLoading,
    ]);

    const RenderLocalSuggestions = useMemo(() => {
        if (localSuggestions) {
            if (localSuggestions.length > 0) {
                return localSuggestions
                    .slice(0, displayLocalSuggestions)
                    .map((event) => (
                        <Event
                            isSuggested={true}
                            key={event.id}
                            onRefreshFlow={refresh}
                            onProposeLocation={() => {
                                onProposeEventLocation(event);
                            }}
                            onOpenLocation={() => {
                                onGoToEventLocation(event);
                            }}
                            event={event}
                        />
                    ));
            }
            return (
                <Text
                    style={{
                        color: colors.text,
                        marginTop: 10,
                        fontSize: 13,
                        alignSelf: 'center',
                    }}>
                    Kunde inte hitta några händelser.. 🙁
                </Text>
            );
        } else {
            return RenderLoading();
        }
    }, [
        RenderLoading,
        colors.text,
        displayLocalSuggestions,
        localSuggestions,
        onGoToEventLocation,
        onProposeEventLocation,
        refresh,
    ]);

    const isCloseToBottom = useCallback((event: NativeScrollEvent) => {
        const paddingToBottom = 20;
        return (
            event.layoutMeasurement.height + event.contentOffset.y >=
            event.contentSize.height - paddingToBottom
        );
    }, []);

    const onIndexChanged = useCallback((index: number) => {
        //latestSwipeIndex.current = index;
        setLatestSwipedIndex(index);

        closeHeader();
    }, []);

    const [displayCreateEvent, setDisplayCreateEvent] = useState(false);
    return (
        <>
            {displayCreateEvent && (
                <CreateEvent
                    display={displayCreateEvent}
                    onClose={(_refresh) => {
                        setDisplayCreateEvent(false);
                        if (_refresh) {
                            refresh('suggested');
                        }
                    }}
                />
            )}
            <Swiper
                index={index}
                style={styles.swiper}
                onIndexChanged={onIndexChanged}
                showsButtons={false}
                loop={false}
                dot={
                    <View
                        style={{
                            backgroundColor: 'rgba(255,255,255,.3)',
                            width: 13,
                            height: 13,
                            borderRadius: 7,
                            marginLeft: 7,
                            marginRight: 7,
                            bottom: -10,
                        }}
                    />
                }
                activeDot={
                    <View
                        style={{
                            backgroundColor: colors.primary,
                            width: 13,
                            height: 13,
                            borderRadius: 7,
                            marginLeft: 7,
                            marginRight: 7,
                            bottom: -10,
                        }}
                    />
                }
                paginationStyle={{
                    bottom: 30,
                }}>
                <View style={styles.view}>
                    <ScrollView
                        style={{
                            minHeight: Dimensions.get('window').height - 100,
                        }}
                        onScroll={(e) => {
                            onScroll(e, 'Händelser av andra');
                        }}
                        scrollEventThrottle={400}
                        contentContainerStyle={{
                            alignItems: 'center',
                        }}
                        onScrollEndDrag={({ nativeEvent }) => {
                            if (isCloseToBottom(nativeEvent)) {
                                if (
                                    localEvents &&
                                    localEvents.length > displayLocalEvents + 20
                                ) {
                                    setDisplayLocalSuggestions((e) => e + 20);
                                }
                            }
                        }}
                        refreshControl={
                            <RefreshControl
                                tintColor={colors.primary}
                                refreshing={isRefreshing}
                                onRefresh={() => {
                                    refresh('suggested');
                                }}
                            />
                        }>
                        {CreateEventCard()}
                        <Heading
                            size={27}
                            title={'Händelser av andra nära dig'}
                        />
                        {showSuggestedEventsFlowConstent &&
                            SuggestedEventsConsentCard()}

                        <View
                            style={{
                                width: '95%',
                            }}>
                            {RenderLocalSuggestions}
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.view}>
                    <ScrollView
                        style={{
                            minHeight: Dimensions.get('window').height - 100,
                        }}
                        onScroll={(e) => {
                            onScroll(
                                e,
                                currentCity !== undefined
                                    ? `Senaste i ${currentCity}`
                                    : 'Senaste nära dig',
                            );
                        }}
                        scrollEventThrottle={400}
                        contentContainerStyle={{
                            alignItems: 'center',
                        }}
                        onScrollEndDrag={({ nativeEvent }) => {
                            if (isCloseToBottom(nativeEvent)) {
                                if (
                                    localEvents &&
                                    localEvents.length > displayLocalEvents + 20
                                ) {
                                    setDisplayLocalEvents((e) => e + 20);
                                }
                            }
                        }}
                        refreshControl={
                            <RefreshControl
                                tintColor={colors.primary}
                                refreshing={isRefreshing}
                                onRefresh={() => {
                                    refresh('city');
                                }}
                            />
                        }>
                        <Heading
                            title={
                                currentCity !== undefined
                                    ? `Senaste i ${currentCity}`
                                    : 'Senaste nära dig'
                            }
                        />
                        <View
                            style={{
                                width: '95%',
                            }}>
                            {RenderLocalEvents}
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.view}>
                    <ScrollView
                        onScroll={(e) => {
                            onScroll(e, 'Hela Sverige');
                        }}
                        scrollEventThrottle={300}
                        contentContainerStyle={{
                            alignItems: 'center',
                        }}
                        onScrollEndDrag={({ nativeEvent }) => {
                            if (isCloseToBottom(nativeEvent)) {
                                if (
                                    allEvents &&
                                    allEvents.length > displayAllEvents
                                ) {
                                    setDisplayAllEvents((e) => e + 20);
                                }
                            }
                        }}
                        refreshControl={
                            <RefreshControl
                                tintColor={colors.primary}
                                refreshing={isRefreshing}
                                onRefresh={() => {
                                    refresh('country');
                                }}
                            />
                        }>
                        <Heading title={'Hela Sverige'} />
                        <View
                            style={{
                                width: '95%',
                            }}>
                            {RenderAllEvents}
                        </View>
                    </ScrollView>
                </View>
            </Swiper>
        </>
    );
};
