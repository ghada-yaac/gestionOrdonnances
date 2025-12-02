import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useCommandeStore } from "../../store/commandeStore";
import { useAuthStore } from "../../store/authStore";
import { Card } from "../../components/common/Card";
import { CommandeStatusBadge } from "../../components/pharmacien/CommandeStatusBadge";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Ionicons } from "@expo/vector-icons";

export const CommandeListScreen = ({ navigation }) => {
  const { commandes, loadCommandes, isLoading } = useCommandeStore();
  const { user, logout } = useAuthStore();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadCommandes();
  }, []);

  const handleRefresh = () => {
    loadCommandes();
  };

  const getFilteredCommandes = () => {
    if (filter === "all") return commandes;
    return commandes.filter((c) => c.status === filter);
  };

  const filteredCommandes = getFilteredCommandes();

  const getStatusCount = (status) => {
    return commandes.filter((c) => c.status === status).length;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderCommandeItem = ({ item }) => (
    <Card
      onPress={() =>
        navigation.navigate("CommandeDetail", { commandeId: item.id })
      }
    >
      <View style={styles.commandeHeader}>
        <View style={styles.commandeInfo}>
          <Text style={styles.commandeId}>Commande #{item.id}</Text>
          <Text style={styles.commandeDate}>
            {formatDate(item.dateCreation)}
          </Text>
        </View>
        <CommandeStatusBadge status={item.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.commandeDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="person-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>Patient #{item.patientId}</Text>
        </View>

        {item.medicaments && (
          <View style={styles.detailRow}>
            <Ionicons name="medical-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              {item.medicaments.length} médicament
              {item.medicaments.length > 1 ? "s" : ""}
            </Text>
          </View>
        )}

        {item.lieuLivraison && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text style={styles.detailText} numberOfLines={1}>
              {item.lieuLivraison}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.commandeFooter}>
        <Text style={styles.viewDetailsText}>Gérer la commande</Text>
        <Ionicons name="chevron-forward" size={20} color="#4F46E5" />
      </View>
    </Card>
  );

  if (isLoading && commandes.length === 0) {
    return <LoadingSpinner message="Chargement des commandes..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Pharmacie</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.waitingCard]}>
          <Ionicons name="time" size={20} color="#F59E0B" />
          <Text style={styles.statNumber}>{getStatusCount("en_attente")}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>

        <View style={[styles.statCard, styles.preparationCard]}>
          <Ionicons name="build" size={20} color="#3B82F6" />
          <Text style={styles.statNumber}>
            {getStatusCount("en_preparation")}
          </Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>

        <View style={[styles.statCard, styles.readyCard]}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.statNumber}>{getStatusCount("prete")}</Text>
          <Text style={styles.statLabel}>Prêtes</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.filterActive]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            Toutes ({commandes.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "en_attente" && styles.filterActive,
          ]}
          onPress={() => setFilter("en_attente")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "en_attente" && styles.filterTextActive,
            ]}
          >
            En attente
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "en_preparation" && styles.filterActive,
          ]}
          onPress={() => setFilter("en_preparation")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "en_preparation" && styles.filterTextActive,
            ]}
          >
            En cours
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "prete" && styles.filterActive,
          ]}
          onPress={() => setFilter("prete")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "prete" && styles.filterTextActive,
            ]}
          >
            Prêtes
          </Text>
        </TouchableOpacity>
      </View>

      {filteredCommandes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="file-tray-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Aucune commande</Text>
          <Text style={styles.emptyText}>
            {filter === "all"
              ? "Aucune commande n'a été reçue"
              : `Aucune commande ${
                  filter === "en_attente"
                    ? "en attente"
                    : filter === "en_preparation"
                    ? "en préparation"
                    : "prête"
                }`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCommandes}
          keyExtractor={(item) => item.id}
          renderItem={renderCommandeItem}
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
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
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
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  filterTextActive: {
    color: "#fff",
  },
  listContent: {
    padding: 20,
  },
  commandeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  commandeInfo: {
    flex: 1,
  },
  commandeId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  commandeDate: {
    fontSize: 13,
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  commandeDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
    flex: 1,
  },
  commandeFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
    marginRight: 4,
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