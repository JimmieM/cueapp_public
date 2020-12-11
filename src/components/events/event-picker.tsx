import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { SignalChoice } from '../signals/signal-choice';

interface EventPickerProps {
    onSelect: (items: number[]) => void;
    maxSelect?: number;
}
export const EventPicker: React.FC<EventPickerProps> = (props) => {
    const [selected, setSelected] = useState<number[]>([]);

    const addSelectedSignalType = useCallback(
        (id: number, cb: (success: boolean) => void) => {            
            let toAdd;
            if (selected.includes(id)) {
                toAdd = selected.filter((e) => e !== id);
            } else {
                if (props.maxSelect && selected.length >= props.maxSelect) {
                    cb(false);
                    return;
                }
                toAdd = [...selected, id];
            }
            setSelected(toAdd);
            props.onSelect(toAdd);
            cb(true);
        },
        [selected, props],
    );

    const styles = StyleSheet.create({
        containersWrapper: {
            alignItems: 'center',
            marginTop: 30,
        },

        container: {
            flexDirection: 'row',
            justifyContent: 'center',
        },
    });

    return (
        <View style={styles.containersWrapper}>
            <View style={styles.container}>
                <SignalChoice
                    id={1}
                    color={'#197278'}
                    icon={'💥🚗'}
                    name={'Bilolyckor'}
                    onSelect={addSelectedSignalType}
                />
                <SignalChoice
                    id={2}
                    color={'#d8a48f'}
                    icon={'🥴🍺'}
                    name={'Fylleri'}
                    onSelect={addSelectedSignalType}
                />
                <SignalChoice
                    id={17}
                    color={'#5390d9'}
                    icon={'🙍‍♂️❓'}
                    name={'Försvunnen'}
                    onSelect={addSelectedSignalType}
                />
                <SignalChoice
                    id={4}
                    color={'#8e9aaf'}
                    icon={'👮‍♂️✋'}
                    name={'Kontroller'}
                    onSelect={addSelectedSignalType}
                />
            </View>

            <View style={styles.container}>
                <SignalChoice
                    id={5}
                    color={'#555b6e'}
                    icon={'🐗'}
                    name={'Vilt'}
                    onSelect={addSelectedSignalType}
                />
                <SignalChoice
                    id={6}
                    color={'#f48c06'}
                    icon={'🔥'}
                    name={'Bränder'}
                    onSelect={addSelectedSignalType}
                />
                <SignalChoice
                    id={7}
                    color={'#a08794'}
                    icon={'👊😡'}
                    name={'Bråk'}
                    onSelect={addSelectedSignalType}
                />
                <SignalChoice
                    id={8}
                    color={'#714674'}
                    icon={'🤫'}
                    name={'Stöld'}
                    onSelect={addSelectedSignalType}
                />
            </View>
            <View style={styles.container}>
                <SignalChoice
                    id={9}
                    color={'#b36a5e'}
                    icon={'💊'}
                    name={'Narkotika'}
                    onSelect={addSelectedSignalType}
                />
                <SignalChoice
                    id={10}
                    color={'#9d4edd'}
                    icon={'😵🗡️'}
                    name={'Mord'}
                    onSelect={addSelectedSignalType}
                />
                <SignalChoice
                    id={11}
                    color={'#ef8354'}
                    icon={'💣'}
                    name={'Bomber'}
                    onSelect={addSelectedSignalType}
                />
                <SignalChoice
                    id={12}
                    color={'#ffa69e'}
                    icon={'🤫'}
                    name={'Inbrott'}
                    onSelect={addSelectedSignalType}
                />
            </View>

            <View style={styles.container}>
                <SignalChoice
                    id={13}
                    color={'#f15152'}
                    icon={'🐶'}
                    name={'Djur'}
                    onSelect={addSelectedSignalType}
                />
                <SignalChoice
                    id={14}
                    color={'#1e555c'}
                    icon={'🔫'}
                    name={'Pewpew'}
                    onSelect={addSelectedSignalType}
                />
                <SignalChoice
                    id={15}
                    color={'#ef476f'}
                    icon={'👢'}
                    name={'Överfall'}
                    onSelect={addSelectedSignalType}
                />
                <SignalChoice
                    id={16}
                    color={'#3e07c6'}
                    icon={'📰'}
                    name={'Övrigt'}
                    onSelect={addSelectedSignalType}
                />
            </View>
        </View>
    );
};
