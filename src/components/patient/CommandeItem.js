import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../common/Card";
import { Ionicons } from "@expo/vector-icons";

export const CommandeItem = ({ commande, onPress }) => {
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

  const statusConfig = getStatusConfig(commande.status);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Commande #{commande.id}</Text>
          <Text style={styles.subtitle}>
            {commande.pharmacieName || "Pharmacie"}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusConfig.bgColor }
          ]}
        >
          <Ionicons
            name={statusConfig.icon}
            size={16}
            color={statusConfig.color}
          />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
        <Text style={styles.infoText}>
          {formatDate(commande.dateCreation)}
        </Text>
      </View>

      {commande.lieuLivraison && (
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.infoText} numberOfLines={1}>
            {commande.lieuLivraison}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.viewDetailsText}>Voir les détails</Text>
        <Ionicons name="chevron-forward" size={20} color="#4F46E5" />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
    flex: 1,
  },
  footer: {
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
});