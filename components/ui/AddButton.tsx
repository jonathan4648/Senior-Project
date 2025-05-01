import {StyleSheet, TouchableOpacity,} from "react-native";
import React from "react";
import { FontAwesome6, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import {Colors} from "@/constants/Colors";
import {View, Text} from "@/components/Themed"

type AddButtonProps = {
    title: string;
    onPress: () => void;
}
const AddButton = ({title, onPress,}: AddButtonProps) => {
    return (
    <TouchableOpacity onPress={onPress}>
        <AntDesign style={styles.button}name="pluscircle" size={60} color="#5C6BC0" />
    </TouchableOpacity>
    );
};

export default AddButton;
const styles = StyleSheet.create({
    title:{
        fontSize:18,
        fontWeight: '600',
        marginVertical:10,
    },
    button:{
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        //backgroundColor: "#5C6BC0",
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
        zIndex: 9999

    }
})