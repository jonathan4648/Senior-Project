import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

//Prop that carries information for the card component
const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <View
      style={[
        { padding: 16, borderRadius: 12, backgroundColor: "white", shadowOpacity: 0.1, shadowRadius: 4 },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default Card;
