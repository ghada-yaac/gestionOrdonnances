import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

export const LoadingSpinner = ({ message = "Chargement..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4F46E5" />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
});