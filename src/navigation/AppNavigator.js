import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuthStore } from "../store/authStore";
import { AuthNavigator } from "./AuthNavigator";
import { PatientNavigator } from "./PatientNavigator";
import { PharmacienNavigator } from "./PharmacienNavigator";

export const AppNavigator = () => {
  const { isAuthenticated, user } = useAuthStore();

  // Si non authentifié, afficher l'écran de connexion
  if (!isAuthenticated || !user) {
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  // Si authentifié, afficher la navigation selon le rôle
  return (
    <NavigationContainer>
      {user.role === "patient" ? (
        <PatientNavigator />
      ) : user.role === "pharmacien" ? (
        <PharmacienNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};