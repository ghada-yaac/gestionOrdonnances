import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useOrdonnanceStore } from "../../store/ordonnanceStore";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Ionicons } from "@expo/vector-icons";

export const OrdonnanceDetailScreen = ({ route, navigation }) => {
  const { ordonnanceId } = route.params;
  const { getOrdonnanceById } = useOrdonnanceStore();
  const [ordonnance, setOrdonnance] = useState(null);

  useEffect(() => {
    const ord = getOrdonnanceById(ordonnanceId);
    setOrdonnance(ord);
  }, [ordonnanceId]);

  if (!ordonnance) {
    return (
      <View style={styles.container}>
        <Text>Ordonnance introuvable</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleCreateCommande = () => {
    navigation.navigate("CommandeCreate", { ordonnance });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="document-text" size={32} color="#4F46E5" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.ordonnanceId}>
                Ordonnance #{ordonnance.id}
              </Text>
              <Text style={styles.date}>{formatDate(ordonnance.date)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Médecin prescripteur</Text>
              <Text style={styles.infoValue}>{ordonnance.medecinName}</Text>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Ionicons name="medical" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Médicaments prescrits</Text>
          </View>

          {ordonnance.medicaments.map((med, index) => (
            <View key={index} style={styles.medicamentItem}>
              <View style={styles.medicamentHeader}>
                <Text style={styles.medicamentName}>{med.nomMedicament}</Text>
                <View style={styles.dosageBadge}>
                  <Text style={styles.dosageText}>{med.dosage}</Text>
                </View>
              </View>

              <View style={styles.posologyContainer}>
                <View style={styles.posologyItem}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.posologyText}>
                    {med.quantiteParJour}x par jour
                  </Text>
                </View>
                <View style={styles.posologyItem}>
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text style={styles.posologyText}>
                    Pendant {med.duree} jours
                  </Text>
                </View>
              </View>

              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Quantité totale :</Text>
                <Text style={styles.totalValue}>
                  {med.quantiteParJour * med.duree} unités
                </Text>
              </View>

              {index < ordonnance.medicaments.length - 1 && (
                <View style={styles.medicamentDivider} />
              )}
            </View>
          ))}
        </Card>

        {ordonnance.notes && (
          <Card style={styles.notesCard}>
            <View style={styles.notesHeader}>
              <Ionicons name="information-circle" size={24} color="#F59E0B" />
              <Text style={styles.notesTitle}>Notes du médecin</Text>
            </View>
            <Text style={styles.notesText}>{ordonnance.notes}</Text>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Créer une commande"
          onPress={handleCreateCommande}
          style={styles.commandeButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  headerCard: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  ordonnanceId: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginLeft: 8,
  },
  medicamentItem: {
    marginBottom: 16,
  },
  medicamentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  medicamentName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    flex: 1,
  },
  dosageBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dosageText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4F46E5",
  },
  posologyContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  posologyItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  posologyText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 6,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  medicamentDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 16,
  },
  notesCard: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
    marginLeft: 8,
  },
  notesText: {
    fontSize: 14,
    color: "#78350F",
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  commandeButton: {
    marginBottom: 0,
  },
});