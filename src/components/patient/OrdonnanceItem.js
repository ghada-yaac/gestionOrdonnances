import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../common/Card";
import { Ionicons } from "@expo/vector-icons";

export const OrdonnanceItem = ({ ordonnance, onPress }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text" size={24} color="#4F46E5" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Ordonnance #{ordonnance.id}</Text>
          <Text style={styles.subtitle}>{ordonnance.medecinName}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
        <Text style={styles.infoText}>{formatDate(ordonnance.date)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="medical-outline" size={16} color="#6B7280" />
        <Text style={styles.infoText}>
          {ordonnance.medicaments.length} médicament{ordonnance.medicaments.length > 1 ? "s" : ""}
        </Text>
      </View>

      {ordonnance.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText} numberOfLines={2}>
            {ordonnance.notes}
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
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
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
  },
  notesContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: "#78350F",
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