import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCommandeStore } from "../../store/commandeStore";
import { useMedicamentStore } from "../../store/medicamentStore";
import { Card } from "../../components/common/Card";
import { CommandeStatusBadge } from "../../components/pharmacien/CommandeStatusBadge";
import { Button } from "../../components/common/Button";
import { Ionicons } from "@expo/vector-icons";

export const CommandeDetailScreen = ({ route, navigation }) => {
  const { commandeId } = route.params;
  const { getCommandeById, updateCommandeStatus, loadCommandes } = useCommandeStore();
  const { medicaments, loadMedicaments } = useMedicamentStore();
  const [commande, setCommande] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [medicamentsDisponibles, setMedicamentsDisponibles] = useState([]);

  useEffect(() => {
    loadData();
  }, [commandeId]);

  useFocusEffect(
    React.useCallback(() => {
      console.log("🔄 Rechargement des données de la commande...");
      loadData();
    }, [commandeId])
  );

  const loadData = async () => {
    await loadCommandes();
    await loadMedicaments();
    const cmd = getCommandeById(commandeId);
    setCommande(cmd);
    console.log("✅ Données rechargées - Commande et médicaments");
  };

 useEffect(() => {
  if (commande && medicaments.length > 0) {
    const disponibilite = commande.medicaments.map((medCommande) => {
      const medStock = medicaments.find(
        (m) =>
          m.nom.trim().toLowerCase() === medCommande.nomMedicament.trim().toLowerCase()
      );

      const quantiteNecessaire = medCommande.quantiteParJour * medCommande.duree;

      return {
        ...medCommande,
        enStock: medStock ? medStock.quantiteStock : 0,
        quantiteNecessaire,
        disponible: medStock ? medStock.quantiteStock >= quantiteNecessaire : false,
        exists: !!medStock,
      };
    });

    setMedicamentsDisponibles(disponibilite);
  }
}, [commande, medicaments]);

  if (!commande) {
    return (
      <View style={styles.container}>
        <Text>Commande introuvable</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUpdateStatus = async (newStatus) => {
    if (newStatus === "en_preparation") {
      const medicamentsManquants = medicamentsDisponibles.filter((m) => !m.exists);
      const medicamentsInsuffisants = medicamentsDisponibles.filter(
        (m) => m.exists && !m.disponible
      );

      if (medicamentsManquants.length > 0) {
        const listeMedicaments = medicamentsManquants.map((m) => m.nomMedicament).join(", ");
        Alert.alert(
          "Médicaments inexistants",
          `Les médicaments suivants n'existent pas dans votre catalogue :\n\n${listeMedicaments}\n\nVeuillez d'abord les ajouter dans la section Médicaments.`,
          [{ text: "OK" }]
        );
        return;
      }

      if (medicamentsInsuffisants.length > 0) {
        const details = medicamentsInsuffisants
          .map(
            (m) =>
              `• ${m.nomMedicament}: ${m.enStock} en stock, ${m.quantiteNecessaire} nécessaires`
          )
          .join("\n");
        
        Alert.alert(
          "Stock insuffisant",
          `Les médicaments suivants ont un stock insuffisant :\n\n${details}\n\nVeuillez réapprovisionner votre stock.`,
          [{ text: "OK" }]
        );
        return;
      }
    }

    const statusLabels = {
      en_attente: "En attente",
      en_preparation: "En préparation",
      prete: "Prête",
    };

    Alert.alert(
      "Confirmer le changement",
      `Voulez-vous passer cette commande à "${statusLabels[newStatus]}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            setIsUpdating(true);
            try {
              await updateCommandeStatus(commandeId, newStatus);
              await loadCommandeData();
              Alert.alert("Succès", "Le statut a été mis à jour");
            } catch (error) {
              Alert.alert("Erreur", "Impossible de mettre à jour le statut");
            } finally {
              setIsUpdating(false);
            }
          },
        },
      ]
    );
  };

  const getNextAction = () => {
    switch (commande.status) {
      case "en_attente":
        return {
          label: "Commencer la préparation",
          status: "en_preparation",
          icon: "build",
          color: "#3B82F6",
        };
      case "en_preparation":
        return {
          label: "Marquer comme prête",
          status: "prete",
          icon: "checkmark-circle",
          color: "#10B981",
        };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <View style={styles.headerRow}>
            <View style={styles.headerInfo}>
              <Text style={styles.commandeId}>Commande #{commande.id}</Text>
              <Text style={styles.date}>{formatDate(commande.dateCreation)}</Text>
            </View>
            <CommandeStatusBadge status={commande.status} size="large" />
          </View>
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Informations patient</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID Patient</Text>
            <Text style={styles.infoValue}>#{commande.patientId}</Text>
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
                <View style={styles.remarquesHeader}>
                  <Ionicons name="chatbox" size={18} color="#F59E0B" />
                  <Text style={styles.remarquesLabel}>
                    Remarques du patient :
                  </Text>
                </View>
                <Text style={styles.remarquesText}>{commande.remarques}</Text>
              </View>
            </>
          )}
        </Card>

        <Card>
          <View style={styles.sectionHeader}>
            <Ionicons name="medical" size={24} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Médicaments à préparer</Text>
          </View>

          {commande.medicaments &&
            medicamentsDisponibles.map((med, index) => (
              <View key={index} style={styles.medicamentItem}>
                <View style={styles.medicamentHeader}>
                  <View style={styles.medicamentIcon}>
                    <Ionicons name="medkit" size={24} color="#4F46E5" />
                  </View>
                  <View style={styles.medicamentInfo}>
                    <Text style={styles.medicamentName}>
                      {med.nomMedicament}
                    </Text>
                    <Text style={styles.medicamentDosage}>{med.dosage}</Text>
                  </View>
                  {!med.exists && (
                    <View style={styles.warningBadge}>
                      <Ionicons name="alert-circle" size={20} color="#EF4444" />
                    </View>
                  )}
                  {med.exists && !med.disponible && (
                    <View style={styles.warningBadge}>
                      <Ionicons name="warning" size={20} color="#F59E0B" />
                    </View>
                  )}
                  {med.exists && med.disponible && (
                    <View style={styles.successBadge}>
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    </View>
                  )}
                </View>

                <View style={styles.quantityContainer}>
                  <View style={styles.quantityRow}>
                    <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                    <Text style={styles.quantityText}>
                      {med.quantiteParJour}x par jour
                    </Text>
                  </View>
                  <View style={styles.quantityRow}>
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text style={styles.quantityText}>
                      Pendant {med.duree} jours
                    </Text>
                  </View>
                </View>

                <View style={styles.totalQuantity}>
                  <Text style={styles.totalLabel}>Quantité totale à préparer</Text>
                  <Text style={styles.totalValue}>
                    {med.quantiteNecessaire} unités
                  </Text>
                </View>

                {/* Afficher le statut du stock */}
                {!med.exists && (
                  <View style={styles.stockAlert}>
                    <Ionicons name="alert-circle" size={18} color="#EF4444" />
                    <Text style={styles.stockAlertText}>
                      Ce médicament n'existe pas dans votre catalogue
                    </Text>
                  </View>
                )}
                
                {med.exists && !med.disponible && (
                  <View style={styles.stockWarning}>
                    <Ionicons name="warning" size={18} color="#F59E0B" />
                    <Text style={styles.stockWarningText}>
                      Stock insuffisant: {med.enStock} disponibles sur {med.quantiteNecessaire} nécessaires
                    </Text>
                  </View>
                )}

                {med.exists && med.disponible && (
                  <View style={styles.stockSuccess}>
                    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                    <Text style={styles.stockSuccessText}>
                      Stock disponible: {med.enStock} unités
                    </Text>
                  </View>
                )}

                {index < commande.medicaments.length - 1 && (
                  <View style={styles.medicamentDivider} />
                )}
              </View>
            ))}
        </Card>

        {nextAction && (
          <Card style={styles.actionCard}>
            <View style={styles.actionHeader}>
              <Ionicons name="arrow-forward-circle" size={24} color="#4F46E5" />
              <Text style={styles.actionTitle}>Action suivante</Text>
            </View>
            <Text style={styles.actionDescription}>
              {commande.status === "en_attente"
                ? "Commencez la préparation de cette commande"
                : "Informez le patient que sa commande est prête"}
            </Text>
          </Card>
        )}
      </ScrollView>

      {nextAction && (
        <View style={styles.footer}>
          <Button
            title={nextAction.label}
            onPress={() => handleUpdateStatus(nextAction.status)}
            loading={isUpdating}
            variant="secondary"
          />
        </View>
      )}

      {commande.status === "prete" && (
        <View style={styles.footer}>
          <View style={styles.completedContainer}>
            <Ionicons name="checkmark-circle" size={32} color="#10B981" />
            <Text style={styles.completedText}>
              Cette commande est prête pour le retrait
            </Text>
          </View>
        </View>
      )}
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
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerInfo: {
    flex: 1,
  },
  commandeId: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#6B7280",
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
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
  },
  deliveryText: {
    fontSize: 15,
    color: "#374151",
    marginLeft: 12,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  remarquesContainer: {
    backgroundColor: "#FFFBEB",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  remarquesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  remarquesLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#92400E",
    marginLeft: 6,
  },
  remarquesText: {
    fontSize: 14,
    color: "#78350F",
    lineHeight: 20,
  },
  medicamentItem: {
    marginBottom: 20,
  },
  medicamentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  medicamentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  medicamentInfo: {
    flex: 1,
  },
  medicamentName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  medicamentDosage: {
    fontSize: 14,
    color: "#6B7280",
  },
  quantityContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 6,
  },
  totalQuantity: {
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#4F46E5",
  },
  medicamentDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 20,
  },
  actionCard: {
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  actionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginLeft: 8,
  },
  actionDescription: {
    fontSize: 14,
    color: "#374151",
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
  completedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
  },
  completedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#065F46",
    marginLeft: 12,
  },
  warningBadge: {
    marginLeft: 8,
  },
  successBadge: {
    marginLeft: 8,
  },
  stockAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  stockAlertText: {
    fontSize: 13,
    color: "#991B1B",
    marginLeft: 8,
    flex: 1,
  },
  stockWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  stockWarningText: {
    fontSize: 13,
    color: "#92400E",
    marginLeft: 8,
    flex: 1,
  },
  stockSuccess: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  stockSuccessText: {
    fontSize: 13,
    color: "#065F46",
    marginLeft: 8,
    flex: 1,
  },
});