import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";

export const Button = ({ 
  title, 
  onPress, 
  variant = "primary", 
  loading = false,
  disabled = false,
  style 
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    style
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text`]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primary: {
    backgroundColor: "#4F46E5",
  },
  secondary: {
    backgroundColor: "#10B981",
  },
  danger: {
    backgroundColor: "#EF4444",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#4F46E5",
    elevation: 0,
  },
  disabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#fff",
  },
  dangerText: {
    color: "#fff",
  },
  outlineText: {
    color: "#4F46E5",
  },
});