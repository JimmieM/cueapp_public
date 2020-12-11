import React, { useCallback, useContext } from 'react';
import {
    StyleSheet,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
    Modal,
    Dimensions,
    TouchableHighlight,
    Alert,
} from 'react-native';
import { Text, View, Card, CardItem, Toast } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Heading } from '../heading';
import { useTheme } from '@react-navigation/native';
import { TutorialSmallCard } from './tutorial';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { post } from '../../services/api';
import { AppContext } from '../app-state';

export const Profile: React.FC<{ open: boolean; onClose: () => void }> = ({
    open,
    onClose,
}) => {
    const { colors } = useTheme();
    const { appState } = useContext(AppContext);

    const ReportBugAlert = () => {
        Alert.prompt(
            'Rapportera bugg',
            'Beskriv nedan vad det är som inte fungerar.',
            [
                {
                    text: 'Avbryt',
                    style: 'cancel',
                },
                {
                    text: 'Skicka',
                    onPress: (desc) => {
                        if (desc === undefined || desc === '') {
                            Toast.show({
                                text: 'Beskrivning krävs',
                                buttonText: 'Ok',
                                type: 'warning',
                                position: 'top',
                                duration: 3000,
                            });
                        } else {
                            ReportBug(desc);
                        }
                    },
                },
            ],
            'plain-text',
        );
    };

    const ReportBug = useCallback(
        (desc: string) => {
            if (!appState.user) {
                Toast.show({
                    text:
                        'För att rappoerta fel behöver du ha ett konto genom att aktivera push notiser.',
                    buttonText: 'Ok',
                    type: 'warning',
                    position: 'top',
                    duration: 3000,
                });
            }
            post(
                'user/report-bug',
                JSON.stringify({
                    userId: user?.id,
                    description: desc,
                }),
            )
                .then((r) => r.json())
                .then(async (response) => {
                    if (response.success) {
                        Toast.show({
                            text: 'Tack! 👷',
                            buttonText: 'Stäng',
                            type: 'success',
                            position: 'top',
                            duration: 3000,
                        });
                    } else {
                        Toast.show({
                            text: 'Något gick snett...',
                            buttonText: 'Stäng',
                            type: 'warning',
                            position: 'top',
                            duration: 3000,
                        });
                    }
                });
        },
        [appState.user],
    );

    const makeid = () => {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 9; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength),
            );
        }
        return result;
    };

    const styles = StyleSheet.create({
        centeredView: {
            marginTop: 125,
            width: '100%',
            minHeight: Dimensions.get('window').height - 125,
        },
        center: {
            alignItems: 'center',
        },
        modalView: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: colors.background,
            borderRadius: 15,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 5,
        },
        containersWrapper: {
            alignItems: 'center',
        },
        buttons: {
            flexDirection: 'row',
            position: 'absolute',
            bottom: 0,
            padding: 10,
        },
        button: {
            backgroundColor: colors.primary,
            flex: 1,
            margin: 5,
        },
        buttonText: {
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: 'bold',
            fontSize: 18,
            color: 'white',
            flex: 1,
        },
    });

    return open ? (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Modal animationType="slide" transparent={true} visible={true}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Heading title={'Min profil'} />
                            <Card
                                style={{
                                    borderRadius: 10,
                                    width: '95%',
                                    backgroundColor: colors.card,
                                    borderWidth: 0,
                                    height: 100,
                                    alignItems: 'flex-start',
                                    borderColor: 'transparent',
                                }}>
                                <CardItem
                                    style={{
                                        backgroundColor: colors.card,
                                        borderWidth: 0,
                                        borderColor: 'transparent',
                                        borderRadius: 10,
                                    }}>
                                    <View>
                                        <Text
                                            style={{
                                                color: '#e3e3e3',
                                                fontSize: 24,
                                                fontWeight: 'bold',
                                                padding: 10,
                                            }}>
                                            Hej användare!
                                        </Text>
                                        <View>
                                            <Text
                                                style={{
                                                    color: '#e3e3e3',
                                                    fontSize: 15,
                                                    fontWeight: '400',
                                                    paddingTop: 0,
                                                    padding: 10,
                                                }}>
                                                #{appState.user?.id || 0}-
                                                {makeid()}
                                            </Text>
                                        </View>
                                    </View>
                                </CardItem>
                            </Card>

                            <Text
                                style={{
                                    color: colors.text,
                                    fontWeight: 'bold',
                                    fontSize: 15,
                                    paddingTop: 20,
                                    paddingLeft: 15,
                                    alignSelf: 'flex-start',
                                }}>
                                Vad vill du göra?
                            </Text>
                            <View
                                style={{
                                    width: '95%',
                                }}>
                                <TouchableOpacity onPress={ReportBugAlert}>
                                    <TutorialSmallCard
                                        title={'Rapportera ett fel'}
                                        icon={'🚧'}
                                        bg={'#fdffb6'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <TouchableHighlight
                        underlayColor={'red'}
                        style={{
                            bottom: 40,
                            width: 60,
                            alignSelf: 'center',
                            elevation: 2,
                            padding: 0,
                            position: 'absolute',
                            backgroundColor: '#ef233c',
                            borderRadius: 50,
                            height: 60,
                        }}
                        onPress={() => {
                            onClose();
                        }}>
                        <Ionicons
                            color="white"
                            size={60}
                            name={'ios-close'}
                            style={{ textAlign: 'center' }}
                        />
                    </TouchableHighlight>
                </Modal>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    ) : null;
};
