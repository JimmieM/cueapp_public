import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Alert,
    Image,
    Dimensions,
    TouchableHighlight,
    Animated,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Region, PROVIDER_DEFAULT, Circle } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { ISignal, ListenerType } from '../../interfaces/signal';
import { usePositition } from '../../hooks/use-position';
import { MapMarker } from './map-marker';
import { useTheme } from '@react-navigation/native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { IEvent } from '../../interfaces/event';
import { GetEventTypeByName } from '../../models/event-type';
import { SignalMapSlider } from './signal-map-slider';
import { ILatLng } from '../../interfaces/position';

const randNames = [
    'ur a wizard hagrid',
    'haha uh oh, stinky',
    'aww man',
    'thats me!',
    '',
    '',
    '',
    '',
    '',
    'haha uhh oh',
    '',
];
const randomName = randNames[Math.floor(Math.random() * randNames.length)];

export const PIN_MARKER_RADIUS = 1500;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const PlaceHolderSignalMap = () => {
    return (
        <View
            style={{
                alignItems: 'center',
                ...StyleSheet.absoluteFillObject,
            }}>
            <ShimmerPlaceHolder
                height={210}
                width={Dimensions.get('window').width}
                colorShimmer={['#1f1f1f', '#2a2a2a', '#1f1f1f']}
                autoRun={true}
            />
        </View>
    );
};

interface SignalMapProps {
    signals?: ISignal[];
    expandedProps: { expanded: boolean; event?: IEvent };
    region?: Region;
    onRefresh: () => void;
    onRefCallback: (mapView: MapView) => void;
    onResize: (props: { expandedProps: boolean; event?: IEvent }) => void;
    onCreateSignal: (
        region: Region,
        radius: number,
        listenerType: ListenerType,
    ) => void;
}

