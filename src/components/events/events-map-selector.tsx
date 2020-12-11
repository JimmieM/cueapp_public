import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    View,
    Image,
    Text,
    Animated,
    Alert,
} from 'react-native';
import MapView, { PROVIDER_DEFAULT, Region, Circle } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { usePositition } from '../../hooks/use-position';
import { ModalAlert } from '../modal-alert';
import { IEvent } from '../../interfaces/event';
import { useTheme } from '@react-navigation/native';
import { SignalMapSlider } from '../signals/signal-map-slider';

interface EventMapSelectorProps {
    onClose: (
        region: Region | undefined,
        radius?: number,
        input?: string,
    ) => void;
    event?: IEvent;
    promptOptions: {
        title: string;
        description: string;
        input: boolean;
        ContinueBtntitle: string;
    };
    consentModal: {
        title: string;
        description: string;
    };
}

export const PIN_MARKER_RADIUS = 300;

export const EventMapSelector: React.FC<EventMapSelectorProps> = (props) => {
    const { onClose, promptOptions, consentModal, event } = props;
    const { colors } = useTheme();
    const [intialPosition] = usePositition();
    const [currentRegion, setCurrentRegion] = useState<Region | undefined>();
    const [showConsentModal, setShowConsentModal] = useState(true);
    const [pinMarkerRadius, setPinMarkerRadius] = useState(30);
    const [selectedRegion, setSelectedRegion] = useState<Region | undefined>();
    // eslint-disable-next-line prefer-const

    const SelectPosition = useCallback(() => {
        setSelectedRegion(currentRegion);
    }, [currentRegion]);

    const AddEventAlert = (onContinue: (val: string) => void) => {
        Alert.prompt(
            promptOptions.title,
            promptOptions.description,
            [
                {
                    text: 'Avbryt',
                    style: 'cancel',
                },
                {
                    text: promptOptions.ContinueBtntitle,
                    onPress: (value) => onContinue(value || ''),
                },
            ],
            promptOptions.input ? 'plain-text' : 'default',
            '',
        );
    };

    const styles = StyleSheet.create({
        mapView: {
            ...StyleSheet.absoluteFillObject,

            width: 'auto',
            justifyContent: 'flex-end',
            alignItems: 'center',
            zIndex: 999,
        },
        map: {
            ...StyleSheet.absoluteFillObject,
        },
        sliderContainer: {
            width: '83%',
            marginBottom: 160,
            alignSelf: 'center',
            borderRadius: 7,
            padding: 7,
        },
    });

    return intialPosition ? (
        <>
            <View
                style={{
                    ...styles.mapView,
                }}>
                <MapView
                    provider={PROVIDER_DEFAULT}
                    style={styles.map}
                    onRegionChangeComplete={(r) => {
                        setCurrentRegion(r);
                    }}
                    followsUserLocation={true}
                    moveOnMarkerPress={true}
                    zoomEnabled={true}
                    initialRegion={{
                        latitude:
                            event?.location.gps.lat || intialPosition.gps.lat,
                        longitude:
                            event?.location.gps.lng || intialPosition.gps.lng,
                        latitudeDelta: 0.006,
                        longitudeDelta: 0.006,
                    }}>
                    {event && (
                        <Marker
                            title={'Trolig position'}
                            description={event.name}
                            key={event.location.gps.lat}
                            coordinate={{
                                latitude: event.location.gps.lat,
                                longitude: event.location.gps.lng,
                            }}>
                            <Animated.View>
                                <View>
                                    <Image
                                        source={require('../../assets/suggested-event-marker.png')}
                                        style={{ width: 40, height: 40 }}
                                    />
                                </View>
                            </Animated.View>
                        </Marker>
                    )}
                    {selectedRegion && (
                        <Marker
                            title={'Händelseplats'}
                            key={selectedRegion.latitude}
                            coordinate={selectedRegion}>
                            <Animated.View>
                                <View>
                                    <Image
                                        source={require('../../assets/suggested-event-marker.png')}
                                        style={{ width: 40, height: 40 }}
                                    />
                                </View>
                            </Animated.View>
                        </Marker>
                    )}
                    {selectedRegion && (
                        <Circle
                            key={pinMarkerRadius}
                            center={{
                                latitude: selectedRegion.latitude,
                                longitude: selectedRegion.longitude,
                            }}
                            radius={
                                pinMarkerRadius === PIN_MARKER_RADIUS
                                    ? 0
                                    : pinMarkerRadius
                            }
                            strokeWidth={1}
                            strokeColor={colors.primary}
                            fillColor={'#f2fbff17'} // rgba(214, 238, 249, 0.2);
                        />
                    )}
                    <Marker
                        title={'Jag'}
                        description={''}
                        key={intialPosition.gps.lat}
                        coordinate={{
                            latitude: intialPosition.gps.lat,
                            longitude: intialPosition.gps.lng,
                        }}>
                        <Animated.View>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 35,
                                    }}>
                                    🧙‍♂️
                                </Text>
                            </View>
                        </Animated.View>
                    </Marker>
                </MapView>
                {event && (
                    <View
                        style={{
                            position: 'absolute',
                            top: 40,
                            backgroundColor: colors.card,
                            padding: 10,
                            borderRadius: 7,
                            width: 'auto',
                            height: 'auto',
                        }}>
                        <Text
                            style={{
                                fontWeight: '600',
                                color: '#e3e3e3',
                                fontSize: 16,
                            }}>
                            {event.type}, {event.location.city}
                        </Text>
                        <Text
                            style={{
                                fontWeight: '400',
                                color: '#848484',
                                paddingTop: 2,
                                fontSize: 12,
                            }}>
                            {event.timeago} sedan
                        </Text>
                        <Text
                            style={{
                                fontWeight: '400',
                                color: '#e3e3e3',
                                paddingTop: 10,
                                fontSize: 13,
                            }}>
                            {event.summary}
                        </Text>
                    </View>
                )}

                <TouchableHighlight
                    underlayColor={'transparent'}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        marginTop: -70,
                        marginLeft: -25,
                    }}
                    onPress={SelectPosition}>
                    <Image
                        style={{
                            maxWidth: 50,
                            height: 70,
                        }}
                        source={require('../../assets/pin_center.png')}
                    />
                </TouchableHighlight>
            </View>

            {selectedRegion && (
                <SignalMapSlider
                    radius={pinMarkerRadius}
                    onRadiusChange={setPinMarkerRadius}
                    onCreate={() => {
                        AddEventAlert((name) => {
                            onClose(currentRegion, pinMarkerRadius, name);
                        });
                    }}
                    onClose={() => {
                        onClose(undefined);
                    }}
                />
            )}
            {showConsentModal && (
                <ModalAlert
                    title={consentModal.title}
                    description={consentModal.description}
                    continueBtnTitle={'Jag förstår'}
                    onClose={(pressedYes) => {
                        if (pressedYes) {
                            setShowConsentModal(false);
                        } else {
                            onClose(undefined, undefined);
                        }
                    }}
                />
            )}
        </>
    ) : (
        <Text>Loading...</Text>
    );
};
