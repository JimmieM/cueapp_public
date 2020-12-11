import React from 'react';
import { Text, Dimensions, TouchableHighlight } from 'react-native';
import { IEvent } from '../../../interfaces/event';
import { CardItem, Card, Body, View, Button } from 'native-base';
import { Tag } from '../../tag';
import { randomClock, SuggestedUserIcon } from '../event';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface MapEventCardProps {
    event: IEvent;
    onProposeLocation: () => void;
    onCloseCardMenu: () => void;
}

export const MapEventCard: React.FC<MapEventCardProps> = (props) => {
    const { colors } = useTheme();
    return (
        <Card
            style={{
                borderRadius: 10,
                borderWidth: 0,
                width: Dimensions.get('window').width - 20,
                backgroundColor: 'transparent',
                paddingLeft: 0,
                marginRight: 10,
                marginLeft: 10,

                borderColor: 'transparent',
            }}>
            <CardItem
                style={{
                    backgroundColor: '#151515',
                    borderWidth: 0,
                    borderRadius: 10,
                    height: '100%',
                    width: Dimensions.get('window').width - 20,
                    borderColor: 'transparent',
                }}>
                <Body>
                    <Button
                        style={{
                            padding: 5,
                            right: 0,
                            height: 30,
                            paddingLeft: 10,
                            paddingRight: 10,
                            width: 'auto',
                            backgroundColor: 'transparent',
                            position: 'absolute',
                            borderRadius: 15,
                        }}
                        onPress={props.onCloseCardMenu}>
                        <Text
                            style={{
                                fontSize: 14,
                                color: colors.primary,
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}>
                            Stäng
                        </Text>
                    </Button>
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#e3e3e3',
                            fontWeight: 'bold',
                            paddingTop: 5,
                        }}>
                        {randomClock()} {props.event.timeago} sedan
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            padding: !props.event.authorized ? 6 : 0,
                        }}>
                        {!props.event.authorized && (
                            <View
                                style={{
                                    paddingTop: 5,
                                }}>
                                {SuggestedUserIcon()}
                            </View>
                        )}

                        <Text
                            style={{
                                marginTop: 10,
                                fontSize: 13,
                                color: colors.text,
                            }}>
                            {props.event.location.city}, {props.event.type}
                        </Text>
                    </View>

                    <Text
                        style={{
                            marginTop: 15,
                            fontSize: 15,
                            color: colors.text,
                        }}>
                        {props.event.summary}
                    </Text>

                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            marginTop: 10,
                        }}>
                        {props.event.keywords.map((keyword) => (
                            <Tag
                                key={keyword}
                                name={keyword}
                                hideClose={true}
                            />
                        ))}
                    </View>
                    {props.event.LocationGPSType === 'initial' && (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                            }}>
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: '#e3e3e3',
                                }}>
                                Händelse saknar exakt position
                            </Text>
                            <TouchableHighlight
                                underlayColor={'transparent'}
                                onPress={() => {
                                    props.onProposeLocation();
                                }}>
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
                                            color: colors.primary,
                                            fontSize: 13,
                                            marginTop: 5,
                                            fontWeight: '500',
                                        }}>
                                        {'  '}
                                        Föreslå
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    )}
                </Body>
            </CardItem>
        </Card>
    );
};
