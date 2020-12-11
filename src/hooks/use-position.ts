import Geolocation from '@react-native-community/geolocation';
import { useState, useEffect, useCallback } from 'react';
import { IPosition, ILatLng } from '../interfaces/position';

const distanceBetweenLatLng = (l: ILatLng, t: ILatLng) => {
    const R = 6371e3; // metres
    const φ1 = (l.lat * Math.PI) / 180; // φ, λ in radians
    const φ2 = (t.lat * Math.PI) / 180;
    const Δφ = ((t.lat - l.lat) * Math.PI) / 180;
    const Δλ = ((t.lng - l.lng) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
};

export const usePositition = (
    autoload = true,
): [IPosition | null, () => void, boolean] => {
    const [position, setPosition] = useState<IPosition | null>(null);
    const [permission, setPermission] = useState(true);

    useEffect(() => {
        if (autoload) {
            refresh();
        }

        if (__DEV__) {
            Geolocation.getCurrentPosition = function (cb) {
                cb({
                    coords: {
                        latitude: 55.613849599999995,
                        longitude: 13.012172800000002,
                        accuracy: 1,

                        altitudeAccuracy: null,
                        heading: null,
                        speed: null,
                        altitude: null,
                    },
                    timestamp: Date.now(),
                });
            };
        }
    }, []);

    const refresh = useCallback(() => {
        Geolocation.getCurrentPosition(
            (info) => {
                let refreshCity = false;
                if (position) {
                    const meters = distanceBetweenLatLng(
                        {
                            lat: position?.gps.lat,
                            lng: position?.gps.lng,
                        },
                        {
                            lat: info.coords.latitude,
                            lng: info.coords.longitude,
                        },
                    );
                    if (meters > 2500) {
                        refreshCity = true;
                    }
                }

                setPosition({
                    gps: {
                        lat: info.coords.latitude,
                        lng: info.coords.longitude,
                    },
                    radius: 0,
                    timestamp: info.timestamp,
                    city: refreshCity ? undefined : position?.city,
                });
            },
            (err) => {
                if (
                    err.code === err.PERMISSION_DENIED ||
                    err.code === err.POSITION_UNAVAILABLE
                ) {
                    setPermission(false);
                }
            },
        );
    }, [position]);

    useEffect(() => {
        if (!permission) {
            Geolocation.requestAuthorization();
            refresh();
        }
    }, [permission, refresh]);

    return [position, refresh, permission];
};
