import React, { useEffect, useState } from "react";
import { StatusBar, View, ActivityIndicator } from "react-native";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { useAuthStore } from "./src/store/authStore";

export default function App() {
  const { initializeData } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialiser les données au démarrage de l'application
    const init = async () => {
      try {
        await initializeData();
        console.log("Données initialisées avec succès");
        setIsReady(true);
      } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
        setIsReady(true); // Continuer même en cas d'erreur
      }
    };
    
    init();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <AppNavigator />
    </>
  );
}