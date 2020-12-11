/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Dimensions, TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Container } from 'native-base';
import { useSignals } from '../../hooks/use-signals';
import { wait } from '../../helpers';
import { CreateSignal } from '../signals/create-signal';
import { SignalMap, PlaceHolderSignalMap } from '../signals/signal-map';
import MapView, { Region } from 'react-native-maps';
import { useTheme, CommonActions } from '@react-navigation/native';
import { ListenerType } from '../../interfaces/signal';
import { SignalsFlow } from '../signals/signals-flow';
import Swiper from 'react-native-swiper';
import { NotificationsFlow } from '../signals/notifications-flow';
import { IEvent } from '../../interfaces/event';

export const Signals: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [signalMapExpanded, setSignalMapExpanded] = useState<{
        expanded: boolean;
        event?: IEvent;
    }>({
        expanded: false,
    });

    const { colors } = useTheme();

    const [signals, refreshSignals] = useSignals(true);
    const [createOptions, setCreateOptions] = useState<{
        region: Region;
        radius: number;
        listenerType: ListenerType;
    }>();
    const [createSignalOpen, setCreateSignalOpen] = useState(false);

    const [mapViewRef, setMapViewRef] = useState<MapView | null>(null);

    const [loading, isLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => isLoading(false), 1500);
    }, []);

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

    const onRefresh = useCallback(
        (refreshMap = true) => {
            refreshMap && isLoading(true);
            refreshSignals();
            refreshMap && wait(1500).then(() => isLoading(false));
        },
        [refreshSignals],
    );

    const styles = StyleSheet.create({
        scrollView: {
            backgroundColor: colors.background,
            alignItems: 'center',
            paddingBottom: 50,
            flexGrow: 1,
        },
        container: {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: colors.background,
            flexDirection: 'row',
        },
        swiper: {},
        swiperView: {
            flex: 1,
            paddingTop: 220,
            flexGrow: 1,
            alignContent: 'center',
            justifyContent: 'center',
        },
    });

    return (
        <Container style={styles.container}>
            {loading && <PlaceHolderSignalMap />}
            {createSignalOpen &&
                signals !== null &&
                createOptions !== undefined && (
                    <CreateSignal
                        createOptions={createOptions}
                        display={createSignalOpen}
                        currentSignals={signals.length}
                        onClose={(refresh) => {
                            if (refresh) {
                                refreshSignals();
                                setSignalMapExpanded({ expanded: false });
                            }
                            setCreateSignalOpen(false);
                        }}
                    />
                )}
            {!loading && (
                <SignalMap
                    onRefresh={() => {
                        refreshSignals();
                    }}
                    signals={signals ? signals : undefined}
                    onRefCallback={setMapViewRef}
                    onResize={(props) => {
                        setSignalMapExpanded({
                            expanded: props.expandedProps,
                            event: props.event,
                        });
                    }}
                    expandedProps={signalMapExpanded}
                    onCreateSignal={(region, radius, listenerType) => {
                        setCreateOptions({ region, radius, listenerType });
                        setCreateSignalOpen(!createSignalOpen);
                    }}
                />
            )}

            <Swiper
                style={styles.swiper}
                height={Dimensions.get('window').height}
                loop={false}
                paginationStyle={{
                    bottom: 30,
                }}>
                <View style={styles.swiperView}>
                    <SignalsFlow
                        isLoading={loading}
                        onRefresh={onRefresh}
                        mapViewRef={mapViewRef}
                        signals={signals}
                        setSignalMapExpanded={(expanded) => {
                            setSignalMapExpanded({ expanded });
                        }}
                    />
                </View>

                <View style={styles.swiperView}>
                    <NotificationsFlow
                        OnGoEvent={onGoToLocation}
                        setSignalMapExpanded={(expanded, event) => {
                            setSignalMapExpanded({
                                expanded,
                                event,
                            });
                        }}
                    />
                </View>
            </Swiper>

            {!signalMapExpanded.expanded && (
                            <TouchableHighlight
                            style={{
                                bottom: 10,
                                width: signalMapExpanded.expanded ? 60 : 40,
                                elevation: 2,
                                padding: 0,
                                position: 'absolute',
            
                                backgroundColor: signalMapExpanded.expanded
                                    ? '#ef233c'
                                    : colors.primary,
                                borderRadius: 50,
                                height: signalMapExpanded.expanded ? 60 : 40,
                            }}
                            underlayColor={
                                signalMapExpanded.expanded ? '#e0384d' : '#03b385'
                            }
                            onPress={() => {
                                setSignalMapExpanded({
                                    expanded: !signalMapExpanded.expanded,
                                });
                            }}>
            
                                
                            <Ionicons
                                color="white"
                                size={ 40}
                                name={'ios-add'}
                                style={{ textAlign: 'center' }}
                            />
                        </TouchableHighlight>
            ) }

        </Container>
    );
};
