import React, { useState, useCallback } from 'react';

import { StyleSheet, View, Text, Platform } from 'react-native';
import { IEvent } from '../../../interfaces/event';
import { useTheme } from '@react-navigation/native';
import { Button } from 'native-base';

export const MapFilterToggler: React.FC<{
    setSelectedEvents: (events: IEvent[]) => void;
    events: IEvent[];
}> = (props) => {
    const { colors } = useTheme();
    const { setSelectedEvents, events } = props;
    const [selectedEventsDate, setSelectedEventsDate] = useState<1 | 2 | 3>(1);

    const ToggleEventsDate = useCallback(() => {
        if (selectedEventsDate === 1) {
            // two hours
            setSelectedEvents(
                events.filter((e) => {
                    const date = new Date(e.datetime);
                    return date.getTime() > Date.now() - 1000 * 170 * 60;
                }),
            );
            setSelectedEventsDate(2);
        } else if (selectedEventsDate === 2) {
            // 30 min
            setSelectedEvents(
                events.filter((e) => {
                    const date = new Date(e.datetime);
                    return date.getTime() > Date.now() - 1000 * 60 * 60;
                }),
            );
            setSelectedEventsDate(3);
        } else if (selectedEventsDate === 3) {
            // today
            setSelectedEvents(
                events.filter((e) => {
                    const today = new Date();
                    today.setDate(today.getDate() + 1);

                    return new Date(e.datetime).getTime() < today.getTime();
                }),
            );

            setSelectedEventsDate(1);
        }
    }, [events, selectedEventsDate, setSelectedEvents]);

    const EventsDateText = useCallback(() => {
        if (selectedEventsDate === 1) return 'Idag';
        else if (selectedEventsDate === 2) return 'Senaste 2h';
        else return 'Senaste 30 min';
    }, [selectedEventsDate]);

    const styles = StyleSheet.create({
        eventSelectorContainer: {
            width: 'auto',
            height: 50,
            top: Platform.OS === 'ios' ? 40 : 15,
            position: 'absolute',
        },
        MapOptionButton: {
            backgroundColor: colors.card,
            padding: 7,
            paddingRight: 15,
            margin: 5,
            paddingLeft: 15,
            borderRadius: 30,
        },
        mapOptionButtonText: {
            color: colors.primary,
            fontWeight: 'bold',
            fontSize: 13,
        },
    });

    return (
        <>
            <View style={styles.eventSelectorContainer}>
                <View>
                    <Button
                        style={styles.MapOptionButton}
                        onPress={ToggleEventsDate}>
                        <Text style={styles.mapOptionButtonText}>
                            {EventsDateText()}
                        </Text>
                    </Button>
                </View>
            </View>
        </>
    );
};
