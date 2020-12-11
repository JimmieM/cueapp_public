import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableHighlight,
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Heading } from '../heading';
import { useTheme } from '@react-navigation/native';
import { EventPicker } from './event-picker';
import { Toast } from 'native-base';
import { useEvents } from '../../hooks/use-events';
import { LoadingIndicator } from '../loading-indicator';
import { EventMapSelector } from './events-map-selector';
import { ICreateSuggestedEvent } from '../../interfaces/event';

interface EventTypePickerModalProps {
    onClose: (selected: number | null) => void;
}

const EventTypePickerModal: React.FC<EventTypePickerModalProps> = (props) => {
    const { colors } = useTheme();
    const [selected, setSelected] = useState<number | null>(null);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Modal animationType="slide" transparent={true} visible={true}>
                    <View style={styles.centeredView}>
                        <View
                            style={{
                                ...styles.modalView,
                            }}>
                            <Heading title={'Skapa händelse'} />
                            <Text
                                style={{
                                    color: colors.text,
                                    marginLeft: 15,
                                    marginBottom: 10,
                                }}>
                                Använd denna funktion om du exempelvis har hört
                                en detonation, varit med om ett brott eller
                                liknande.
                            </Text>
                            <View
                                style={{
                                    alignItems: 'center',
                                    flex: 1,
                                }}>
                                <EventPicker
                                    maxSelect={1}
                                    onSelect={(_selected) => {
                                        if (_selected.length > 1) {
                                            Toast.show({
                                                text:
                                                    'Du kan inte välja fler än 1 händelsetyper',
                                                position: 'top',
                                                duration: 3500,
                                                buttonText: 'Ok',
                                            });
                                        } else {
                                            setSelected(_selected[0]);
                                        }
                                    }}
                                />
                            </View>
                        </View>

                        <TouchableHighlight
                            underlayColor={'#7b7b7b'}
                            style={{
                                ...styles.closeButton,
                                backgroundColor: '#939393',
                                right: selected
                                    ? windowWidth / 2 + 10
                                    : windowWidth / 2 - 30,
                            }}
                            onPress={() => {
                                props.onClose(null);
                            }}>
                            <Ionicons
                                color="white"
                                size={50}
                                name={'ios-close'}
                                style={{
                                    padding: 0,
                                    margin: 0,
                                    top: 0,
                                    textAlign: 'center',
                                }}
                            />
                        </TouchableHighlight>

                        {selected && (
                            <TouchableHighlight
                                underlayColor={'#06a078'}
                                style={{
                                    ...styles.doneButton,
                                    backgroundColor: colors.primary,
                                }}
                                onPress={() => {
                                    props.onClose(selected);
                                }}>
                                <Ionicons
                                    color="white"
                                    size={60}
                                    name={'ios-checkmark'}
                                    style={{
                                        padding: 0,
                                        margin: 0,
                                        top: 0,
                                        textAlign: 'center',
                                    }}
                                />
                            </TouchableHighlight>
                        )}
                    </View>
                </Modal>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

interface CreateEventProps {
    display: boolean;
    onClose: (refresh: boolean) => void;
}

export const CreateEvent: React.FC<CreateEventProps> = (props) => {
    const { onClose } = props;
    const [step, setStep] = useState(1);

    const [loading, setLoading] = useState(false);

    const { createEvent } = useEvents(true);

    const [selected, setSelected] = useState<number>();

    return (
        <View
            style={{
                zIndex: 9,
                height: '100%',
            }}>
            <LoadingIndicator display={loading} />
            {step === 1 ? (
                <EventTypePickerModal
                    onClose={(selected) => {
                        if (selected) {
                            setSelected(selected);
                            setStep((e) => e + 1);
                        } else {
                            onClose(false);
                        }
                    }}
                />
            ) : (
                <EventMapSelector
                    promptOptions={{
                        title: 'Skapa händelse här?',
                        description: 'Ange händelsebeskrivning nedan',
                        ContinueBtntitle: 'Skapa',
                        input: true,
                    }}
                    consentModal={{
                        title: 'Händelseplats',
                        description:
                            'Använd kartan för att föreslå en specifik plats där händelsen utspelade sig.',
                    }}
                    onClose={(region, radius, name) => {
                        if (region === undefined) {
                            onClose(false);
                        } else {
                            if (!name) {
                                Toast.show({
                                    text: 'Händelsebeskrivning saknas...',
                                    buttonText: 'Aight',
                                    position: 'top',
                                    type: 'danger',
                                    duration: 3000,
                                });
                                onClose(false);
                                return;
                            }

                            if (selected && region && name) {
                                const event: ICreateSuggestedEvent = {
                                    type: selected,
                                    location: {
                                        gps: {
                                            lat: region.latitude,
                                            lng: region.longitude,
                                        },
                                        radius: radius,
                                        timestamp: Date.now(),
                                    },
                                    description: name,
                                };
                                setLoading(true);
                                createEvent(event, () => {
                                    setLoading(false);
                                    onClose(true);
                                });
                            } else {
                                onClose(false);
                            }
                        }
                    }}
                />
            )}
        </View>
    );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
    },
    modalView: {
        width: '100%',
        height: '63%',
        display: 'flex',
        margin: 20,
        backgroundColor: '#2a2a2a',
        borderRadius: 15,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },

    closeButton: {
        right: windowWidth / 2 + 10,
        top: Dimensions.get('window').height - 200,
        position: 'absolute',
        backgroundColor: '#F194FF',
        borderRadius: 50,
        height: 63,
        paddingTop: 6,
        width: 63,
        padding: 7,

        shadowColor: '#3f3f3f',
        shadowOpacity: 0.7,
        shadowRadius: 5,
    },
    doneButton: {
        right: windowWidth / 2 - 60,
        top: Dimensions.get('window').height - 200,
        position: 'absolute',
        backgroundColor: '#F194FF',
        borderColor: '#21fdb7',
        shadowColor: '#3f3f3f',
        shadowOpacity: 0.8,
        shadowRadius: 8,
        borderRadius: 50,
        height: 60,
        paddingTop: 1,
        width: 60,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        paddingTop: 5,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingLeft: 4,
        paddingRight: 4,
        fontSize: 13,
    },
});
