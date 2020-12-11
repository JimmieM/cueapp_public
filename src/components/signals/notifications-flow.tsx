/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    RefreshControl,
    Text,
} from 'react-native';
import { wait } from '../../helpers';
import { ShimmeringSignal } from './signal';
import { Heading } from '../heading';
import { useTheme } from '@react-navigation/native';
import { useNotifications } from '../../hooks/use-notifications';
import { Notification } from './notification';
import { IEvent } from '../../interfaces/event';

interface NotificationsFlowProps {
    setSignalMapExpanded: (expanded: boolean, event?: IEvent) => void;
    OnGoEvent: (event: IEvent) => void;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const NotificationsFlow: React.FC<NotificationsFlowProps> = (props) => {
    const [notifications, refreshNotifcations] = useNotifications();
    const { colors } = useTheme();

    const [loading, setIsLoading] = useState(!notifications);

    const refresh = React.useCallback(() => {
        setIsLoading(true);

        refreshNotifcations();
        wait(1500).then(() => setIsLoading(false));
    }, [refreshNotifcations]);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1500);
    }, []);

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
        view: {
            flex: 1,
        },
    });

    return (
        <View
            style={{
                ...styles.view,
                paddingTop: 6,
                backgroundColor: 'transparent',
            }}>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        tintColor={colors.primary}
                        refreshing={loading}
                        onRefresh={refresh}
                    />
                }>
                {!notifications && !loading && (
                    <Heading
                        size={21}
                        title={'Dina senaste notiser visas här'}
                    />
                )}

                {loading &&
                    Array(3)
                        .fill(Math.floor(Math.random() * 10000) + 1)
                        .map(() => <ShimmeringSignal />)}

                {notifications && !loading && notifications?.length > 0 && (
                    <Heading size={26} title={'Dina senaste notiser'} />
                )}

                {notifications && !loading && notifications.length === 0 && (
                    <Text
                        style={{
                            alignSelf: 'center',
                            marginTop: 50,
                            color: colors.text,
                            fontSize: 14,
                        }}>
                        Dina senaste signaler visas här.
                    </Text>
                )}
                {notifications &&
                    !loading &&
                    notifications.map((notification) => (
                        <Notification
                            notification={notification}
                            onShowOnMap={props.OnGoEvent}
                        />
                    ))}
            </ScrollView>
        </View>
    );
};
