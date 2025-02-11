import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, style, ...props }) => {
  return (
    <TouchableOpacity
      style={[
        { padding: 12, borderRadius: 8, backgroundColor: "#007bff", alignItems: "center" },
        style,
      ]}
      {...props}
    >
      <Text style={{ color: "white", fontSize: 16 }}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;
