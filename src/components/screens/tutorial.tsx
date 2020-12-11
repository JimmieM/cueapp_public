import React, { useEffect, useState } from 'react';
import Swiper from 'react-native-swiper';
import {
    Image,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Platform,
    Modal,
} from 'react-native';
import {
    View,
    StyleSheet,
    Button,
    Text,
    AsyncStorage,
    Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Card, CardItem, Body } from 'native-base';
import { primaryColor } from '../../../App';
import { usePositition } from '../../hooks/use-position';
import { usePush } from '../../hooks/use-push';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Heading } from '../heading';

export const Icon: React.FC<{ icon: string; bg: string }> = (props) => (
    <View
        style={{
            alignSelf: 'flex-start',
            backgroundColor: props.bg || '#540b0e',
            marginTop: 5,
            borderRadius: 5,
            padding: 4,
            width: 34,
            height: 34,
        }}>
        <Text style={{ fontSize: 22 }}>{props.icon || '⁉️'}</Text>
    </View>
);

export const TutorialSmallCard: React.FC<{
    title: string;
    icon: string;
    bg: string;
}> = (props) => {
    return (
        <Card
            style={{
                borderRadius: 10,
                backgroundColor: '#212121',
                borderWidth: 0,
                width: '100%',
                marginTop: 12,
                borderColor: 'transparent',
            }}>
            <CardItem
                style={{
                    borderRadius: 15,
                    backgroundColor: '#212121',
                    borderWidth: 0,
                    width: '95%',
                }}>
                <Body>
                    <View
                        style={{
                            flexDirection: 'row',
                            maxWidth: '94%',
                        }}>
                        <Icon icon={props.icon} bg={props.bg} />
                        <Text
                            style={{
                                fontWeight: 'bold',
                                color: '#e3e3e3',
                                padding: 5,
                                paddingLeft: 8,
                                alignSelf: 'center',
                            }}>
                            {props.title}
                        </Text>
                    </View>
                </Body>
            </CardItem>
        </Card>
    );
};

export const Tutorial: React.FC<{ onTutorialDone: () => void }> = (props) => {
    const { colors } = useTheme();
    const [, , pushPermission, requestPushPermission] = usePush();
    const [, , geoPerimission] = usePositition();
    const [termsAndConditionOpen, setTermsAndConditionOpen] = useState(false);

    useEffect(() => {
        requestPushPermission();
    }, []);

    const styles = StyleSheet.create({
        swiper: {
            backgroundColor: '#151515',
        },
        header: {
            color: '#e3e3e3',
            fontSize: 22,
            fontWeight: 'bold',
        },
        view: {
            paddingTop: 45,
            flexGrow: 1,
            alignItems: 'center',
            paddingBottom: 60,
            backgroundColor: '#151515',
        },
        container: {
            justifyContent: 'center',
            alignContent: 'center',
        },
        tabButtonText: {
            color: colors.text,
            fontWeight: 'bold',
            fontSize: 23,
        },
    });

    return (
        <Swiper
            style={styles.swiper}
            showsButtons={false}
            loop={false}
            dot={
                <View
                    style={{
                        backgroundColor: 'rgba(255,255,255,.3)',
                        width: 13,
                        height: 13,
                        borderRadius: 7,
                        marginLeft: 7,
                        marginRight: 7,
                        bottom: 10,
                    }}
                />
            }
            activeDot={
                <View
                    style={{
                        backgroundColor: '#06d19c',
                        width: 13,
                        height: 13,
                        borderRadius: 7,
                        marginLeft: 7,
                        marginRight: 7,
                        bottom: 10,
                    }}
                />
            }
            paginationStyle={{
                bottom: 30,
            }}>
            <View
                style={{
                    ...styles.view,
                    paddingTop: 0,
                    paddingBottom: 0,
                    alignSelf: 'center',
                }}>
                <View
                    style={{
                        width: '85%',
                        height: '85%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                    }}>
                    <Image
                        style={{
                            flex: 1,
                            alignSelf: 'flex-start',
                            resizeMode: 'contain',
                            overflow: 'hidden',
                        }}
                        source={require('../../assets/tutorial/digitalmap.png')}
                    />
                    <View
                        style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                        <Text
                            style={{
                                ...styles.header,
                                padding: 7,
                                paddingLeft: 12,
                            }}>
                            Välkommen till Cue! 🎉
                        </Text>
                        <Text
                            style={{
                                color: '#a8a8a8',
                                paddingTop: 10,
                                fontWeight: '400',
                                textAlign: 'center',
                                fontSize: 14,
                            }}>
                            Appen utvecklad för dig som vill ha automatiska
                            notiser på relevanta brott och händelser.
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.view}>
                <View
                    style={{
                        alignItems: 'center',
                        zIndex: 9,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}>
                        <Icon icon={'🛰️'} bg={'#3a506b'} />
                        <Text
                            style={{
                                ...styles.header,
                                padding: 7,
                                paddingLeft: 12,
                                marginBottom: 20,
                            }}>
                            Övervaka hela Sverige
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,

                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            alignSelf: 'flex-start',
                        }}>
                        <Image
                            style={{
                                flex: 1,
                                resizeMode: 'contain',
                            }}
                            source={require('../../assets/tutorial/map.png')}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.view}>
                <View
                    style={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}>
                        <Icon icon={'🗺️'} bg={'#a1683a'} />
                        <Text
                            style={{
                                ...styles.header,
                                padding: 7,
                                paddingLeft: 12,
                                marginBottom: 20,
                            }}>
                            Placera en ny signal
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                        }}>
                        <Image
                            style={{
                                flex: 1,
                                resizeMode: 'contain',
                            }}
                            source={require('../../assets/tutorial/signalradius.png')}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.view}>
                <View
                    style={{
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}>
                        <Icon icon={'🔔'} bg={'#bb9457'} />
                        <Text
                            style={{
                                ...styles.header,
                                padding: 7,
                                paddingLeft: 12,
                            }}>
                            Anpassa signal
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                        }}>
                        <Image
                            style={{
                                flex: 1,
                                resizeMode: 'contain',
                            }}
                            source={require('../../assets/tutorial/createsignal.png')}
                        />
                    </View>
                </View>
            </View>

            <View style={{ ...styles.view, paddingTop: 170 }}>
                <View
                    style={{
                        width: '95%',
                    }}>
                    <TutorialSmallCard
                        title={
                            'Bli notifierad när andra personer har rapporterat en händelse nära dig.'
                        }
                        icon={'🔔'}
                        bg={'#bb9457'}
                    />
                    <TutorialSmallCard
                        title={'Händelser direkt från Polisen.'}
                        icon={'👮🏼‍♀️'}
                        bg={'#577399'}
                    />
                    <TutorialSmallCard
                        title={
                            'Bevaka och bli notifierad först på händelser baserat på brott, radius, vägar, städer och nyckelord.'
                        }
                        icon={'🕵🏽‍♂️'}
                        bg={'#e0b1cb'}
                    />
                </View>
                <View
                    style={{
                        width: '95%',
                    }}>
                    {termsAndConditionOpen && (
                        <TermsAndConditionsModal
                            onClose={() => {
                                setTermsAndConditionOpen(false);
                            }}
                        />
                    )}
                    {!pushPermission && (
                        <TutorialSmallCard
                            title={
                                'Tillåt push notifikationer för att Cue enkelt ska kunna notifiera dig. Gå till inställningar > Cue > Notiser och sedan aktivera.'
                            }
                            icon={'⚠️'}
                            bg={'#ff6d00'}
                        />
                    )}

                    {!geoPerimission && (
                        <TutorialSmallCard
                            title={
                                'Tillåt position för att kunna hämta relevanta händelser för dig.'
                            }
                            icon={'⚠️'}
                            bg={'#ff6d00'}
                        />
                    )}
                    <View
                        style={{
                            marginTop: 90,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignSelf: 'center',
                                marginBottom: 7,
                            }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    alignSelf: 'center',
                                    color: '#e3e3e3',
                                }}>
                                Genom att fortsätta godkänner du våra{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setTermsAndConditionOpen(true);
                                }}>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        alignSelf: 'center',
                                        color: '#e3e3e3',

                                        textDecorationLine: 'underline',
                                    }}>
                                    regler och villkor
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Button
                            color={primaryColor}
                            title={
                                !pushPermission
                                    ? 'Fortsätt till Cue ändå'
                                    : 'Fortsätt till Cue'
                            }
                            onPress={async () => {
                                await AsyncStorage.setItem(
                                    'TutorialDone',
                                    'true',
                                );
                                props.onTutorialDone();
                            }}
                        />
                    </View>
                </View>
            </View>
        </Swiper>
    );
};

