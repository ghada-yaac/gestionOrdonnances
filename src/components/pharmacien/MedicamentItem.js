import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "../common/Card";
import { Ionicons } from "@expo/vector-icons";

export const MedicamentItem = ({ medicament, onEdit, onDelete }) => {
  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return { label: "Rupture", color: "#EF4444", bgColor: "#FEE2E2" };
    } else if (quantity < 20) {
      return { label: "Stock faible", color: "#F59E0B", bgColor: "#FEF3C7" };
    } else {
      return { label: "En stock", color: "#10B981", bgColor: "#D1FAE5" };
    }
  };

  const stockStatus = getStockStatus(medicament.quantiteStock);

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="medical" size={28} color="#4F46E5" />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{medicament.nom}</Text>
          <Text style={styles.dosage}>
            {medicament.dosage} - {medicament.forme}
          </Text>

          <View style={styles.stockContainer}>
            <View
              style={[
                styles.stockBadge,
                { backgroundColor: stockStatus.bgColor }
              ]}
            >
              <Text style={[styles.stockText, { color: stockStatus.color }]}>
                {stockStatus.label}
              </Text>
            </View>
            <Text style={styles.quantity}>
              {medicament.quantiteStock} unités
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={onEdit}
        >
          <Ionicons name="create-outline" size={20} color="#4F46E5" />
          <Text style={styles.editText}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
          <Text style={styles.deleteText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
  },
  content: {
    flexDirection: "row",
    padding: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  dosage: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  stockText: {
    fontSize: 11,
    fontWeight: "600",
  },
  quantity: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  editButton: {
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  deleteButton: {},
  editText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
    marginLeft: 6,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#EF4444",
    marginLeft: 6,
  },
});