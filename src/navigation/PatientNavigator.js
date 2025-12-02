import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { OrdonnanceListScreen } from "../screens/patient/OrdonnanceListScreen";
import { OrdonnanceDetailScreen } from "../screens/patient/OrdonnanceDetailScreen";
import { CommandeCreateScreen } from "../screens/patient/CommandeCreateScreen";
import { CommandeListScreen } from "../screens/patient/CommandeListScreen";
import { CommandeDetailScreen } from "../screens/patient/CommandeDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator pour les ordonnances
const OrdonnanceStack = () => {
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
        name="OrdonnanceList"
        component={OrdonnanceListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrdonnanceDetail"
        component={OrdonnanceDetailScreen}
        options={{
          title: "Détail de l'ordonnance",
          headerBackTitle: "Retour",
        }}
      />
      <Stack.Screen
        name="CommandeCreate"
        component={CommandeCreateScreen}
        options={{
          title: "Créer une commande",
          headerBackTitle: "Retour",
        }}
      />
    </Stack.Navigator>
  );
};

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
        options={{
          title: "Mes commandes",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 24,
          },
        }}
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

// Tab Navigator principal
export const PatientNavigator = () => {
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
        name="OrdonnancesTab"
        component={OrdonnanceStack}
        options={{
          title: "Ordonnances",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="CommandesTab"
        component={CommandeStack}
        options={{
          title: "Commandes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};