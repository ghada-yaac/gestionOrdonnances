import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { useCommandeStore } from "../../store/commandeStore";
import { useOrdonnanceStore } from "../../store/ordonnanceStore";
import { useAuthStore } from "../../store/authStore";
import { Ionicons } from "@expo/vector-icons";

const PHARMACIES = [
  { id: "ph001", name: "Pharmacie Centrale", address: "12 rue de la Paix" },
  { id: "ph002", name: "Pharmacie du Centre", address: "45 avenue Victor Hugo" },
  { id: "ph003", name: "Pharmacie de la Gare", address: "8 place de la Gare" },
];

export const CommandeCreateScreen = ({ route, navigation }) => {
  const { ordonnance } = route.params;
  const { addCommande } = useCommandeStore();
  const { deleteOrdonnance, loadOrdonnances } = useOrdonnanceStore();
  const { user } = useAuthStore();

  const [selectedPharmacie, setSelectedPharmacie] = useState(null);
  const [lieuLivraison, setLieuLivraison] = useState("");
  const [remarques, setRemarques] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedPharmacie) {
      Alert.alert("Erreur", "Veuillez sélectionner une pharmacie");
      return;
    }

    if (!lieuLivraison.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un lieu de livraison");
      return;
    }

    Alert.alert(
      "Confirmer la commande",
      "En créant cette commande, l'ordonnance sera supprimée de votre liste. Voulez-vous continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            setIsSubmitting(true);

            const newCommande = {
              id: `c${Date.now()}`,
              ordonnanceId: ordonnance.id,
              patientId: user.id,
              pharmacienId: selectedPharmacie.id,
              pharmacieName: selectedPharmacie.name,
              status: "en_attente",
              dateCreation: new Date().toISOString(),
              lieuLivraison: lieuLivraison.trim(),
              remarques: remarques.trim(),
              medicaments: ordonnance.medicaments,
            };

            try {
              // Créer la commande
              await addCommande(newCommande);
              console.log("✅ Commande créée:", newCommande.id);
              
              // Supprimer l'ordonnance
              await deleteOrdonnance(ordonnance.id);
              console.log("✅ Ordonnance supprimée:", ordonnance.id);
              
              // Recharger les ordonnances pour mettre à jour la liste
              await loadOrdonnances();
              console.log("✅ Ordonnances rechargées");
              
              Alert.alert(
                "Succès",
                "Votre commande a été créée avec succès ! L'ordonnance a été transformée en commande.",
                [
                  {
                    text: "Voir mes commandes",
                    onPress: () => {
                      navigation.getParent()?.navigate("CommandesTab");
                    }
                  },
                  {
                    text: "Retour aux ordonnances",
                    onPress: () => {
                      // Retourner à la liste des ordonnances
                      navigation.popToTop();
                    },
                    style: "cancel"
                  }
                ]
              );
            } catch (error) {
              console.error("❌ Erreur lors de la création de la commande:", error);
              Alert.alert("Erreur", "Impossible de créer la commande");
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.ordonnanceCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={24} color="#4F46E5" />
            <Text style={styles.cardTitle}>Ordonnance sélectionnée</Text>
          </View>
          <Text style={styles.ordonnanceId}>#{ordonnance.id}</Text>
          <Text style={styles.medicamentCount}>
            {ordonnance.medicaments.length} médicament
            {ordonnance.medicaments.length > 1 ? "s" : ""}
          </Text>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="business" size={20} color="#1F2937" /> Choisir une
            pharmacie
          </Text>

          {PHARMACIES.map((pharmacie) => (
            <TouchableOpacity
              key={pharmacie.id}
              style={[
                styles.pharmacieCard,
                selectedPharmacie?.id === pharmacie.id &&
                  styles.pharmacieCardSelected,
              ]}
              onPress={() => setSelectedPharmacie(pharmacie)}
            >
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radio,
                    selectedPharmacie?.id === pharmacie.id &&
                      styles.radioSelected,
                  ]}
                >
                  {selectedPharmacie?.id === pharmacie.id && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
              <View style={styles.pharmacieInfo}>
                <Text style={styles.pharmacieName}>{pharmacie.name}</Text>
                <Text style={styles.pharmacieAddress}>{pharmacie.address}</Text>
              </View>
              <Ionicons
                name="storefront-outline"
                size={24}
                color={
                  selectedPharmacie?.id === pharmacie.id ? "#4F46E5" : "#9CA3AF"
                }
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="location" size={20} color="#1F2937" /> Informations
            de livraison
          </Text>

          <Input
            label="Lieu de livraison *"
            value={lieuLivraison}
            onChangeText={setLieuLivraison}
            placeholder="Ex: 10 rue des Lilas, Appartement 3B"
            multiline
            numberOfLines={2}
          />

          <Input
            label="Remarques (optionnel)"
            value={remarques}
            onChangeText={setRemarques}
            placeholder="Instructions spéciales pour le pharmacien"
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Confirmer la commande"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!selectedPharmacie || !lieuLivraison.trim()}
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
  ordonnanceCard: {
    backgroundColor: "#EEF2FF",
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
    marginLeft: 8,
  },
  ordonnanceId: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  medicamentCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  pharmacieCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  pharmacieCardSelected: {
    borderColor: "#4F46E5",
    backgroundColor: "#EEF2FF",
  },
  radioContainer: {
    marginRight: 12,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: "#4F46E5",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4F46E5",
  },
  pharmacieInfo: {
    flex: 1,
  },
  pharmacieName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  pharmacieAddress: {
    fontSize: 13,
    color: "#6B7280",
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
});