/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardItem, Body, Text } from 'native-base';
import { IEvent } from '../../interfaces/event';
import { Ionicons } from '@expo/vector-icons';
import {
    View,
    Dimensions,
    ImageBackground,
    AsyncStorage,
    Alert,
} from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { useTheme } from '@react-navigation/native';
import { GetEventTypeByName, GetEventTypeById } from '../../models/event-type';
import { secondPrimaryColor } from '../../../App';
import { useEvents, FetchEventType } from '../../hooks/use-events';
import { TouchableOpacity } from 'react-native-gesture-handler';

const clocks = ['🕐', '🕒', '🕘', '🕙', '🕑', '🕑', '🕗', '🕓', '🕔'];
export const randomClock = (): string => {
    return clocks[Math.floor(Math.random() * clocks.length)];
};

const colorShimmer = ['#1f1f1f', '#2a2a2a', '#1f1f1f'];
export const ShimmeringEvent: React.FC<{}> = () => {
    return (
        <View style={{ width: '95%' }}>
            <ShimmerPlaceHolder
                style={{
                    borderRadius: 7,
                    marginBottom: 10,
                }}
                height={95}
                width={Dimensions.get('window').width - 20}
                colorShimmer={colorShimmer}
                autoRun={true}
            />
        </View>
    );
};

export const EventIcon: React.FC<{
    eventType: string | number;
    size?: number;
}> = (props) => {
    let event;
    if (typeof props.eventType === 'string') {
        event = GetEventTypeByName(props.eventType);
    } else {
        event = GetEventTypeById(props.eventType);
    }

    return (
        <View
            style={{
                backgroundColor: event?.iconColor || '#540b0e',
                borderRadius: 5,
                padding: 4,
            }}>
            <Text style={{ fontSize: props.size ? props.size : 14 }}>
                {event?.icon || '⁉️'}
            </Text>
        </View>
    );
};

export const SuggestedUserIcon = () => (
    <View
        style={{
            backgroundColor: secondPrimaryColor,
            borderRadius: 5,
            width: 26,
            height: 26,
            right: 7,
        }}>
        <Text
            style={{
                fontSize: 22,
                alignSelf: 'center',
                top: 1,
                textShadowColor: 'rgba(0, 0, 0, 0.75)',
                textShadowOffset: { width: -1, height: 0 },
                textShadowRadius: 7,
            }}>
            🕵️
        </Text>
    </View>
);

export interface EventProps {
    event: IEvent;
    onProposeLocation: () => void;
    onOpenLocation: () => void;
    onRefreshFlow: (type: FetchEventType) => void;
    hideCity?: boolean;
    isSuggested?: boolean;
}

