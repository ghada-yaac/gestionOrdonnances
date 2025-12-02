import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { CommandeListScreen } from "../screens/pharmacien/CommandeListScreen";
import { CommandeDetailScreen } from "../screens/pharmacien/CommandeDetailScreen";
import { MedicamentListScreen } from "../screens/pharmacien/MedicamentListScreen";
import { MedicamentFormScreen } from "../screens/pharmacien/MedicamentFormScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator pour les commandes
const CommandeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#1F2937",
        headerTitleStyle: {
          fontWeight: "700",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="CommandeListMain"
        component={CommandeListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CommandeDetail"
        component={CommandeDetailScreen}
        options={{
          title: "Détail de la commande",
          headerBackTitle: "Retour",
        }}
      />
    </Stack.Navigator>
  );
};

// Stack Navigator pour les médicaments
const MedicamentStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#1F2937",
        headerTitleStyle: {
          fontWeight: "700",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="MedicamentListMain"
        component={MedicamentListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MedicamentForm"
        component={MedicamentFormScreen}
        options={({ route }) => ({
          title: route.params?.medicament
            ? "Modifier le médicament"
            : "Nouveau médicament",
          headerBackTitle: "Retour",
        })}
      />
    </Stack.Navigator>
  );
};

// Tab Navigator principal
export const PharmacienNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="CommandesTab"
        component={CommandeStack}
        options={{
          title: "Commandes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="file-tray-full" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MedicamentsTab"
        component={MedicamentStack}
        options={{
          title: "Médicaments",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medical" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};