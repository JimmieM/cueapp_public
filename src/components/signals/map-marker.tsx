import React, { useState, useCallback, useMemo } from 'react';
import { View, Alert, Image, Animated } from 'react-native';
import { Region, Circle, LatLng } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { ISignal } from '../../interfaces/signal';
import { useSignals } from '../../hooks/use-signals';
import { useTheme } from '@react-navigation/native';
import { GetEventTypeById } from '../../models/event-type';

interface MapMarkerProps {
    key: number;
    signal: ISignal;
    animateToRegion: (region: Region) => void;
    onRefresh: () => void;
}

export const MapMarker: React.FC<MapMarkerProps> = (props) => {
    const [oldPosition, setOldPosition] = useState<LatLng | null>(null);
    const [, , , , editSignal] = useSignals();

    const { colors } = useTheme();

    const [showRadius, setShowRadius] = useState(false);
    const moveMarkerAlert = (onContinue: (move: boolean) => void) => {
        Alert.alert(
            'Flytta notis position?',
            '',
            [
                {
                    text: 'Flytta inte',
                    onPress: () => onContinue(false),
                    style: 'cancel',
                },
                { text: 'Ja', onPress: () => onContinue(true) },
            ],
            { cancelable: false },
        );
    };

    const EventEmojisString = useMemo(() => {
        let str = '';
        props.signal.eventType.map((d, i) => {
            const e = GetEventTypeById(d);
            if (e) {
                str += `${i > 1 ? ' ' : ''}${e.icon}`;
            }
        });
        return str === '' ? null : str + ' ';
    }, [props.signal.eventType]);

    return (
        <>
            {showRadius && props.signal.position.radius > 0 && (
                <Circle
                    key={`${props.signal.id}-circle`}
                    center={{
                        latitude:
                            oldPosition?.latitude ||
                            Number(props.signal.position.gps.lat),
                        longitude:
                            oldPosition?.longitude ||
                            Number(props.signal.position.gps.lng),
                    }}
                    radius={
                        props.signal.listenerType === 'city'
                            ? 0
                            : props.signal.position.radius
                    }
                    strokeWidth={1}
                    strokeColor={colors.primary}
                    fillColor={'#f2fbff17'} // rgba(214, 238, 249, 0.2);
                />
            )}
            <Marker
                title={props.signal.name}
                description={
                    props.signal.listenerType === 'radius'
                        ? `${
                              EventEmojisString
                                  ? EventEmojisString
                                  : 'händelser '
                          }inom ~${props.signal.position.radius}m`
                        : props.signal.listenerType === 'city'
                        ? `${
                              EventEmojisString
                                  ? EventEmojisString
                                  : 'händelser '
                          }inom hela ${props.signal.position.city}`
                        : `${
                              EventEmojisString
                                  ? EventEmojisString
                                  : 'händelser '
                          }på ${props.signal.position.streetname}`
                }
                key={props.key}
                draggable={true}
                onPress={() => setShowRadius(!showRadius)}
                coordinate={{
                    latitude: props.signal.position.gps.lat,
                    longitude: props.signal.position.gps.lng,
                }}
                onDrag={(event) => {
                    const coords = event.nativeEvent.coordinate;
                    setOldPosition(coords);
                }}
                onDragEnd={(event) => {
                    const coords = event.nativeEvent.coordinate;
                    if (
                        coords.latitude === props.signal.position.gps.lat &&
                        coords.longitude === props.signal.position.gps.lng
                    ) {
                        return;
                    }
                    moveMarkerAlert((move) => {
                        if (move) {
                            editSignal(
                                {
                                    ...props.signal,
                                    position: {
                                        ...props.signal.position,
                                        gps: {
                                            ...props.signal.position.gps,
                                            lat: coords.latitude,
                                            lng: coords.longitude,
                                        },
                                    },
                                },
                                (success: boolean) => {
                                    if (success) {
                                        props.animateToRegion({
                                            ...coords,
                                            latitudeDelta: 0,
                                            longitudeDelta: 0,
                                        });
                                    }
                                },
                            );
                        } else {
                            props.onRefresh();
                        }
                    });
                }}>
                <Animated.View>
                    <View>
                        <Image
                            source={require('../../assets/mysignal_marker.png')}
                            style={{ width: 40, height: 40 }}
                        />
                    </View>
                </Animated.View>
            </Marker>
        </>
    );
};
