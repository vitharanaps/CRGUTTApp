import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, ScrollView, KeyboardAvoidingView, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';


import Feather from "@expo/vector-icons/Feather"
import { Entypo, EvilIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const SignUpScreen = () => {
     const navigation = useNavigation();
    //  const { signUp, signUpSuccess } = useAuthContext()

    // useEffect(() => {
    //     if (signUpSuccess) {
    //         navigation.navigate("signInScreen");
    //     }
    // }, [signUpSuccess])


    const [data, setData] = useState(
        {
            idNum: "",
            nameWithIn: "",
            mob1: "",
            mob2: "",
            email: "",
            address: "",
            homeStation: "",
            appDate: "",
            post: "",
            password: "",
            confirm_password: "",
            check_idInput: false,
            check_firstNameInputChange: false,
            check_lastNameInputChange: false,
            secureTextEntry: true,
            confirm_secureTextEntry: true,
            isValidUser: true,
            check_Mob1Input: false,
            isValidMob1: true,
            check_Mob2Input: false,
            isValidMob2: true,
            check_EmailInput: false,
            isValidEmail: true,
            isValidPassword: true,
            isPasswordMatch: true,


        }
    );




    const updateSecureTextEntry = () => {
        setData(
            {
                ...data,
                secureTextEntry: !data.secureTextEntry
            }
        )
    }
    const updateConfirmSecureTextEntry = () => {

        setData(
            {
                ...data,
                confirm_secureTextEntry: !data.confirm_secureTextEntry
            }
        )
    }


    const viewSecureText = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        })
    }

    //validation
    const idInputChange = (val) => {
        if (val.length >= 9) {
            setData({
                ...data,
                idNum: val,
                check_idInput: true,
                isValidUser: true

            })
        } else {
            setData({
                ...data,
                idNum: val,
                check_idInput: false,
                isValidUser: false
            })

        }
    }
    const handleNameWithIn = (val) => {
        if (val.length !== 0) {
            setData({
                ...data,
                nameWithIn: val,
                check_NameWithInInputChange: true
            })
        } else {
            setData({
                ...data,
                nameWithIn: val,
                check_nameWithInInputChange: false
            })

        }
    }

    const handleMob1Change = (val) => {
        if (val.length >= 10) {
            setData({
                ...data,
                mob1: val,
                check_Mob1Input: true,
                isValidMob1: true

            })
        } else {
            setData({
                ...data,
                mob1: val,
                check_Mob1Input: false,
                isValidMob1: false
            })

        }
    }
    const handleMob2Change = (val) => {
        if (val.length >= 10) {
            setData({
                ...data,
                mob2: val,
                check_Mob2Input: true,
                isValidMob2: true

            })
        } else {
            setData({
                ...data,
                mob2: val,
                check_Mob2Input: false,
                isValidMob2: false
            })

        }
    }
    const handleEmailChange = (val) => {
        if (val.length !== 0) {
            setData({
                ...data,
                email: val,
                check_EmailInput: true,
                isValidEmail: true

            })
        } else {
            setData({
                ...data,
                email: val,
                check_EmailInput: true,
                isValidEmail: true

            })

        }
    }
    const handleAddressChange = (val) => {
        if (val.length !== 0) {
            setData({
                ...data,
                address: val,


            })
        } else {
            setData({
                ...data,
                address: val,


            })

        }
    }
    const handleHomeStationChange = (val) => {
        if (val.length !== 0) {
            setData({
                ...data,
                homeStation: val,


            })
        } else {
            setData({
                ...data,
                homeStation: val,


            })

        }
    }
    const handlePostChange = (val) => {
        if (val.length !== 0) {
            setData({
                ...data,
                post: val,


            })
        } else {
            setData({
                ...data,
                post: val,


            })

        }
    }

    const handleConfirmPasswordChange = (val) => {
        //checkConfirmPasswordMatch();
        setData({
            ...data,
            confirm_password: val,
        })

    }
    const handleAppDateChange = (val) => {
        setData({
            ...data,
            appDate: val,
        })
    }
    const handlePasswordChange = (val) => {
        if (val.length >= 6) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            })
        } else {
            setData({
                ...data,
                email: val,
                isValidPassword: false
            })

        }
    }
    const checkConfirmPasswordMatch = () => {
        if (data.password === data.confirm_password) {
            setData({
                ...data,
                isPasswordMatch: true
            })
        } else {
            setData({
                ...data,
                isPasswordMatch: false
            })
        }

    }
    useEffect(() => {
        checkConfirmPasswordMatch();
    }, [data.confirm_password])


    const handleSignUp = async (values) => {

        await signUp(values)


    }
    console.log(data)
    return (
        <View style={styles.conatiner}>
 <ImageBackground 
                source={require("../../../../assets/bgimage.jpg") } 
                style={{flex: 1 }}>
                <StatusBar backgroundColor="#009387" barStyle="dark-content" />
                <View style={styles.header}>
                    <Text style={styles.text_header}>Register Now !</Text>
                </View>
                <Animatable.View style={styles.footer}
                    animation="fadeInUpBig"
                >
                        <KeyboardAvoidingView   behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                        >
                    <ScrollView showsVerticalScrollIndicator={false} >
                       
                        <View style={{paddingBottom: 50}}>
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
                                        keyboardType='numeric'
                                        onChangeText={(val) => idInputChange(val)}

                                    />

                                    {
                                        data.check_idInput ?
                                            <Animatable.View
                                                animation="bounceIn"
                                            >
                                                <Feather
                                                    name="check-circle"
                                                    color="green"
                                                    size={20}

                                                />

                                            </Animatable.View>
                                            :
                                            null

                                    }
                                </View>
                                {data.isValidUser ? null : <Animatable.View animation="fadeInLeft" duration={500} >
                                    <Text style={styles.errorMsg}>ID Number Must be 9 Charectors </Text>
                                </Animatable.View>
                                }

                                <Text style={[styles.text_footer, { marginTop: 35 }]}>  Name With Initial</Text>
                                <View style={styles.action}>
                                    <Ionicons name="person"
                                        color="#05375a"
                                        size={20}
                                    />
                                    <TextInput
                                        placeholder='Enter Your Email'
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        onChangeText={(val) => handleNameWithIn(val)}
                                    />

                                    {
                                        data.check_nameWithInInputChange ?
                                            <Animatable.View
                                                animation="bounceIn"
                                            >
                                                <Feather
                                                    name="check-circle"
                                                    color="green"
                                                    size={20}

                                                />

                                            </Animatable.View>
                                            :
                                            null

                                    }


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
                                    {
                                        data.check_Mob1Input ?
                                            <Animatable.View
                                                animation="bounceIn"
                                            >
                                                <Feather
                                                    name="check-circle"
                                                    color="green"
                                                    size={20}

                                                />

                                            </Animatable.View>
                                            :
                                            null

                                    }
                                </View>
                                {data.isValidMob1 ? null : <Animatable.View animation="fadeInLeft" duration={500} >
                                    <Text style={styles.errorMsg}>Mobile Number Must be 10 Charectors </Text>
                                </Animatable.View>
                                }
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
                                        secureTextEntry={data.secureTextEntry}
                                        onChangeText={(val) => handleMob2Change(val)}
                                    />
                                    {
                                        data.check_Mob2Input ?
                                            <Animatable.View
                                                animation="bounceIn"
                                            >
                                                <Feather
                                                    name="check-circle"
                                                    color="green"
                                                    size={20}

                                                />

                                            </Animatable.View>
                                            :
                                            null

                                    }
                                </View>
                                {data.isValidMob2 ? null : <Animatable.View animation="fadeInLeft" duration={500} >
                                    <Text style={styles.errorMsg}>Mobile Number 2 Must be 10 Charectors </Text>
                                </Animatable.View>
                                }
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
                                        onChangeText={(val) => handleEmailChange(val)}
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
                                        onChangeText={(val) => handleAddressChange(val)}
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
                                        onChangeText={(val) => handleHomeStationChange(val)}
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
                                        onChangeText={(val) => handleAppDateChange(val)}
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
                                        onChangeText={(val) => handlePostChange(val)}
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

                                        secureTextEntry={data.secureTextEntry}
                                        onChangeText={(val) => handlePasswordChange(val)}
                                    />

                                    <Feather
                                        name={data.secureTextEntry ? "eye" : "eye-off"}
                                        color="gray"
                                        size={20}
                                        onPress={(val) => updateSecureTextEntry(val)}
                                    />


                                </View>
                                {data.isValidPassword ? null : <Animatable.View animation="fadeInLeft" duration={500} >
                                    <Text style={styles.errorMsg}>Password Must be more than 6 Charectors </Text>
                                </Animatable.View>
                                }
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

                                        secureTextEntry={data.confirm_secureTextEntry}
                                        onChangeText={(val) => handleConfirmPasswordChange(val)}
                                    />

                                    <Feather
                                        name={data.confirm_secureTextEntry ? "eye" : "eye-off"}
                                        color="gray"
                                        size={20}
                                        onPress={(val) => updateConfirmSecureTextEntry(val)}
                                    />


                                </View>
                                {data.isPasswordMatch ? null : <Animatable.View animation="fadeInLeft" duration={500} >
                                    <Text style={styles.errorMsg}>Password Not Match </Text>
                                </Animatable.View>
                                }


                                <View style={styles.button}>

                                    <TouchableOpacity
                                        style={{ width: "100%" }}
                                        onPress={() => handleSignUp(data)}

                                    >
                                        <View
                                            style={[styles.signIn, { backgroundColor: '#5171ff' }]}
                                        >
                                            <Text style={[styles.textSign, { color: "#fff" }]} >Sign Up</Text>
                                        </View>

                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.signIn, {
                                            borderColor: "#5171ff",
                                            borderWidth: 1,
                                            marginTop: 15
                                        }]}
                                        onPress={() => navigation.navigate('signInScreen')}

                                    >
                                        <Text style={[styles.textSign, { color: "#5171ff" }]} >Sign In</Text>
                                    </TouchableOpacity>
                                </View>
                                </View>
                    </ScrollView>
                    </KeyboardAvoidingView>                 

                </Animatable.View>
                </ImageBackground>
                        </View >
    )
}
const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        backgroundColor: "#5171ff",
    },

    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        paddingBottom: 0,
    },
    text_header: {
        color: "#fff",
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