export const TermsAndConditionsModal: React.FC<{
    onClose: () => void;
}> = ({ onClose }) => {
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
            width: '90%',
            minHeight: '70%',
            display: 'flex',
            margin: 20,
            backgroundColor: '#2d2d2d',
            borderRadius: 15,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 5,
        },
        containersWrapper: {
            alignItems: 'center',
        },
        title: {
            color: 'white',
            marginTop: 15,
            fontSize: 19,
            fontWeight: 'bold',
        },
        text: {
            color: 'white',
            marginTop: 7,
            fontSize: 15,
        },
    });

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
                            <Heading size={28} title={'Regler och villkor'} />
                            <View
                                style={{
                                    width: '90%',

                                    marginLeft: 15,
                                }}>
                                <Text style={styles.title}>
                                    Vad är Cue Inte?
                                </Text>

                                <Text style={styles.text}>
                                    Cue är inte en ersättare för SOS Alarm (112)
                                    eller Polisen.
                                </Text>

                                <Text style={styles.title}>
                                    Vad för information samlar Cue?
                                </Text>
                                <Text style={styles.text}>
                                    Cue vet enbart om din position vid
                                    användning av appen. I databasen sparas
                                    enbart ett unikt ID som din telefon ger för
                                    att kunna ta emot push notifikationer.
                                </Text>

                                <Text style={styles.title}>Tredjepart</Text>
                                <Text style={styles.text}>
                                    Cue kommer aldrig sälja, byta eller överföra
                                    information om våra användare till
                                    tredjeparter.
                                </Text>

                                <Text style={styles.title}>Användning</Text>
                                <Text style={styles.text}>
                                    Vid användning av Cue iOS applikation
                                    godkänner du våra regler och villkor
                                </Text>

                                <Text style={styles.title}>Som användare</Text>
                                <Text style={styles.text}>
                                    Användaren uppmanas respektera följande
                                    uppföranderegler:
                                </Text>
                                <Text style={styles.text}>
                                    - Troll/spam av inlägg, förslag på platser
                                    eller egna händelser är strikt förbjudet och
                                    kan leda till permanent avstängning.
                                </Text>
                            </View>

                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: 10,
                                    alignSelf: 'center',
                                }}>
                                <Button
                                    onPress={onClose}
                                    color={primaryColor}
                                    title={'Stäng'}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};
