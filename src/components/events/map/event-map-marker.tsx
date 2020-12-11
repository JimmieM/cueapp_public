import React, { useState, useCallback } from 'react';
import { Circle, Marker } from 'react-native-maps';
import { Text, View } from 'react-native';
import { IEvent } from '../../../interfaces/event';
import { GetEventTypeByName } from '../../../models/event-type';
import { useTheme } from '@react-navigation/native';
import { secondPrimaryColor } from '../../../../App';

interface EventMapMakrerProps {
    index: number;
    event: IEvent;
    onGoToEvent: (i: number) => void;
    onClick: (e: IEvent) => void;
}

export const EventMapMarker: React.FC<EventMapMakrerProps> = ({
    index,
    event,
    onGoToEvent,
    onClick,
}) => {
    const [showRadius, setShowRadius] = useState(false);
    const { colors } = useTheme();

    const onMarkerClick = useCallback(() => {
        onClick(event);
        !showRadius && onGoToEvent(index);
        if (event.location.radius > 0) setShowRadius((r) => !r);
    }, [event, index, onClick, onGoToEvent, showRadius]);
    return (
        <>
            {showRadius && (
                <Circle
                    key={`${index}_circle`}
                    center={{
                        latitude: event.location.gps.lat,
                        longitude: event.location.gps.lng,
                    }}
                    radius={event.location.radius || 1000}
                    strokeWidth={1}
                    strokeColor={colors.primary}
                    fillColor={'#f2fbff17'} // rgba(214, 238, 249, 0.2);
                />
            )}
            <Marker
                key={`${index}_marker`}
                onPress={onMarkerClick}
                identifier={`${event.id}`}
                coordinate={{
                    latitude: event.location.gps.lat,
                    longitude: event.location.gps.lng,
                }}
                title={event.summary}
                description={`${event.timeago} sedan`}
                style={{
                    minWidth: 40,
                    height: 40,
                }}>
                {event.authorized ? (
                    <Text style={{ fontSize: 24 }}>
                        {GetEventTypeByName(event.type)?.icon || ' ⁉️'}
                    </Text>
                ) : (
                    <View
                        style={{
                            backgroundColor: secondPrimaryColor,
                            padding: 4,
                            borderRadius: 5,
                            maxWidth: 25,
                            justifyContent: 'center',
                        }}>
                        <Text
                            style={{
                                fontSize: 14,
                                textAlign: 'center',
                            }}>
                            {GetEventTypeByName(event.type)?.icon || ' ⁉️'}
                        </Text>
                    </View>
                )}
            </Marker>
        </>
    );
};
