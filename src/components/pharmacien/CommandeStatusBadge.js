import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const CommandeStatusBadge = ({ status, size = "medium" }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "en_attente":
        return {
          label: "En attente",
          color: "#F59E0B",
          bgColor: "#FEF3C7",
          icon: "time-outline"
        };
      case "en_preparation":
        return {
          label: "En préparation",
          color: "#3B82F6",
          bgColor: "#DBEAFE",
          icon: "build-outline"
        };
      case "prete":
        return {
          label: "Prête",
          color: "#10B981",
          bgColor: "#D1FAE5",
          icon: "checkmark-circle-outline"
        };
      default:
        return {
          label: status,
          color: "#6B7280",
          bgColor: "#F3F4F6",
          icon: "ellipsis-horizontal"
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const sizeStyles = size === "large" ? styles.large : styles.medium;

  return (
    <View
      style={[
        styles.badge,
        sizeStyles,
        { backgroundColor: statusConfig.bgColor }
      ]}
    >
      <Ionicons
        name={statusConfig.icon}
        size={size === "large" ? 20 : 16}
        color={statusConfig.color}
      />
      <Text
        style={[
          styles.text,
          size === "large" ? styles.largeText : styles.mediumText,
          { color: statusConfig.color }
        ]}
      >
        {statusConfig.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  medium: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  large: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  text: {
    fontWeight: "600",
    marginLeft: 6,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});