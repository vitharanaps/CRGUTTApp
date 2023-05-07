import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';


import Feather from "@expo/vector-icons/Feather"
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Entypo, EvilIcons, Ionicons } from '@expo/vector-icons';


const SignUpScreen = () => {
    const navigation = useNavigation();

    

    return (
        <View style={styles.conatiner}>
            <LinearGradient colors={['#c8def2', "#f6e1f8"]} style={{ flex: 1 }} >

                <StatusBar backgroundColor="#009387" barStyle="dark-content" />
                <View style={styles.header}>
                    <Text style={styles.text_header}>Register Now !</Text>
                </View>
                <Animatable.View style={styles.footer}
                    animation="fadeInUpBig"
                >

                    <ScrollView >
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}

                        >
                            <Text style={styles.text_footer}>ID Number</Text>
                            <View style={styles.action}>
                                <FontAwesome name="user-o"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder='Enter Your ID Number'
                                    style={styles.textInput}
                                    autoCapitalize="none"

                                />

                         
                                
                            </View>

                            <Text style={[styles.text_footer, { marginTop: 35 }]}> First Name</Text>
                            <View style={styles.action}>
                                <Ionicons name="person"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder='Enter Your Email'
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                />


                            </View>

                            <Text style={[styles.text_footer, { marginTop: 35 }]}> Last Name</Text>
                            <View style={styles.action}>
                                <Ionicons name="person"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder='Enter Your Last Name'
                                    style={styles.textInput}
                                    onChangeText={(val) => handleLastName(val)}
                                />
                              
                            </View>
                            <Text style={[styles.text_footer, { marginTop: 35 }]}> Mobile No1</Text>
                            <View style={styles.action}>
                                <Entypo name="mobile"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder='Enter Your Mobile Number'
                                    style={styles.textInput}
                                    onChangeText={(val) => handleMob1Change(val)}
                                />
                              
                            </View>
                                                      <Text style={[styles.text_footer, { marginTop: 35 }]}> Mobile No 2</Text>
                            <View style={styles.action}>
                                <Entypo name="mobile"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder='Enter Your Mobile Number 2'
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                />
                               
                            </View>
                          
                            <Text style={[styles.text_footer, { marginTop: 35 }]}> Email</Text>
                            <View style={styles.action}>
                                <Entypo name="email"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder='Enter Your Email'
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                />




                            </View>
                            <Text style={[styles.text_footer, { marginTop: 35 }]}> Address</Text>
                            <View style={styles.action}>
                                <EvilIcons name="envelope"
                                    color="#05375a"
                                    size={25}
                                />
                                <TextInput
                                    placeholder='Enter Your Address'
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                />


                            </View>





                            <Text style={[styles.text_footer, { marginTop: 35 }]}>Home Station</Text>
                            <View style={styles.action}>
                                <FontAwesome name="lock"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder='Enter Your Email'
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                />



                            </View>
                            <Text style={[styles.text_footer, { marginTop: 35 }]}>Appoinment Date</Text>
                            <View style={styles.action}>
                                <FontAwesome name="lock"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder='Enter Your Email'
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                />




                            </View>
                            <Text style={[styles.text_footer, { marginTop: 35 }]}>Post</Text>
                            <View style={styles.action}>
                                <FontAwesome name="lock"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder='Enter Your Email'
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                />




                            </View>
                            <Text style={[styles.text_footer, { marginTop: 35 }]}>Password</Text>
                            <View style={styles.action}>
                                <FontAwesome name="lock"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder='Enter Your Email'
                                    style={styles.textInput}
                                    autoCapitalize="none"

                                />

                                <Feather
                                    color="gray"
                                    size={20}
                                />


                            </View>
                            <Text style={[styles.text_footer, { marginTop: 35 }]}>confirm Password</Text>
                            <View style={styles.action}>
                                <FontAwesome name="lock"
                                    color="#05375a"
                                    size={20}
                                />
                                <TextInput
                                    placeholder='Enter Your Email'
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                />

                              


                            </View>



                            <View style={styles.button}>
                                <LinearGradient
                                    colors={['#8001ff', '#69739f']}
                                    style={styles.signIn}
                                >
                                    <Text style={[styles.textSign, { color: "#fff" }]} >Sign Up</Text>
                                </LinearGradient>
                                <TouchableOpacity
                                    style={[styles.signIn, {
                                        borderColor: "#8001ff",
                                        borderWidth: 1,
                                        marginTop: 15
                                    }]}
                                    onPress={() => navigation.navigate('signInScreen')}

                                >
                                    <Text style={[styles.textSign, { color: "#8001ff" }]} >Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>

                </Animatable.View>
            </LinearGradient>
        </View >
    )
}
const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        backgroundColor: "#8001ff",
    },

    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: "#8001ff",
        fontWeight: 'bold',
        fontSize: 30,
        paddingTop: 50
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 20,

    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});
export default SignUpScreen