import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useOrdonnanceStore } from "../../store/ordonnanceStore";
import { useAuthStore } from "../../store/authStore";
import { OrdonnanceItem } from "../../components/patient/OrdonnanceItem";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Ionicons } from "@expo/vector-icons";

export const OrdonnanceListScreen = ({ navigation }) => {
  const { ordonnances, loadOrdonnances, isLoading } = useOrdonnanceStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    loadOrdonnances();
  }, []);

  // Recharger les ordonnances quand on revient sur cet écran
  useFocusEffect(
    React.useCallback(() => {
      console.log("🔄 Écran Ordonnances actif - Rechargement...");
      loadOrdonnances();
    }, [])
  );

  const patientOrdonnances = ordonnances.filter(
    (o) => o.patientId === user?.id
  );

  const handleRefresh = () => {
    loadOrdonnances();
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading && ordonnances.length === 0) {
    return <LoadingSpinner message="Chargement des ordonnances..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="document-text" size={24} color="#4F46E5" />
          <Text style={styles.statNumber}>{patientOrdonnances.length}</Text>
          <Text style={styles.statLabel}>Ordonnances</Text>
        </View>
      </View>

      {patientOrdonnances.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Aucune ordonnance</Text>
          <Text style={styles.emptyText}>
            Vos ordonnances prescrites apparaîtront ici
          </Text>
        </View>
      ) : (
        <FlatList
          data={patientOrdonnances}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrdonnanceItem
              ordonnance={item}
              onPress={() =>
                navigation.navigate("OrdonnanceDetail", { ordonnanceId: item.id })
              }
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={["#4F46E5"]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  greeting: {
    fontSize: 16,
    color: "#6B7280",
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginTop: 4,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    padding: 20,
  },
  statCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  listContent: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
});