export const Event: React.FC<EventProps> = (props) => {
    const { colors } = useTheme();
    const { reportEvent, upvoteEvent } = useEvents(true);
    const [upvoted, setUpvoted] = useState(false);
    const [reported, setReported] = useState(false);

    useEffect(() => {
        HasUpvoted();
        HasReported();
    }, []);

    const GetMyUpvotes = useCallback(async () => {
        try {
            const value = await AsyncStorage.getItem('SuggestedEventsUpvotes');
            if (value === null) {
                return [];
            } else {
                const arr = JSON.parse(value) as number[];
                return arr;
            }
        } catch (e) {
            return [];
        }
    }, []);

    const HasUpvoted = useCallback(async () => {
        const upvotes = await GetMyUpvotes();
        if (upvotes && !!upvotes.length && upvotes.includes(props.event.id)) {
            setUpvoted(true);
        }
    }, [GetMyUpvotes, props.event.id]);

    const GetMyReports = useCallback(async () => {
        try {
            const value = await AsyncStorage.getItem('SuggestedEventsReports');
            if (value === null) {
                return [];
            } else {
                const arr = JSON.parse(value) as number[];
                return arr;
            }
        } catch (e) {
            return [];
        }
    }, []);

    const HasReported = useCallback(async () => {
        const reports = await GetMyReports();
        if (reports && !!reports.length && reports.includes(props.event.id)) {
            setReported(true);
        }
    }, [GetMyReports, props.event.id]);

    const Upvote = useCallback(() => {
        upvoteEvent(props.event.id, async (success) => {
            if (success) {
                const upvotes = await GetMyUpvotes();
                const newArr = [...upvotes, props.event.id];
                await AsyncStorage.setItem(
                    'SuggestedEventsUpvotes',
                    JSON.stringify(newArr),
                );
                setUpvoted(true);
            }
        });
    }, [GetMyUpvotes, props.event.id, upvoteEvent]);

    const Report = useCallback(() => {
        Alert.alert(
            'Rapportera händelse?',
            '',
            [
                {
                    text: 'Avbryt',
                    style: 'cancel',
                },
                {
                    text: 'Ja',
                    onPress: () => {
                        reportEvent(
                            props.event.id,
                            async (success) => {
                                if (success) {
                                    const reports = await GetMyReports();
                                    const newArr = [...reports, props.event.id];
                                    await AsyncStorage.setItem(
                                        'SuggestedEventsReports',
                                        JSON.stringify(newArr),
                                    );
                                    setReported(true);
                                }
                            },
                            () => {
                                props.onRefreshFlow('suggested');
                            },
                        );
                    },
                },
            ],
            { cancelable: false },
        );
    }, [reported]);

    const eventBg = props.isSuggested
        ? require(`../../assets/suggested-event-bg-test.png`)
        : require(`../../assets/event-bg-test.png`);

    const showCity = props.hideCity || props.isSuggested ? false : true;

    return (
        <Card
            style={{
                borderRadius: 7,
                width: '100%',
                backgroundColor: colors.card,
                borderWidth: 0,

                borderColor: 'transparent',
            }}>
            <ImageBackground
                source={eventBg}
                style={{
                    width: '100%',
                    opacity: 0.95,
                }}>
                <CardItem
                    style={{
                        borderRadius: 7,
                        width: '90%',
                        minHeight:
                            props.event.LocationGPSType === 'initial' ? 75 : 50,
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}>
                    <Body
                        style={{
                            minHeight: 55,
                        }}>
                        <View style={{ flexDirection: 'row', marginBottom: 7 }}>
                            {props.isSuggested && (
                                <View style={{ paddingLeft: 6 }}>
                                    {SuggestedUserIcon()}
                                </View>
                            )}
                            <EventIcon eventType={props.event.type} />
                            <Text
                                style={{
                                    color: '#ededed',
                                    fontSize: 14,
                                    fontWeight: '600',
                                    alignSelf: 'center',
                                }}>
                                {'   '}
                                {props.event.type}
                            </Text>
                        </View>
                        <Text
                            style={{
                                color: '#d2d2d2',
                                fontSize: 15,
                                marginTop: 5,
                                width: '96%',
                            }}>
                            {props.event.summary}
                        </Text>

                        {props.event.authorized &&
                            props.event.suggestedEvents &&
                            props.event.suggestedEvents.length > 0 && (
                                <View
                                    style={{
                                        backgroundColor: '#151515b8',
                                        borderRadius: 10,
                                        padding: 10,
                                        marginTop: 10,
                                        flexDirection: 'row',
                                        paddingLeft: 15,
                                    }}>
                                    {SuggestedUserIcon()}
                                    <Text
                                        style={{
                                            color: '#e3e3e3',
                                            fontSize: 14,
                                            alignSelf: 'center',
                                        }}>
                                        Tidigare rapporterat av{' '}
                                        {props.event.suggestedEvents.length}{' '}
                                        personer
                                    </Text>
                                </View>
                            )}
                    </Body>
                </CardItem>
                <CardItem
                    style={{
                        borderRadius: 7,
                        width: '100%',
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                    }}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'flex-end',
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}>
                            {!reported && props.isSuggested && (
                                <TouchableOpacity
                                    onPress={Report}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        alignContent: 'space-between',
                                    }}>
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            paddingRight: 6,
                                            borderRadius: 5,
                                        }}>
                                        <Text
                                            style={{
                                                alignSelf: 'center',
                                                fontSize: 13,
                                            }}>
                                            🚩
                                        </Text>
                                    </View>

                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: '#939393',
                                            alignSelf: 'center',
                                        }}>
                                        Rapportera
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {props.isSuggested && !upvoted && (
                                <TouchableOpacity
                                    onPress={Upvote}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        alignContent: 'space-between',
                                        marginLeft: 19,
                                    }}>
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            paddingRight: 6,
                                            borderRadius: 5,
                                        }}>
                                        <Text
                                            style={{
                                                alignSelf: 'center',
                                                fontSize: 13,
                                            }}>
                                            👍
                                        </Text>
                                    </View>

                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: '#939393',
                                            alignSelf: 'center',
                                        }}>
                                        Godkänn
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={props.onOpenLocation}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    marginLeft: 19,
                                }}>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                        borderRadius: 5,
                                        paddingRight: 4,
                                    }}>
                                    <Text
                                        style={{
                                            alignSelf: 'center',
                                            fontSize: 14,
                                        }}>
                                        🗺️
                                    </Text>
                                </View>

                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: '#bdbdbd',
                                        alignSelf: 'center',
                                        fontWeight: '600',
                                    }}>
                                    Öppna
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </CardItem>
            </ImageBackground>

            {showCity && (
                <View
                    style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        bottom: 10,
                        left: 15,
                        paddingTop: 5,
                    }}>
                    <Ionicons
                        color={colors.primary}
                        size={14}
                        name={'ios-pin'}
                        style={{ paddingRight: 6 }}
                    />
                    <Text
                        style={{
                            color: '#a8a8a8',
                            fontSize: 13,
                        }}>
                        {props.event.location.city}
                    </Text>
                </View>
            )}
            <Text
                style={{
                    paddingTop: 12,
                    fontSize: 12,
                    position: 'absolute',
                    right:
                        props.event.timeago && props.event.timeago.length * 2.5,
                    color: '#939393',
                }}>
                {randomClock()}{' '}
                <Text
                    note
                    style={{
                        paddingTop: 9,
                        fontWeight: '600',
                        fontSize: 13,
                        color: '#bdbdbd',
                    }}>
                    {props.event.timeago}
                </Text>
            </Text>
        </Card>
    );
};
