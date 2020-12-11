import React, { useState, useCallback, useContext } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableHighlight,
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    Alert,
    Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Heading } from '../heading';
import { IPosition } from '../../interfaces/position';
import { ScrollView } from 'react-native-gesture-handler';
import { Tag } from '../tag';
import { Region } from 'react-native-maps';
import { useSignals } from '../../hooks/use-signals';
import { useTheme } from '@react-navigation/native';
import { EventPicker } from '../events/event-picker';
import { EventTypes } from '../../models/event-type';
import { ListenerType } from '../../interfaces/signal';
import { AppContext } from '../app-state';

interface CreateSignalProps {
    display: boolean;
    onClose: (refresh: boolean) => void;
    createOptions: {
        region: Region;
        radius: number;
        listenerType: ListenerType;
    };
    position?: IPosition;
    currentSignals: number;
}

export const CreateSignal: React.FC<CreateSignalProps> = (props) => {
    const { onClose, display } = props;

    const [selected, setSelected] = useState<number[]>([]);
    const [, , createSignal] = useSignals();
    const { appState } = useContext(AppContext);
    const { colors } = useTheme();
    const [keywords, setKeywords] = useState<string[]>([]);
    const [keywordsMatchesOnly, setKeywordsMatchesOnly] = useState(false);

    const windowWidth = Dimensions.get('window').width;

    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 0,
        },
        center: {
            alignItems: 'center',
        },
        modalView: {
            width: '100%',
            height: '83%',
            display: 'flex',
            margin: 20,
            backgroundColor: '#2a2a2a',
            borderRadius: 15,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 5,
        },
        containersWrapper: {
            alignItems: 'center',
        },
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        closeButton: {
            right: windowWidth / 2 + 10,
            bottom: 50,
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
            bottom: 50,
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
        smallHeader: {
            fontWeight: 'bold',
            fontSize: 16,
            padding: 15,
            color: '#d3d3d3',
        },
        optionCard: {
            width: '95%',
            marginBottom: 12,
            backgroundColor: colors.background,
            borderRadius: 7,
            padding: 7,
        },
        modalText: {
            marginBottom: 15,
            textAlign: 'center',
        },
    });

    const close = useCallback(
        (refresh = false) => {
            onClose(refresh);
        },
        [onClose],
    );

    const toggleSwitch = () =>
        setKeywordsMatchesOnly((previousState) => !previousState);

    const createSignalAlert = (onContinue: (name: string) => void) => {
        Alert.prompt(
            'Namnge signal',
            '',
            [
                {
                    text: 'Avbryt',
                    style: 'cancel',
                },
                {
                    text: 'Spara',
                    onPress: (name) => {
                        onContinue(
                            name || `Signal #${props.currentSignals + 1}`,
                        );
                    },
                },
            ],
            'plain-text',
            `Signal #${props.currentSignals + 1}`,
        );
    };

    const addWordAlert = (onAdd: (word: string | undefined) => void) => {
        Alert.prompt(
            'Lägg till sökord',
            'Här kan du lägga in specifika ord du vill lyssna på. Gator, objekt eller vad som helst.\n\nTips: Separera dina ord med kommatecken.',
            [
                {
                    text: 'Stäng',
                    style: 'cancel',
                },
                {
                    text: 'Lägg till',
                    onPress: onAdd,
                },
            ],
            'plain-text',
        );
    };

    const addWordTag = (word: string | undefined) => {
        if (!word) {
            return;
        }
        const _keywords = word.split(',');
        _keywords.forEach((key) => {
            if (!keywords.includes(key)) {
                if (key.length > 2) {
                    setKeywords((w) => [...w, key]);
                }
            }
        });
    };

    const emoji = useCallback(() => {
        return EventTypes.find((d) => d.id === selected[0])?.icon || '🔔';
    }, [selected]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Modal animationType="slide" transparent={true} visible={true}>
                <View style={styles.centeredView}>
                        <View
                            style={styles.modalView}>
                            <Heading title={'Skapa signal'} />
                            <View
                                style={{
                                    alignItems: 'center',
                                    flex: 1,
                                }}>
                                <ScrollView
                                    style={{
                                        width: '100%',
                                    }}>
                                    <EventPicker
                                        onSelect={(s) => {
                                            setSelected(s);
                                        }}
                                    />
                                    <View style={styles.containersWrapper}>
                                        <View style={styles.optionCard}>
                                            <Text
                                                style={{
                                                    paddingLeft: 15,
                                                    paddingBottom: 10,
                                                    paddingTop: 10,
                                                    paddingRight: 15,
                                                    color: colors.text,
                                                    fontSize: 13,
                                                    alignSelf: 'flex-start',
                                                }}>
                                                {props.createOptions
                                                    .listenerType === 'radius'
                                                    ? '🧐 Försöker att enbart notifiera dig vid träffar på händelser inom ' +
                                                      props.createOptions
                                                          .radius +
                                                      ' meter.'
                                                    : props.createOptions
                                                          .listenerType ===
                                                      'city'
                                                    ? '🧐 Du får notifikation vid träffar på händelser inom samma stad '
                                                    : '🧐 Du får notifikation på händelser i närheten av angiven väg.'}
                                            </Text>

                                            <Text
                                                style={{
                                                    paddingLeft: 15,
                                                    paddingBottom: 10,
                                                    paddingTop: 10,
                                                    paddingRight: 15,
                                                    color: colors.text,
                                                    fontSize: 13,
                                                    alignSelf: 'flex-start',
                                                }}>
                                                {keywordsMatchesOnly
                                                    ? 'Notifierar dig enbart vid träff av en eller flera angivna sökord inom vald kategori'
                                                    : `${emoji()} ${
                                                          selected.length > 1
                                                              ? '...'
                                                              : ''
                                                      } Du blir notifierad så fort någonting händer inom ${
                                                          selected.length === 1
                                                              ? 'vald kategori.'
                                                              : selected.length >
                                                                0
                                                              ? 'valda kategorier.'
                                                              : 'de kategorier du väljer.'
                                                      }`}
                                            </Text>
                                        </View>

                                        <View style={styles.optionCard}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                }}>
                                                <Text
                                                    style={styles.smallHeader}>
                                                    Aktivera unika sökord
                                                </Text>

                                                <Switch
                                                    trackColor={{
                                                        false: '#767577',
                                                        true: '#3e3e3e',
                                                    }}
                                                    thumbColor={
                                                        keywordsMatchesOnly
                                                            ? colors.primary
                                                            : '#f4f3f4'
                                                    }
                                                    style={{
                                                        top: 10,
                                                        left: 5,
                                                    }}
                                                    ios_backgroundColor="#3e3e3e"
                                                    onValueChange={toggleSwitch}
                                                    value={keywordsMatchesOnly}
                                                />
                                            </View>
                                        </View>

                                        {keywordsMatchesOnly && (
                                            <View
                                                style={{
                                                    ...styles.optionCard,
                                                    marginBottom: 60,
                                                }}>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                    }}>
                                                    <Text
                                                        style={
                                                            styles.smallHeader
                                                        }>
                                                        Egna sökord
                                                    </Text>

                                                    <Ionicons
                                                        style={{}}
                                                        onPress={() => {
                                                            addWordAlert(
                                                                addWordTag,
                                                            );
                                                        }}
                                                        color={colors.primary}
                                                        size={45}
                                                        name={'ios-add'}
                                                    />
                                                </View>

                                                {keywords.length > 0 && (
                                                    <View
                                                        style={{
                                                            flexDirection:
                                                                'row',
                                                            flexWrap: 'wrap',
                                                            paddingTop: 3,
                                                            paddingLeft: 15,
                                                            paddingRight: 15,
                                                            paddingBottom: 15,
                                                        }}>
                                                        {keywords.map((k) => (
                                                            <Tag
                                                                key={k}
                                                                name={k}
                                                                onClose={() => {
                                                                    setKeywords(
                                                                        keywords.filter(
                                                                            (
                                                                                key,
                                                                            ) =>
                                                                                key !==
                                                                                k,
                                                                        ),
                                                                    );
                                                                }}
                                                            />
                                                        ))}
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                </ScrollView>
                            </View>
                        </View>

                        {display && (
                            <TouchableHighlight
                                underlayColor={'#a21c2c'}
                                style={{
                                    ...styles.closeButton,
                                    backgroundColor: '#ef233c',
                                    right:
                                        selected.length > 0
                                            ? windowWidth / 2 + 10
                                            : windowWidth / 2 - 30,
                                }}
                                onPress={close}>
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
                        )}
                        {selected.length > 0 && (
                            <TouchableHighlight
                                underlayColor={'#06a078'}
                                style={{
                                    ...styles.doneButton,
                                    backgroundColor: colors.primary,
                                }}
                                onPress={() => {
                                    createSignalAlert((name) => {
                                        if (appState.user) {
                                            createSignal(
                                                {
                                                    userId: appState.user.id,
                                                    position: {
                                                        gps: {
                                                            lat:
                                                                props
                                                                    .createOptions
                                                                    .region
                                                                    .latitude,
                                                            lng:
                                                                props
                                                                    .createOptions
                                                                    .region
                                                                    .longitude,
                                                        },
                                                        radius:
                                                            props.createOptions
                                                                .radius || 0,
                                                        timestamp: Date.now(),
                                                    },
                                                    keywords: keywords,
                                                    name: name,
                                                    eventType: selected,
                                                    listenerType:
                                                        props.createOptions
                                                            .listenerType,
                                                    strictKeywords: keywordsMatchesOnly,
                                                },
                                                () => {
                                                    close(true);
                                                },
                                            );
                                        }
                                    });
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
