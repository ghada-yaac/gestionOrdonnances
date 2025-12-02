import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useCommandeStore } from "../../store/commandeStore";
import { Card } from "../../components/common/Card";
import { Ionicons } from "@expo/vector-icons";

export const CommandeDetailScreen = ({ route }) => {
  const { commandeId } = route.params;
  const { getCommandeById } = useCommandeStore();
  const [commande, setCommande] = useState(null);

  useEffect(() => {
    const cmd = getCommandeById(commandeId);
    setCommande(cmd);
  }, [commandeId]);

  if (!commande) {
    return (
      <View style={styles.container}>
        <Text>Commande introuvable</Text>
      </View>
    );
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "en_attente":
        return {
          label: "En attente",
          color: "#F59E0B",
          bgColor: "#FEF3C7",
          icon: "time-outline",
          description: "Votre commande a été reçue et est en attente de traitement"
        };
      case "en_preparation":
        return {
          label: "En préparation",
          color: "#3B82F6",
          bgColor: "#DBEAFE",
          icon: "build-outline",
          description: "Le pharmacien prépare actuellement votre commande"
        };
      case "prete":
        return {
          label: "Prête",
          color: "#10B981",
          bgColor: "#D1FAE5",
          icon: "checkmark-circle-outline",
          description: "Votre commande est prête pour le retrait"
        };
      default:
        return {
          label: status,
          color: "#6B7280",
          bgColor: "#F3F4F6",
          icon: "ellipsis-horizontal",
          description: ""
        };
    }
  };

  const statusConfig = getStatusConfig(commande.status);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={[styles.statusCard, { backgroundColor: statusConfig.bgColor }]}>
          <View style={styles.statusHeader}>
            <Ionicons name={statusConfig.icon} size={48} color={statusConfig.color} />
            <View style={styles.statusInfo}>
              <Text style={[styles.statusLabel, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
              <Text style={[styles.statusDescription, { color: statusConfig.color }]}>
                {statusConfig.description}
              </Text>
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Informations de commande</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Numéro de commande</Text>
            <Text style={styles.infoValue}>#{commande.id}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date de création</Text>
            <Text style={styles.infoValue}>{formatDate(commande.dateCreation)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pharmacie</Text>
            <Text style={styles.infoValue}>{commande.pharmacieName || "Pharmacie"}</Text>
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Livraison</Text>
          </View>

          <View style={styles.deliveryInfo}>
            <Ionicons name="home" size={20} color="#6B7280" />
            <Text style={styles.deliveryText}>{commande.lieuLivraison}</Text>
          </View>

          {commande.remarques && (
            <>
              <View style={styles.divider} />
              <View style={styles.remarquesContainer}>
                <Text style={styles.remarquesLabel}>Remarques :</Text>
                <Text style={styles.remarquesText}>{commande.remarques}</Text>
              </View>
            </>
          )}
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Ionicons name="medical" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Médicaments commandés</Text>
          </View>

          {commande.medicaments && commande.medicaments.map((med, index) => (
            <View key={index} style={styles.medicamentItem}>
              <View style={styles.medicamentHeader}>
                <Text style={styles.medicamentName}>{med.nomMedicament}</Text>
                <View style={styles.dosageBadge}>
                  <Text style={styles.dosageText}>{med.dosage}</Text>
                </View>
              </View>

              <View style={styles.medicamentDetails}>
                <Text style={styles.medicamentDetail}>
                  {med.quantiteParJour}x par jour pendant {med.duree} jours
                </Text>
                <Text style={styles.medicamentTotal}>
                  Total: {med.quantiteParJour * med.duree} unités
                </Text>
              </View>

              {index < commande.medicaments.length - 1 && (
                <View style={styles.medicamentDivider} />
              )}
            </View>
          ))}
        </Card>

        <Card style={styles.timelineCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="git-commit" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Suivi de commande</Text>
          </View>

          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotActive]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Commande créée</Text>
                <Text style={styles.timelineDate}>{formatDate(commande.dateCreation)}</Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={[
                styles.timelineDot,
                (commande.status === "en_preparation" || commande.status === "prete") && styles.timelineDotActive
              ]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>En préparation</Text>
                {commande.status === "en_attente" && (
                  <Text style={styles.timelineDatePending}>En attente</Text>
                )}
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={[
                styles.timelineDot,
                commande.status === "prete" && styles.timelineDotActive
              ]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Prête pour retrait</Text>
                {commande.status !== "prete" && (
                  <Text style={styles.timelineDatePending}>En attente</Text>
                )}
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
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
  },
  statusCard: {
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusInfo: {
    marginLeft: 16,
    flex: 1,
  },
  statusLabel: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    fontWeight: "500",
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  deliveryText: {
    fontSize: 15,
    color: "#374151",
    marginLeft: 12,
    flex: 1,
  },
  remarquesContainer: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
  },
  remarquesLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  remarquesText: {
    fontSize: 14,
    color: "#374151",
  },
  medicamentItem: {
    marginBottom: 16,
  },
  medicamentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  medicamentName: {
    fontSize: 16,
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
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
  },
  medicamentDetails: {
    gap: 4,
  },
  medicamentDetail: {
    fontSize: 14,
    color: "#6B7280",
  },
  medicamentTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  medicamentDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 16,
  },
  timelineCard: {
    marginBottom: 20,
  },
  timeline: {
    gap: 20,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    marginRight: 12,
    marginTop: 2,
  },
  timelineDotActive: {
    backgroundColor: "#4F46E5",
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 13,
    color: "#6B7280",
  },
  timelineDatePending: {
    fontSize: 13,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});