export const SignalMap: React.FC<SignalMapProps> = (props) => {
    const {
        signals,
        expandedProps,
        onRefCallback,
        onResize,
        onCreateSignal,
        onRefresh,
    } = props;
    const { colors } = useTheme();

    const [internalMapRef, setInternalMapRef] = useState<MapView | null>(null);
    const [showCenterMarker, setShowCenterMarker] = useState(true);
    const [currentRegion, setCurrentRegion] = useState<Region | undefined>();
    const [position] = usePositition();

    const [pinMarkerRadius, setPinMarkerRadius] = useState(0);

    const setRef = useCallback(
        (_ref: any) => {
            onRefCallback && onRefCallback(_ref);
            setInternalMapRef(_ref);
        },
        [onRefCallback],
    );

    const styles = StyleSheet.create({
        scrollView: {
            backgroundColor: '#151515',
            alignItems: 'center',
            paddingBottom: 50,
            flexGrow: 1,
        },
        smallHeader: {
            fontWeight: 'bold',
            fontSize: 15,
            paddingLeft: 15,

            paddingTop: 7,
            paddingBottom: 10,
            color: colors.text,
        },
        sliderContainer: {
            width: '83%',
            marginBottom: 11,
            left: 10,
            alignSelf: 'flex-start',
            borderRadius: 7,
            backgroundColor: '#000000c7',
            padding: 7,
        },
        container: {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#151515',
            flexDirection: 'row',
        },
        mapView: {
            ...StyleSheet.absoluteFillObject,
            height: expandedProps.expanded
                ? Dimensions.get('window').height - 175
                : 225,
            width: 'auto',
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'white',
            zIndex: 9,
        },
        map: {
            ...StyleSheet.absoluteFillObject,
        },
    });

    const animateToRegion = useCallback(
        (lt: Region, duration = 1000) => {
            if (internalMapRef) {
                internalMapRef.animateToRegion(lt, duration);
            }
        },
        [internalMapRef],
    );

    return (
        <>
            <View style={styles.mapView}>
                <MapView
                    ref={(_ref) => {
                        _ref && setRef(_ref);
                    }}
                    provider={PROVIDER_DEFAULT}
                    style={styles.map}
                    onRegionChangeComplete={setCurrentRegion}
                    followsUserLocation={true}
                    moveOnMarkerPress={true}
                    onRegionChange={setCurrentRegion}
                    initialRegion={
                        position
                            ? {
                                  latitude: position.gps.lat,
                                  longitude: position.gps.lng,
                                  latitudeDelta: 0.008,
                                  longitudeDelta: 0.008,
                              }
                            : undefined
                    }>
                    {signals &&
                        signals.map((p, i) => (
                            <MapMarker
                                onRefresh={onRefresh}
                                key={i}
                                signal={p}
                                animateToRegion={animateToRegion}
                            />
                        ))}

                    {currentRegion &&
                        showCenterMarker &&
                        expandedProps.expanded &&
                        pinMarkerRadius > 0 && (
                            <Circle
                                key={pinMarkerRadius}
                                center={{
                                    latitude: currentRegion.latitude,
                                    longitude: currentRegion.longitude,
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

                    {position && (
                        <Marker
                            title={'Jag'}
                            description={randomName}
                            key={position.gps.lat}
                            coordinate={{
                                latitude: position.gps.lat,
                                longitude: position.gps.lng,
                            }}>
                            <Animated.View>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 35,
                                        }}>
                                        🕵️
                                    </Text>
                                </View>
                            </Animated.View>
                        </Marker>
                    )}

                    {expandedProps.event && (
                        <Marker
                            key={expandedProps.event.id}
                            coordinate={{
                                latitude: expandedProps.event.location.gps.lat,
                                longitude: expandedProps.event.location.gps.lng,
                            }}
                            title={expandedProps.event.summary}
                            description={`${expandedProps.event.timeago} sedan`}
                            style={{
                                width: 80,
                                height: 40,
                            }}>
                            {
                                <Text style={{ fontSize: 24 }}>
                                    {GetEventTypeByName(
                                        expandedProps.event.type,
                                    )?.icon || ' ⁉️'}
                                </Text>
                            }
                        </Marker>
                    )}
                </MapView>

                {showCenterMarker && expandedProps.expanded && (
                    <TouchableHighlight
                        underlayColor={'transparent'}
                        style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            marginTop: -40,
                            marginLeft: -25,
                        }}>
                        <Image
                            style={{
                                maxWidth: 55,
                                height: 75,
                            }}
                            source={require('../../assets/pin_center.png')}
                        />
                    </TouchableHighlight>
                )}
                {pinMarkerRadius === PIN_MARKER_RADIUS && showCenterMarker && (
                    <Text
                        style={{
                            position: 'absolute',
                            top: 45,

                            shadowColor: 'black',
                            shadowOpacity: 0.6,
                            shadowRadius: 7,
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 15,
                            width: '80%',
                            textAlign: 'center',
                        }}>
                        Signalen täcker hela staden.
                    </Text>
                )}

                {!expandedProps.expanded && position && (
                    <Ionicons
                        style={{
                            padding: 0,
                            bottom: 20,
                            right: 20,
                            left: 0,
                            position: 'absolute',
                            textAlign: 'right',
                        }}
                        onPress={() => {
                            animateToRegion({
                                latitude: position.gps.lat,
                                longitude: position.gps.lng,
                                latitudeDelta: 0.009,
                                longitudeDelta: 0.009,
                            });
                        }}
                        name={'ios-locate'}
                        size={30}
                        color={'#bdbdbd'}
                    />
                )}

                {!expandedProps.expanded && (
                    <Ionicons
                        onPress={() => {
                            onResize({ expandedProps: true });
                        }}
                        style={{
                            textAlign: 'center',
                            padding: 0,
                            bottom: -2,
                            right: 60,
                            left: 60,
                            position: 'absolute',
                        }}
                        name={'ios-arrow-down'}
                        size={35}
                        color={colors.text}
                    />
                )}
            </View>
            {expandedProps.expanded && showCenterMarker && (
                <SignalMapSlider
                    onClose={() => {
                        onResize({ expandedProps: false });
                        setPinMarkerRadius(0);
                    }}
                    radius={pinMarkerRadius}
                    onRadiusChange={setPinMarkerRadius}
                    onCreate={() => {
                        if (currentRegion) {
                            onCreateSignal(
                                currentRegion,
                                pinMarkerRadius,
                                pinMarkerRadius === 0
                                    ? 'street'
                                    : pinMarkerRadius === PIN_MARKER_RADIUS
                                    ? 'city'
                                    : 'radius',
                            );
                        }
                    }}
                />
            )}
        </>
    );
};
