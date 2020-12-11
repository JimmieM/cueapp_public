/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
    StyleSheet,
    View,
    ScrollView,
    RefreshControl,
    Text,
} from 'react-native';
import { wait } from '../../helpers';
import { Signal, ShimmeringSignal } from './signal';
import { Heading } from '../heading';
import MapView from 'react-native-maps';
import { useTheme } from '@react-navigation/native';
import { ISignal } from '../../interfaces/signal';
import { Card, CardItem } from 'native-base';
import { usePush } from '../../hooks/use-push';

import { AppContext } from '../app-state';

interface SignalsFlowProps {
    isLoading: boolean;
    onRefresh: (refreshMap: boolean) => void;
    mapViewRef: MapView | null;
    signals: ISignal[] | null;
    setSignalMapExpanded: (expanded: boolean) => void;
}

export const SignalsFlow: React.FC<SignalsFlowProps> = (props) => {
    const {
        isLoading,
        onRefresh,
        mapViewRef,
        signals,
        setSignalMapExpanded,
    } = props;
    const { colors } = useTheme();
    const [loading, setIsLoading] = useState(isLoading);
    const [UpdateDeviceToken, checkPermission, pushPermission] = usePush();
    const [permissionInterval, setPermissionInterval] = useState<any>();
    const { appState } = useContext(AppContext);

    useEffect(() => {
        checkPermission();
        const _interval = setInterval(checkPermission, 6500);
        setPermissionInterval(_interval);
        setTimeout(() => setIsLoading(false), 1500);
    }, []);

    useEffect(() => {
        if (pushPermission && permissionInterval) {
            clearInterval(permissionInterval);
            UpdateDeviceToken();
        }
    }, [pushPermission]);

    useEffect(() => {
        onRefresh(false);
    }, [appState.user]);

    const refresh = useCallback(() => {
        setIsLoading(true);
        onRefresh(false);
        wait(1500).then(() => {
            setIsLoading(false);
        });
    }, []);

    const styles = StyleSheet.create({
        scrollView: {
            backgroundColor: colors.background,
            alignItems: 'center',
            paddingBottom: 115,
        },
        container: {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: colors.background,
            flexDirection: 'row',
        },
        view: {
            flex: 1,
            flexGrow: 1,
        },
    });

    return (
        <View
            style={{
                ...styles.view,
                paddingTop: 6,
                marginBottom: 35,
                backgroundColor: 'transparent',
            }}>
            {pushPermission === false && (
                <View style={{ alignItems: 'center' }}>
                    <NoPushPermission />
                </View>
            )}
            {pushPermission && (
                <ScrollView
                    contentContainerStyle={styles.scrollView}
                    refreshControl={
                        <RefreshControl
                            tintColor={colors.primary}
                            refreshing={loading}
                            onRefresh={refresh}
                        />
                    }>
                    {loading &&
                        Array(3)
                            .fill(Math.floor(Math.random() * 10000) + 1)
                            .map(() => <ShimmeringSignal />)}
                    {!loading && !signals && <CreateSignalCard />}

                    {signals && signals.length === 0 && !loading && (
                        <>
                            <CreateSignalCard />
                            <Text
                                style={{
                                    color: colors.text,
                                    alignSelf: 'flex-start',
                                    fontWeight: '700',
                                    fontSize: 22,
                                    marginTop: 3,
                                    padding: 12,
                                }}>
                                Förslag på signaler
                            </Text>
                            <Signal
                                onLocate={() => null}
                                signal={{
                                    id: 1,
                                    userId: 1,
                                    name: 'Hemma',
                                    position: {
                                        gps: {
                                            lat: 0,
                                            lng: 0,
                                        },
                                        city: 'Malmö',
                                        streetname: 'Sofiavägen',
                                        radius: 244,
                                        timestamp: 0,
                                    },
                                    eventType: [1, 6, 7, 8, 10, 12, 14],
                                    durationMinutes: 0,
                                    notified: false,
                                    listenerType: 'street',
                                    keywords: [],
                                    strictKeywords: false,
                                }}
                            />

                            <Signal
                                onLocate={() => null}
                                signal={{
                                    id: 1,
                                    userId: 1,
                                    name: 'Familj',
                                    position: {
                                        gps: {
                                            lat: 0,
                                            lng: 0,
                                        },
                                        city: 'Stockholm',
                                        streetname: 'Thomsons väg',
                                        radius: 1245,
                                        timestamp: 0,
                                    },
                                    eventType: [6, 7, 15, 12, 14],
                                    durationMinutes: 0,
                                    notified: false,
                                    listenerType: 'radius',
                                    keywords: [],
                                    strictKeywords: false,
                                }}
                            />
                        </>
                    )}
                    {signals && !loading && signals?.length > 0 && (
                        <Heading size={30} title={'Aktiva signaler'} />
                    )}
                    {signals &&
                        !loading &&
                        signals.map((signal) => (
                            <Signal
                                onLocate={(pos, longPress) => {
                                    mapViewRef &&
                                        mapViewRef.animateToRegion(
                                            {
                                                latitude: pos.latitude,
                                                longitude: pos.longitude,
                                                latitudeDelta: 0,
                                                longitudeDelta: 0,
                                            },
                                            1000,
                                        );

                                    if (longPress) {
                                        setTimeout(() => {
                                            setSignalMapExpanded(true);
                                        }, 1000);
                                    }
                                }}
                                key={signal.id}
                                onUpdate={refresh}
                                signal={signal}
                            />
                        ))}
                </ScrollView>
            )}
        </View>
    );
};

