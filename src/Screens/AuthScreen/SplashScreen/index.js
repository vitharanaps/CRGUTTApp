import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

//#8001ffr

const SplashScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container} >

                 <ImageBackground 
                source={require("../../../../assets/bgimage.jpg") } 
                style={{flex: 1 }}> 

                <View style={styles.header} >
                     <Animatable.Image
                        animation='fadeInLeftBig'
                        duration={1500}
                        source={require('../../../../assets/logo.jpeg')}
                        style={styles.logo}
                        resizeMode="stretch"
                    /> 
                </View>
                <Animatable.View style={styles.footer}
                    animation="fadeInUpBig"
                >
                    <Text style={styles.title} >Continue With Us CRGU TT App</Text>
                    <Text style={styles.text} >Sign Up With Us Using Press On Get Started </Text>
                    <View style={styles.button}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('signInScreen')}
                                style={styles.signIn}
                            >
                                <Text style={styles.textSign} >Get Started</Text>
                                <MaterialIcons
                                    name="navigate-next"
                                    color="#fff"
                                    size={20}
                                />
                        </TouchableOpacity>
                    </View>


                </Animatable.View>
             </ImageBackground> 
        </View>
    )
}


const { height } = Dimensions.get("screen");
const height_logo = height * 0.30;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#5171ff",
        opacity:60,
        

    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
       
    },
    footer: {
        flex: 1.3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    logo: {
        width: height_logo,
        height: height_logo,
        borderColor: "#fff",
        borderWidth:10,
        borderRadius:125
    },
    title: {
        color: '#05375a',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: 'grey',
        marginTop: 5,
        fontSize: 18,
        paddingTop: 5
    },
    signIn: {
        width: 180,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row',
        backgroundColor: "#5171ff"
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
});

export default SplashScreen