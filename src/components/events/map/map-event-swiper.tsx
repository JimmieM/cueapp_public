import React, { useState, useEffect, useMemo } from 'react';
import {
    Text,
    View,
    Dimensions,
    Animated,
    StyleSheet,
    Button,
    Linking,
    Alert,
    AsyncStorage,
    Platform,
} from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { useTheme } from '@react-navigation/native';
import { IEvent } from '../../../interfaces/event';
import { GetEventTypeByName } from '../../../models/event-type';
import { Ionicons } from '@expo/vector-icons';
import { SuggestedUserIcon } from '../event';
import { useEvents } from '../../../hooks/use-events';

const { height } = Dimensions.get('window');

export const isLessThaniPhoneX = () => {
    const dim = Dimensions.get('window');
    return dim.height < 812;
};

interface MapEventSwiperProps {
    event: IEvent;
    eventsWithSameLocation?: IEvent[];
    onProposeEventLocation: (e: IEvent) => void;
    onChangeEvent: (e: IEvent, ewsl?: IEvent[]) => void;
}
export const MapEventSwiper: React.FC<MapEventSwiperProps> = ({
    event,
    onProposeEventLocation,
    eventsWithSameLocation,
    onChangeEvent,
}) => {
    const _draggedValue = new Animated.Value(140);
    const { reportEvent } = useEvents(true);
    const [reported, setReported] = useState(false);

    const iphoneXandLessSupport =
        isLessThaniPhoneX() && Platform.OS === 'ios' ? 170 : 0;

    const { top, bottom } = {
        top: height + (30 + iphoneXandLessSupport),
        bottom: 140,
    };
    const { colors } = useTheme();
    useEffect(() => {
        HasReported();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const GetMyReports = async () => {
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
    };

    const HasReported = async () => {
        const reports = await GetMyReports();
        if (reports && !!reports.length && reports.includes(event.id)) {
            setReported(true);
        }
    };

    const Report = async () => {
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
                            event.id,
                            async (success) => {
                                if (success) {
                                    const reports = await GetMyReports();
                                    const newArr = [...reports, event.id];
                                    await AsyncStorage.setItem(
                                        'SuggestedEventsReports',
                                        JSON.stringify(newArr),
                                    );
                                    setReported(true);
                                }
                            },
                            () => null,
                        );
                    },
                },
            ],
            { cancelable: false },
        );
    };

    const EventType = useMemo(() => {
        return event && GetEventTypeByName(event.type)?.icon;
    }, [event]);

    const textTranslateY = _draggedValue.interpolate({
        inputRange: [bottom, top],
        outputRange: [0, 8],
        extrapolate: 'clamp',
    });

    const textTranslateX = _draggedValue.interpolate({
        inputRange: [bottom, top],
        outputRange: [0, -50],
        extrapolate: 'clamp',
    });

    const textScale = _draggedValue.interpolate({
        inputRange: [bottom, top],
        outputRange: [1, 0.7],
        extrapolate: 'clamp',
    });

    const styles = StyleSheet.create({
        container: {
            height: '100%',
            backgroundColor: colors.background,
            flexDirection: 'column',
            padding: 20,
        },
        panel: {
            backgroundColor: 'white',
            position: 'relative',
            flex: 1,
        },
        panelHeader: {
            height: 140,
            backgroundColor: colors.background,
            justifyContent: 'flex-end',
            padding: 24,
        },
        textHeader: {
            fontSize: 23,
            color: '#FFF',
        },
        iconBg: {
            backgroundColor: event
                ? GetEventTypeByName(event.type)?.iconColor || colors.primary
                : colors.primary,
            position: 'absolute',
            top: -24,
            right: 18,
            width: 55,
            height: 55,
            paddingTop: EventType ? (EventType?.length < 3 ? 12 : 14) : 12,
            borderRadius: 50,
            zIndex: 1,
        },
        infoItem: {
            marginTop: 15,
            alignItems: 'flex-start',
            flexDirection: 'row',
            backgroundColor: colors.card,
            padding: 10,
            paddingLeft: 10,
            borderRadius: 10,
        },
    });

    return event ? (
        <SlidingUpPanel
            backdropOpacity={0.5}
            draggableRange={{
                top: top - 500,
                bottom,
            }}
            animatedValue={_draggedValue}
            snappingPoints={[]}
            friction={1}>
            <View style={styles.panel}>
                <Animated.View style={styles.iconBg}>
                    <Text
                        style={{
                            alignSelf: 'center',
                            fontSize: EventType
                                ? EventType?.length <= 3
                                    ? 30
                                    : 21
                                : 25,
                        }}>
                        {EventType || ' ⁉️'}
                    </Text>
                </Animated.View>
                <View style={styles.panelHeader}>
                    <Animated.View
                        style={{
                            marginTop: 10,
                            transform: [
                                { translateY: textTranslateY },
                                { translateX: textTranslateX },
                                { scale: textScale },
                            ],
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}>
                            {!event.authorized && SuggestedUserIcon()}
                            <Text style={styles.textHeader}>
                                {event.summary}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 5,
                            }}>
                            <Ionicons
                                color={colors.primary}
                                size={20}
                                name={'ios-pin'}
                                style={{ paddingTop: 2 }}
                            />
                            <Text
                                style={{
                                    color: '#a8a8a8',
                                    alignSelf: 'center',
                                    paddingLeft: 7,
                                }}>
                                {event.location.city}, {event.timeago} sedan
                            </Text>
                        </View>
                    </Animated.View>
                </View>

                <View style={styles.container}>
                    {eventsWithSameLocation &&
                        eventsWithSameLocation.length > 0 && (
                            <View
                                style={{
                                    ...styles.infoItem,
                                    flexDirection: 'column',
                                }}>
                                <View style={{ alignItems: 'flex-start' }}>
                                    <Text
                                        style={{
                                            fontSize: 17.5,
                                            paddingLeft: 3,
                                            paddingTop: 5,
                                            color: '#e3e3e3',
                                            fontWeight: '600',
                                        }}>
                                        Händelser nära
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        alignItems: 'flex-start',
                                        marginTop: 6,
                                        marginLeft: 3,
                                    }}>
                                    {eventsWithSameLocation.map(
                                        (e, i) =>
                                            i < 9 && (
                                                <View
                                                    key={e.id}
                                                    style={{
                                                        flexDirection: 'row',
                                                    }}>
                                                    <View
                                                        style={{
                                                            backgroundColor:
                                                                GetEventTypeByName(
                                                                    e.type,
                                                                )?.iconColor ||
                                                                '#997b66',
                                                            width: 30,
                                                            justifyContent:
                                                                'center',
                                                            marginTop: 7,

                                                            marginRight: 4,
                                                            height: 30,
                                                            borderRadius: 7,
                                                        }}>
                                                        <Text
                                                            style={{
                                                                alignSelf:
                                                                    'center',
                                                                fontSize: 10,
                                                            }}>
                                                            {GetEventTypeByName(
                                                                e.type,
                                                            )?.icon || '⁉️'}
                                                        </Text>
                                                    </View>
                                                    <Button
                                                        color={colors.primary}
                                                        onPress={() => {
                                                            onChangeEvent(
                                                                e,

                                                                eventsWithSameLocation.filter(
                                                                    (ews) =>
                                                                        ews.id !==
                                                                        e.id,
                                                                ),
                                                            );
                                                        }}
                                                        title={
                                                            e.summary.length >=
                                                            33
                                                                ? `${e.summary
                                                                      .substr(
                                                                          0,
                                                                          33,
                                                                      )
                                                                      .trim()
                                                                      .replace(
                                                                          ',',
                                                                          ' ',
                                                                      )}...`
                                                                : e.summary
                                                        }
                                                    />
                                                </View>
                                            ),
                                    )}
                                </View>
                            </View>
                        )}
                    {event.authorized && (
                        <View style={styles.infoItem}>
                            <View
                                style={{
                                    backgroundColor: '#457b9d',
                                    width: 40,
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    marginRight: 7,
                                    height: 40,
                                    borderRadius: 10,
                                }}>
                                <Text
                                    style={{
                                        alignSelf: 'center',
                                        fontSize: 27,
                                    }}>
                                    📰
                                </Text>
                            </View>

                            <View
                                style={{
                                    alignItems: 'flex-start',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        paddingLeft: 5,
                                        color: '#e3e3e3',
                                    }}>
                                    Visa händelse från Polisen.
                                </Text>
                                <Button
                                    color={colors.primary}
                                    onPress={() => {
                                        Linking.openURL(event.url);
                                    }}
                                    title={'Öppna i webbläsare'}
                                />
                            </View>
                        </View>
                    )}
                    {!event.authorized && (
                        <View style={styles.infoItem}>
                            <View
                                style={{
                                    backgroundColor: '#641220',
                                    width: 40,
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    marginRight: 7,
                                    height: 40,
                                    borderRadius: 10,
                                }}>
                                <Text
                                    style={{
                                        alignSelf: 'center',
                                        fontSize: 27,
                                    }}>
                                    🚩
                                </Text>
                            </View>

                            <View
                                style={{
                                    alignItems: 'flex-start',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        paddingLeft: 5,
                                        color: '#e3e3e3',
                                    }}>
                                    Rapportera händelse
                                </Text>
                                <Button
                                    disabled={reported}
                                    color={colors.primary}
                                    onPress={Report}
                                    title={'Rapportera'}
                                />
                            </View>
                        </View>
                    )}
                    {event.LocationGPSType === 'initial' && (
                        <View style={styles.infoItem}>
                            <View
                                style={{
                                    backgroundColor: '#4a1e1e',
                                    width: 40,
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    marginRight: 7,
                                    height: 40,
                                    borderRadius: 10,
                                }}>
                                <Text
                                    style={{
                                        alignSelf: 'center',
                                        fontSize: 27,
                                    }}>
                                    📍
                                </Text>
                            </View>
                            <View
                                style={{
                                    alignItems: 'flex-start',
                                }}>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        paddingLeft: 5,
                                        color: '#e3e3e3',
                                    }}>
                                    Händelse saknar exakt position.
                                </Text>
                                <Button
                                    color={colors.primary}
                                    onPress={() => {
                                        onProposeEventLocation(event);
                                    }}
                                    title={'Föreslå'}
                                />
                            </View>
                        </View>
                    )}
                    {event.authorized &&
                        event.suggestedEvents &&
                        event.suggestedEvents.length > 0 && (
                            <View
                                style={{
                                    ...styles.infoItem,
                                    flexDirection: 'row',
                                    padding: 15,
                                    paddingLeft: 20,
                                }}>
                                {SuggestedUserIcon()}
                                <Text
                                    style={{
                                        color: '#e3e3e3',
                                        fontSize: 14,
                                        alignSelf: 'center',
                                    }}>
                                    Tidigare rapporterat av{' '}
                                    {event.suggestedEvents.length} personer
                                </Text>
                            </View>
                        )}
                </View>
            </View>
        </SlidingUpPanel>
    ) : null;
};
