import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { useCommandeStore } from "../../store/commandeStore";
import { useAuthStore } from "../../store/authStore";
import { CommandeItem } from "../../components/patient/CommandeItem";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Ionicons } from "@expo/vector-icons";

export const CommandeListScreen = ({ navigation }) => {
  const { commandes, loadCommandes, isLoading } = useCommandeStore();
  const { user } = useAuthStore();

  useEffect(() => {
    loadCommandes();
  }, []);

  const patientCommandes = commandes.filter((c) => c.patientId === user?.id);

  const handleRefresh = () => {
    loadCommandes();
  };

  const getStatusStats = () => {
    const stats = {
      en_attente: 0,
      en_preparation: 0,
      prete: 0,
    };

    patientCommandes.forEach((c) => {
      if (stats.hasOwnProperty(c.status)) {
        stats[c.status]++;
      }
    });

    return stats;
  };

  const stats = getStatusStats();

  if (isLoading && commandes.length === 0) {
    return <LoadingSpinner message="Chargement des commandes..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.waitingCard]}>
          <Ionicons name="time" size={24} color="#F59E0B" />
          <Text style={styles.statNumber}>{stats.en_attente}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>

        <View style={[styles.statCard, styles.preparationCard]}>
          <Ionicons name="build" size={24} color="#3B82F6" />
          <Text style={styles.statNumber}>{stats.en_preparation}</Text>
          <Text style={styles.statLabel}>En préparation</Text>
        </View>

        <View style={[styles.statCard, styles.readyCard]}>
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <Text style={styles.statNumber}>{stats.prete}</Text>
          <Text style={styles.statLabel}>Prêtes</Text>
        </View>
      </View>

      {patientCommandes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Aucune commande</Text>
          <Text style={styles.emptyText}>
            Vos commandes de médicaments apparaîtront ici
          </Text>
        </View>
      ) : (
        <FlatList
          data={patientCommandes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CommandeItem
              commande={item}
              onPress={() =>
                navigation.navigate("CommandeDetail", { commandeId: item.id })
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
  statsContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  waitingCard: {
    borderLeftWidth: 3,
    borderLeftColor: "#F59E0B",
  },
  preparationCard: {
    borderLeftWidth: 3,
    borderLeftColor: "#3B82F6",
  },
  readyCard: {
    borderLeftWidth: 3,
    borderLeftColor: "#10B981",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
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