import { router} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {Text,View} from '../../components/Themed'
import { StyleSheet, Switch, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useContext, useState} from 'react';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import LightButton from '@/components/ui/LightButton';
import Header from '@/components/ui/HeaderTitle'
import { ThemeContext } from '@/context/ThemeContext';
import { Colors } from '@/constants/Colors';

export default function ThemeSwitch() {
    const { currentTheme, toggleTheme } = useContext(ThemeContext);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header title="Theme" onPress={() => router.replace('/profile')} />
            <View style={[styles.container1]}>
                <Text style={styles.title}>Theme Switch</Text>
                <TouchableOpacity style={[styles.button,]}>
                    <Text style={styles.title}>Dark Mode</Text>
                    <Switch
                        value={currentTheme === 'dark'}
                        onValueChange={() => toggleTheme(currentTheme === 'light' ? 'dark' : 'light')}
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Theme Settings</Text>
                <LightButton
                    title="Light"
                    icon="lightbulb-on"
                    onPress={() => toggleTheme('light')}
                    isActive={currentTheme === 'light'}
                />
                <LightButton
                    title="Dark"
                    icon="weather-night"
                    onPress={() => toggleTheme('dark')}
                    isActive={currentTheme === 'dark'}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    TitleContainer: {
        flexDirection:'row',
        alignItems:'center',
        marginBottom:5,
        justifyContent: 'flex-start',
        backgroundColor: 'auto', // A softer white for a modern, minimalist background
        gap:80,
        
    },
    BackButton:{
        justifyContent:'flex-start',
        flexDirection:'row',
        color:'black',
        fontSize:18,
        fontWeight:'bold',
        backgroundColor:'auto'
    },
    mainTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        //fontFamily: 'Verdana',
    },
    separator: {
        marginVertical: 1,
        marginBottom:1,
        height: 1,
        width: '100%',
        borderBottomColor:'black',
        backgroundColor:'#cccccc',
    },
    container1:{
        flex:1,
        padding:20,
        backgroundColor:'light-gray'
    },
    title:{
        fontSize:18,
        fontWeight: '600',
        marginVertical:10,
    },
    button:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#cccccc',
        padding:15,
        borderRadius:10,
        marginBottom:10,
    },
    titleWrapper:{
        flexDirection:"row",
        alignItems: 'center',
        gap:10,
        backgroundColor:'auto',
    },
    lightSettings:{
        flexDirection:'row',
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#cccccc",
        padding: 20,
        borderRadius: 10,
    }
})
