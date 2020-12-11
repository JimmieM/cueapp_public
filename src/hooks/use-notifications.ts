import { post } from '../services/api';
import { useState, useCallback, useEffect, useContext } from 'react';
import { INotification } from '../interfaces/notifications';
import { AppContext } from '../components/app-state';

export const useNotifications = (): [INotification[] | null, () => void] => {
    const [notifications, setNotifications] = useState<INotification[] | null>(
        null,
    );
    const { appState } = useContext(AppContext);

    const GetNotifications = useCallback(() => {
        if (appState.user) {
            post(
                'notifications/latest',
                JSON.stringify({
                    userId: appState.user.id,
                }),
            )
                .then((r) => r.json())
                .then(async (response) => {
                    if (response.success) {
                        setNotifications(response.data);
                    }
                });
        }
    }, [appState.user]);

    useEffect(() => {
        if (appState.user) {
            GetNotifications();
        }
    }, [GetNotifications, appState.user]);

    return [notifications, GetNotifications];
};
