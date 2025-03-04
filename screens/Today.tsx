import * as React from 'react'
import { View,Text } from "react-native"

export default function Today() {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text style={{fontSize:16,fontWeight:'700'}}>Today</Text>
    </View>
  );
}