export const NoPushPermission = () => {
    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            width: '95%',
            alignSelf: 'center',
        },
        text: {
            color: '#e3e3e3',
            fontSize: 13,
            paddingTop: 5,
        },
    });

    return (
        <Card
            style={{
                borderRadius: 10,
                width: '95%',
                marginTop: 20,
                backgroundColor: '#232323',
                borderWidth: 0,
                height: 120,
                borderColor: 'transparent',
            }}>
            <CardItem
                style={{
                    backgroundColor: '#232323',
                    borderWidth: 0,
                    borderColor: 'transparent',
                    borderRadius: 10,
                    paddingTop: 18,
                }}>
                <Text
                    style={{
                        color: '#e3e3e3',
                        fontSize: 19,
                        fontWeight: 'bold',
                    }}>
                    ⏰ Skapa din första signal
                </Text>
            </CardItem>

            <View style={styles.row}>
                <Text style={styles.text}> 🔔 För att skapa signaler behöver du först aktivera push
                    notifkationer genom att gå till inställningar > Cue >
                    Notiser.</Text>
            </View>
        </Card>
    );
};

export const CreateSignalCard = () => {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            width: '100%',
            alignSelf: 'center',
            paddingLeft: 13,
        },
        text: {
            color: '#e3e3e3',
            fontSize: 13,
            paddingTop: 5,
        },
    });

    return (
        <Card
            style={{
                borderRadius: 10,
                width: '95%',
                marginTop: 17,
                backgroundColor: colors.card,
                borderWidth: 0,
                height: 140,
                borderColor: 'transparent',
            }}>
            <CardItem
                style={{
                    backgroundColor: colors.card,
                    borderWidth: 0,
                    borderColor: 'transparent',
                    borderRadius: 10,
                    paddingTop: 18,
                }}>
                <Text
                    style={{
                        color: '#e3e3e3',
                        fontSize: 19,
                        fontWeight: 'bold',
                    }}>
                    ⏰ Skapa din första signal.
                </Text>
            </CardItem>

            <View style={styles.row}>
                <Text style={styles.text}>
                    Du kan enkelt skapa en signal genom{'  '}
                </Text>
                <Ionicons
                    color={colors.primary}
                    size={25}
                    name={'ios-add'}
                    style={{ textAlign: 'center' }}
                />
                <Text style={styles.text}>
                    {'  '}
                    nedan.
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.text}>
                    Använd sedan kartan för att centrera en gata eller plats.
                </Text>
            </View>
            <View style={{...styles.row, paddingTop: 5}}>
                <Text style={styles.text}>
                    Efter val av position väljer du de brott du vill lyssna på.
                </Text>
            </View>
        </Card>
    );
};
