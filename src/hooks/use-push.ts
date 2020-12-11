import { useEffect, useCallback, useState, useContext, useRef } from 'react';
import PushNotificationIOS, {
    PushNotificationPermissions,
} from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import { usePositition } from './use-position';
import { post } from '../services/api';
import { AppContext } from '../components/app-state';
import { Platform, AsyncStorage } from 'react-native';
import { IUser } from '../interfaces/user';
import { Toast } from 'native-base';
import { IPosition } from '../interfaces/position';

export const usePush = (): [
    () => void,
    () => void,
    boolean | undefined,
    () => void,
] => {
    //const [user, whoAmI] = useUser();
    const { appState, setAppState } = useContext(AppContext);
    const [permission, setPermission] = useState<boolean | undefined>(
        undefined,
    );
    const [deviceToken, setDeviceToken] = useState<string>();
    const positionRef = useRef<IPosition | null>(null);
    const [position] = usePositition(appState.user === null);

    const UpdateDeviceToken = useCallback(() => {
        if (appState.user?.device_token) return;
        if (!permission) return;

        PushNotification.setApplicationIconBadgeNumber(0);
        PushNotification.configure({
            onRegister: (tokenData) => {
                if (tokenData.token && tokenData.token !== '') {
                    setDeviceToken(tokenData.token);
                }
            },
            onNotification: (notification) => {
                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
    }, [appState.user, permission]);

    const requestPermission = useCallback(() => {
        if (Platform.OS === 'ios') {
            PushNotification.requestPermissions().then((res) => {
                if (!res.alert) {
                    setPermission(false);
                } else {
                    setPermission(true);
                }
            });
        } else {
            setPermission(true);
        }
    }, []);

    useEffect(() => {
        if (position) {
            positionRef.current = position;
            UpdateDeviceToken();
        }
    }, [UpdateDeviceToken, position]);

    const checkPermission = useCallback(() => {
        PushNotification.checkPermissions(
            (permissions: PushNotificationPermissions) => {
                setPermission(permissions.alert);
            },
        );
    }, []);

    useEffect(() => {
        checkPermission();
        if (permission) {
            UpdateDeviceToken();
        }
    }, [permission, position, appState.user, UpdateDeviceToken]);

    useEffect(() => {
        const pos = position || positionRef.current;

        if (!pos || !deviceToken) {
            return;
        }
        const deviceOS = Platform.OS;
        post(
            'user/whoami',
            JSON.stringify({
                deviceToken,
                deviceOS,
                position: pos,
            }),
        )
            .then((r) => r.json())
            .then(async (response) => {
                if (response.success) {
                    setAppState({
                        type: 'setUser',
                        nextUser: response.data as IUser,
                    });
                    await AsyncStorage.setItem(
                        'past-location',
                        JSON.stringify(response.data.position),
                    );
                } else {
                    FailedToGetUser();
                }
            })
            .catch(() => FailedToGetUser());
    }, [position, deviceToken, setAppState]);

    const FailedToGetUser = () => {
        Toast.show({
            text: 'Hmm, vi kunde inte hitta dig...',
            buttonText: 'Aight',
            position: 'top',
            duration: 3000,
        });
    };

    return [UpdateDeviceToken, checkPermission, permission, requestPermission];
};
