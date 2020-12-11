import React from 'react';
import { Card, CardItem, Body, Text, View } from 'native-base';
import { ISignal } from '../../interfaces/signal';
import { Tag } from '../tag';
import { Ionicons } from '@expo/vector-icons';
import {
    TouchableNativeFeedback,
    Alert,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { useSignals } from '../../hooks/use-signals';
import { LatLng } from 'react-native-maps';
import { useTheme } from '@react-navigation/native';

import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { EventIcon } from '../events/event';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface SignalProps {
    signal: ISignal;
    onUpdate?: () => void;
    onLocate: (coords: LatLng, longPress: boolean) => void;
}

export const ShimmeringSignal = () => {
    return (
        <View style={{ width: '95%' }}>
            <ShimmerPlaceHolder
                style={{
                    borderRadius: 6,
                    marginBottom: 10,
                }}
                height={95}
                width={Dimensions.get('window').width - 20}
                colorShimmer={['#1f1f1f', '#2a2a2a', '#1f1f1f']}
                autoRun={true}
            />
        </View>
    );
};

export const Signal: React.FC<SignalProps> = (props) => {
    const [, , , deleteSignal] = useSignals();
    const { colors } = useTheme();

    const DeleteAlert = () => {
        Alert.alert(
            'Ta bort',
            'Är du säker?',
            [
                {
                    text: 'Ja',
                    onPress: () => {
                        deleteSignal(props.signal.id, () => {
                            props.onUpdate && props.onUpdate();
                        });
                    },
                    style: 'destructive',
                },
                {
                    text: 'Stäng',
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    };

    const EditAlert = () => {
        Alert.alert(
            'Redigera en signal',
            'Du kan redigera signalers positioner genom att öppna kartan och flytta dina signaler genom att håll ner och dra.',
            [
                {
                    text: 'Ok',
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    };

    const SignalOptions = () => {
        Alert.alert(
            props.signal.name,
            'Vad vill du göra?',
            [
                {
                    text: 'Ta bort',
                    onPress: () => {
                        DeleteAlert();
                    },
                    style: 'destructive',
                },
                {
                    text: 'Stäng',
                    style: 'cancel',
                },
                { text: 'Redigera', onPress: () => EditAlert() },
            ],
            { cancelable: false },
        );
    };

    return (
        <TouchableNativeFeedback onLongPress={() => SignalOptions()}>
            <Card
                style={{
                    borderRadius: 7,
                    width: '95%',
                    backgroundColor: colors.card,
                    minHeight: 105,
                    margin: 0,
                    borderWidth: 0,
                    borderColor: 'transparent',
                }}>
                <ImageBackground
                    source={require('../../assets/signal-bg.png')}
                    style={{
                        width: '100%',
                        opacity: 0.95,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                    }}>
                    <CardItem
                        bordered={false}
                        style={{
                            borderRadius: 10,
                            backgroundColor: 'transparent',
                            borderWidth: 0,
                            height: 'auto',
                        }}>
                        <Body
                            style={{
                                minHeight: 90,
                            }}>
                            <View
                                style={{
                                    width: '90%',
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignSelf: 'flex-start',
                                        flexWrap: 'wrap',
                                    }}>
                                    {props.signal.eventType.map((type, i) => (
                                        <View
                                            key={i}
                                            style={{
                                                paddingRight: 5,
                                                marginBottom: 5,
                                            }}>
                                            <EventIcon
                                                size={10}
                                                eventType={
                                                    props.signal.eventType[i]
                                                }
                                            />
                                        </View>
                                    ))}
                                </View>
                            </View>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontWeight: 'bold',
                                    fontSize: 18.5,
                                }}>
                                {props.signal.name}
                            </Text>
                            <Text
                                style={{
                                    paddingTop: 3,
                                    fontSize: 13,
                                    color: '#dee2e6',
                                }}>
                                {props.signal.position.city}
                                {props.signal.position.streetname &&
                                    ', ' + props.signal.position.streetname}
                            </Text>
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    marginTop: 0,
                                    maxWidth: '90%',
                                }}>
                                {props.signal.keywords &&
                                    props.signal.keywords.map((keyword) => (
                                        <Tag
                                            key={keyword}
                                            name={keyword}
                                            small={true}
                                            hideClose={true}
                                        />
                                    ))}
                            </View>
                            <Text
                                style={{
                                    paddingTop: 10,
                                    fontSize: 13,
                                    color: '#939393',
                                }}>
                                {props.signal.listenerType === 'radius'
                                    ? `Du blir notifierad om händelser inom ~${
                                          props.signal.position.radius
                                      }m från ${
                                          props.signal.position.streetname || ''
                                      }.`
                                    : props.signal.listenerType === 'city'
                                    ? `Du blir notifierad på händelser i ${props.signal.position.city}.`
                                    : `Du får enbart notis på händelser på ${props.signal.position.streetname}.`}
                            </Text>
                        </Body>
                    </CardItem>
                </ImageBackground>
                <View
                    style={{
                        marginBottom: 5,
                        marginRight: 10,
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 50,
                        right: 0,
                        position: 'absolute',

                        top: 10,
                    }}>
                    <TouchableOpacity
                        onPress={() => {
                            props.onLocate(
                                {
                                    latitude: props.signal.position.gps.lat,
                                    longitude: props.signal.position.gps.lng,
                                },
                                true,
                            );
                        }}>
                        <Ionicons
                            style={{
                                paddingTop: 2,
                            }}
                            name={'ios-locate'}
                            size={30}
                            color={'#939393'}
                        />
                    </TouchableOpacity>
                </View>
            </Card>
        </TouchableNativeFeedback>
    );
};
