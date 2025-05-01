import {StyleSheet, TouchableOpacity,} from "react-native";
import React from "react";
import { FontAwesome6, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import {Colors} from "@/constants/Colors";
import {View, Text} from "@/components/Themed"

type AddButtonProps = {
    title: string;
    onPress: () => void;
    showIcon?: boolean;
}
const Header = ({title, onPress, showIcon= true}: AddButtonProps) => {
    return (
        <View style={styles.HeaderContainer}>
            <View style={styles.IconContainer}>
                {showIcon && (
                    <TouchableOpacity onPress={onPress}>
                        <Ionicons name="chevron-back-outline" size={24} color="auto" />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.Title}>
                <Text style={styles.mainTitle}>{title}</Text>
                <View style={styles.separator}/>
            </View>
            <View style={styles.IconContainer}/>
        </View>
    );
};

export default Header;
const styles = StyleSheet.create({
    HeaderContainer: {
        flexDirection:'row',
        alignItems:'center',
        //marginBottom:5,
        //justifyContent: 'center',
        backgroundColor: 'auto', // A softer white for a modern, minimalist background
        
    },
    IconContainer:{
        backgroundColor:'auto',
        flex:1,
        alignItems:'flex-start',
        paddingLeft:10,
    },
    Title:{
        backgroundColor:'auto',
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    mainTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        backgroundColor:'auto'
        //fontFamily: 'Verdana',
    },
    separator: {
        marginVertical: 1,
        marginBottom:1,
        height: 1,
        width: '350%',
        borderBottomColor:'black',
        backgroundColor:'#cccccc',
      },
})