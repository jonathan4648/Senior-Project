import {StyleSheet, TouchableOpacity,} from "react-native";
import React from "react";
import { FontAwesome6, Ionicons, MaterialCommunityIcons, AntDesign} from '@expo/vector-icons';
import {Colors} from "@/constants/Colors";
import {View, Text} from "@/components/Themed"

type LightButtonProps = {
    title: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    onPress: () => void;
    isActive: boolean;
}
const LightButton = ({title, icon, onPress, isActive}: LightButtonProps) => {
    return (
        <TouchableOpacity style={styles.lightSettings}>
            <View style={styles.titleWrapper}>
                <MaterialCommunityIcons
                    name={icon} 
                    size={20} 
                    color='black'/>
                <Text style={styles.title}> {title}</Text>
            </View>
            <MaterialCommunityIcons 
                name={isActive ? "check-circle": "checkbox-blank-circle-outline"} 
                size={20}
                color={isActive? '#7743DB': "black"}/>
    </TouchableOpacity>
    );
};

export default LightButton;
const styles = StyleSheet.create({
    title:{
        fontSize:18,
        fontWeight: '600',
        marginVertical:10,
    },
    titleWrapper:{
        flexDirection:"row",
        alignItems: 'center',
        gap:10,
        backgroundColor:'auto',
    },
    lightSettings:{
        marginBottom:15,
        flexDirection:'row',
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#cccccc",
        padding: 20,
        borderRadius: 10,
    }
})