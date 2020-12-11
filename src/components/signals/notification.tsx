/* eslint-disable react/jsx-key */
import React from 'react';
import { INotification } from '../../interfaces/notifications';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardItem, Body, Text, View } from 'native-base';
import { useTheme } from '@react-navigation/native';
import { EventIcon } from '../events/event';
import { GetEventTypeByName } from '../../models/event-type';
import { IEvent } from '../../interfaces/event';

interface NotificationProps {
    notification: INotification;
    onShowOnMap: (event: IEvent) => void;
}
export const Notification: React.FC<NotificationProps> = (props) => {
    const { colors } = useTheme();
    return (
        <Card
            style={{
                borderRadius: 7,
                width: '95%',
                backgroundColor: colors.card,
                margin: 0,
                borderWidth: 0,
                borderColor: 'transparent',
            }}>
            <CardItem
                bordered={false}
                style={{
                    borderRadius: 7,
                    backgroundColor: colors.card,
                    borderWidth: 0,
                    minHeight: 40,
                }}>
                <Body
                    style={{
                        minHeight: 40,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}>
                        <EventIcon
                            size={10}
                            eventType={
                                (props.notification.event &&
                                    GetEventTypeByName(
                                        props.notification.event.type,
                                    )?.id) ||
                                '❓'
                            }
                        />
                        <Text
                            style={{
                                color: colors.text,
                                fontWeight: 'bold',
                                fontSize: 15,
                                paddingLeft: 9,
                            }}>
                            {props.notification.event &&
                                props.notification.event.type}
                        </Text>
                    </View>

                    <Text
                        style={{
                            color: '#e3e3e3',
                            fontSize: 13,
                            paddingTop: 10,
                            width: '95%',
                        }}>
                        {props.notification.event &&
                            props.notification.event.summary}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}>
                        <View
                            style={{
                                marginTop: 10,
                                flexDirection: 'row',
                                marginRight: 16,
                            }}>
                            <Ionicons
                                color={'#8b8b8b'}
                                size={14}
                                name={'ios-pin'}
                                style={{ paddingRight: 5 }}
                            />
                            <Text
                                style={{
                                    color: '#8b8b8b',
                                    fontSize: 13,
                                }}>
                                {props.notification.event.location.city},{' '}
                                {props.notification.timeago} sedan
                            </Text>
                        </View>
                    </View>

                    <Ionicons
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                        }}
                        name={'ios-locate'}
                        size={30}
                        color={'#939393'}
                        onPress={() => {
                            props.onShowOnMap(props.notification.event);
                        }}
                    />
                </Body>
            </CardItem>
        </Card>
    );
};
