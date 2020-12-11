import { useState, useCallback, useEffect, useContext } from 'react';
import { post } from '../services/api';
import { ISignal, ICreateSignal } from '../interfaces/signal';
import { Toast } from 'native-base';
import { AppContext } from '../components/app-state';

export const useSignals = (
    autoLoad = false,
): [
    ISignal[] | null,
    () => void,
    (signal: ICreateSignal, onSuccess?: () => void) => void,
    (id: number, onSuccess?: () => void) => void,
    (signal: ICreateSignal, callback: (success: boolean) => void) => void,
    () => void,
] => {
    const [signals, setSignals] = useState<ISignal[] | null>(null);
    const { appState } = useContext(AppContext);

    const createSignal = useCallback(
        (signal: ICreateSignal, onSuccess?: () => void) => {
            if (!appState.user) {
                Toast.show({
                    text:
                        'Aktivera push notifikationer för att skapa signaler.',
                    buttonText: 'Oki!',
                    position: 'top',
                    type: 'danger',
                    duration: 3000,
                });
                return;
            }
            post(
                'signals/create',
                JSON.stringify({ userId: appState.user.id, signal }),
            )
                .then((res) => res.json())
                .then((response) => {
                    if (response.success) {
                        Toast.show({
                            text: 'Signal skapad 😄🔔',
                            buttonText: 'Oki!',
                            type: 'success',
                            position: 'top',
                            duration: 3000,
                        });
                        onSuccess && onSuccess();
                    }
                })
                .catch(() => {
                    Toast.show({
                        text: 'Kunde inte skapa signal 😔',
                        buttonText: 'Oki!',
                        position: 'top',
                        type: 'danger',
                        duration: 3000,
                    });
                });
        },
        [appState.user],
    );

    const deleteSignal = useCallback(
        (id: number, onSuccess?: () => void) => {
            if (!appState.user) return;
            post(
                'signals/delete',
                JSON.stringify({ userId: id, signal: { id } }),
            )
                .then((res) => res.json())
                .then((response) => {
                    if (response.success) {
                        onSuccess && onSuccess();
                    }
                });
        },
        [appState.user],
    );

    const fetchSignals = useCallback(() => {
        if (!appState.user) {
            return;
        }
        setSignals(null);

        post('signals', JSON.stringify({ userId: appState.user?.id }))
            .then((res) => res.json())
            .then((response) => {
                response.success
                    ? setSignals(response.data as ISignal[])
                    : setSignals([]);

                return response;
            })
            .catch(() => {
                setSignals([]);
                Toast.show({
                    text: 'Kunde inte hitta några signaler 😔',
                    buttonText: 'Stäng',
                    position: 'top',
                    type: 'warning',
                    duration: 3000,
                });
            });
    }, [appState.user]);

    const resetSignals = useCallback(() => {
        const s = signals;
        setSignals([]);
        setSignals(s);
    }, [signals]);

    const editSignal = useCallback(
        async (signal: ICreateSignal, callback: (success: boolean) => void) => {
            if (!appState.user) return;
            await post(
                'signals/edit',
                JSON.stringify({ userId: appState.user?.id, signal }),
            )
                .then((res) => res.json())
                .then((response) => {
                    if (response.success) {
                        fetchSignals();
                        Toast.show({
                            text: 'Signal uppdaterad! 🎉',
                            buttonText: 'Stäng',
                            position: 'top',
                            type: 'success',
                            duration: 3000,
                        });
                    }
                    callback(response.success);
                });
        },
        [appState.user, fetchSignals],
    );

    useEffect(() => {
        if (autoLoad && appState.user) {
            fetchSignals();
        }
    }, [appState.user, autoLoad, fetchSignals]);

    return [
        signals,
        fetchSignals,
        createSignal,
        deleteSignal,
        editSignal,
        resetSignals,
    ];
};
