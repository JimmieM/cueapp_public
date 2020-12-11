import { useEffect, useState, useCallback, useRef, useContext } from 'react';
import {
    IEvent,
    ICreateSuggestedEvent,
    ISuggestEventLocation,
} from '../interfaces/event';
import { post } from '../services/api';
import { usePositition } from './use-position';
import { Toast } from 'native-base';
import { AsyncStorage } from 'react-native';
import { IPosition } from '../interfaces/position';
import { AppContext } from '../components/app-state';

export type FetchEventType = 'all' | 'city' | 'country' | 'suggested';

export const useEvents = (
    dontRefresh?: boolean,
): {
    localEvents: IEvent[] | null;
    allEvents: IEvent[] | null;
    currentCity: string | undefined;
    suggestedLocalEvents: IEvent[] | null;
    fetchEvents: (type: FetchEventType) => void;
    createEvent: (event: ICreateSuggestedEvent, done: () => void) => void;
    suggestLocation: (event: ISuggestEventLocation, done: () => void) => void;
    reportEvent: (
        eventId: number,
        done: (success: boolean) => void,
        onRefresh: () => void,
    ) => void;
    upvoteEvent: (eventId: number, done: (success: boolean) => void) => void;
} => {
    const [localEvents, setLocalEvents] = useState<IEvent[] | null>([]);
    const [allEvents, setAllEvents] = useState<IEvent[] | null>([]);
    const [suggestedLocalEvents, setSuggestedLocalEvents] = useState<
        IEvent[] | null
    >([]);
    const [position, , permission] = usePositition(!dontRefresh);
    const positionRef = useRef<IPosition | null>(null);
    const [currentcity, setCurrentcity] = useState<string | undefined>(
        position?.city,
    );
    const { appState } = useContext(AppContext);

    const createNewEvent = useCallback(
        (event: ICreateSuggestedEvent, done: () => void) => {
            if (!appState.user) {
                loginToast('skapa händelser.');
                return;
            }
            post(
                'events/create',
                JSON.stringify({
                    suggestedEvent: { ...event, userId: appState.user.id },
                }),
            )
                .then((res) => res.json())
                .then((response) => {
                    if (!response.success) {
                        if (
                            response.data.errorMessage === 'ERR_LIMIT_REACHED'
                        ) {
                            Toast.show({
                                text: 'Du kan inte föreslå fler platser idag.',
                                buttonText: 'Oki!',
                                position: 'top',
                                type: 'warning',
                                duration: 3000,
                            });
                        } else {
                            Toast.show({
                                text: 'Kunde inte skapa händelse 😔',
                                buttonText: 'Oki!',
                                position: 'top',
                                type: 'warning',
                                duration: 3000,
                            });
                        }
                    } else {
                        Toast.show({
                            text: 'Tack! Händelsen blev registrerad ✅',
                            buttonText: 'Oki!',
                            position: 'top',
                            type: 'success',
                            duration: 3000,
                        });
                    }
                    done();
                })
                .catch((e) => {
                    Toast.show({
                        text: 'Kunde inte skapa händelse 😔',
                        buttonText: 'Oki!',
                        position: 'top',
                        type: 'danger',
                        duration: 3000,
                    });
                    done();
                });
        },
        [appState.user],
    );

    const loginToast = (action: string) => {
        Toast.show({
            text: `Aktivera push notifikationer för att ${action}`,
            buttonText: 'Oki!',
            position: 'top',
            type: 'warning',
            duration: 3000,
        });
    };

    const upvoteEvent = useCallback(
        (eventId: number, done: (success: boolean) => void) => {
            post(
                'events/upvote',
                JSON.stringify({
                    eventId,
                }),
            )
                .then((res) => res.json())
                .then((response) => {
                    if (!response.success) {
                        Toast.show({
                            text: 'Hmm något gick snett.',
                            buttonText: 'Okej',
                            position: 'top',
                            type: 'warning',
                            duration: 3000,
                        });
                    } else {
                        Toast.show({
                            text: 'Tack!',
                            buttonText: 'stäng',
                            position: 'top',
                            type: 'success',
                            duration: 3000,
                        });
                    }
                    done(response.success);
                })
                .catch(() => {
                    done(false);
                });
        },
        [],
    );

    const reportEvent = useCallback(
        (
            eventId: number,
            done: (success: boolean) => void,
            onRefresh: () => void,
        ) => {
            if (!appState.user) {
                onRefresh();
                return;
            }

            post(
                'events/report',
                JSON.stringify({
                    userId: appState.user.id,
                    eventId,
                }),
            )
                .then((res) => res.json())
                .then((response) => {
                    if (response.data) {
                        Toast.show({
                            text: 'Tack! Händelsen blev rapporterad! ✅',
                            buttonText: 'Stäng',
                            position: 'top',
                            type: 'success',
                            duration: 3000,
                        });
                    } else {
                        Toast.show({
                            text: 'Du verkar redan ha rapporterat denna..',
                            buttonText: 'Kanske det',
                            position: 'top',
                            type: 'warning',
                            duration: 3000,
                        });
                    }
                    done(response.success);
                })
                .catch((e) => {
                    done(false);
                });
        },
        [appState],
    );

    const suggestEventLocation = useCallback(
        (event: ISuggestEventLocation, done: () => void) => {
            if (!appState.user) {
                loginToast('föreslå händelse positioner.');
                return;
            }
            post(
                'events/suggestlocation',
                JSON.stringify({
                    suggestedLocation: { ...event, userId: appState.user.id },
                }),
            )
                .then((res) => res.json())
                .then((response) => {
                    if (response.data) {
                        Toast.show({
                            text: 'Tack! Positionen blev registrerad ✅',
                            buttonText: 'Oki!',
                            type: 'success',
                            position: 'top',
                            duration: 3000,
                        });
                    } else {
                        if (
                            response.data.errorMessage === 'ERR_LIMIT_REACHED'
                        ) {
                            Toast.show({
                                text: 'Du kan inte föreslå fler platser idag.',
                                buttonText: 'Oki!',
                                position: 'top',
                                type: 'warning',
                                duration: 3000,
                            });
                        }
                    }
                    done();
                })
                .catch(() => {
                    Toast.show({
                        text: 'Kunde inte föreslå händelse 😔',
                        buttonText: 'Oki!',
                        position: 'top',
                        type: 'warning',
                        duration: 3000,
                    });
                    done();
                });
        },
        [appState.user],
    );

    const resetALLEvents = () => {
        setLocalEvents([]);
        setAllEvents([]);
        setSuggestedLocalEvents([]);
    };

    const shouldUpdateCity = useCallback(() => {
        const pastLocation = AsyncStorage.getItem('past-location');

        if (!pastLocation) {
            return appState.user?.position.city || '';
        }

        return appState.user?.position.city;
    }, [appState.user]);

    const shouldUpdateCounty = useCallback(() => {
        const pastLocation = AsyncStorage.getItem('past-location');

        if (!pastLocation) {
            return appState.user?.position.county || '';
        }

        return appState.user?.position.county;
    }, [appState.user]);

    const fetchEvents = useCallback(
        (type: FetchEventType) => {
            if (!permission) {
                Toast.show({
                    text:
                        'Tillåt position för att kunna hämta händelser nära dig.',
                    buttonText: 'Oki!',
                    type: 'warning',
                    position: 'top',
                    duration: 3000,
                });
            }
            if (type === 'all') {
                setLocalEvents(null);
                setAllEvents(null);
                setSuggestedLocalEvents(null);
            }
            if (type === 'city') setLocalEvents(null);
            if (type === 'country') setAllEvents(null);
            if (type === 'suggested') setSuggestedLocalEvents(null);

            const pos =
                position || appState.user?.position || positionRef.current;

            post(
                'events',
                JSON.stringify({
                    position: pos && {
                        ...pos,
                        city: shouldUpdateCity(),
                        county: shouldUpdateCounty(),
                    },
                    userId: appState.user?.id,
                }),
            )
                .then((res) => res.json())
                .then((response) => {
                    if (response.data !== undefined) {
                        setCurrentcity(response.data.local.city);
                        setLocalEvents(response.data.local.events as IEvent[]);
                        setAllEvents(response.data.all as IEvent[]);
                        setSuggestedLocalEvents(
                            response.data.localSuggestions as IEvent[],
                        );
                    } else {
                        resetALLEvents();
                        Toast.show({
                            text: 'Kunde inte hitta några händelser 👮..',
                            buttonText: 'ok.',
                            position: 'top',
                            duration: 3000,
                        });
                    }
                })
                .catch(() => {
                    resetALLEvents();
                });
        },
        [
            permission,
            position,
            appState.user?.position,
            appState.user?.id,
            shouldUpdateCity,
            shouldUpdateCounty,
        ],
    );

    useEffect(() => {
        if (!dontRefresh) {
            positionRef.current = position;
            fetchEvents('all');
        }
    }, [dontRefresh, fetchEvents, position]);

    return {
        allEvents: allEvents,
        localEvents: localEvents,
        currentCity: currentcity,
        suggestedLocalEvents: suggestedLocalEvents,
        fetchEvents: fetchEvents,
        createEvent: createNewEvent,
        suggestLocation: suggestEventLocation,
        reportEvent: reportEvent,
        upvoteEvent: upvoteEvent,
    };
};
