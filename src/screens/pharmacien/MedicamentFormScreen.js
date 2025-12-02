import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Card } from "../../components/common/Card";
import { useMedicamentStore } from "../../store/medicamentStore";
import { Ionicons } from "@expo/vector-icons";

export const MedicamentFormScreen = ({ route, navigation }) => {
  const { medicament } = route.params || {};
  const isEditing = !!medicament;

  const { addMedicament, updateMedicament } = useMedicamentStore();

  const [nom, setNom] = useState(medicament?.nom || "");
  const [dosage, setDosage] = useState(medicament?.dosage || "");
  const [forme, setForme] = useState(medicament?.forme || "");
  const [quantiteStock, setQuantiteStock] = useState(
    medicament?.quantiteStock?.toString() || ""
  );

  const [nomError, setNomError] = useState("");
  const [dosageError, setDosageError] = useState("");
  const [formeError, setFormeError] = useState("");
  const [quantiteError, setQuantiteError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let isValid = true;

    setNomError("");
    setDosageError("");
    setFormeError("");
    setQuantiteError("");

    if (!nom.trim()) {
      setNomError("Le nom est requis");
      isValid = false;
    }

    if (!dosage.trim()) {
      setDosageError("Le dosage est requis");
      isValid = false;
    }

    if (!forme.trim()) {
      setFormeError("La forme est requise");
      isValid = false;
    }

    if (!quantiteStock.trim()) {
      setQuantiteError("La quantité en stock est requise");
      isValid = false;
    } else if (isNaN(parseInt(quantiteStock)) || parseInt(quantiteStock) < 0) {
      setQuantiteError("La quantité doit être un nombre positif");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const medicamentData = {
        id: medicament?.id || `m${Date.now()}`,
        nom: nom.trim(),
        dosage: dosage.trim(),
        forme: forme.trim(),
        quantiteStock: parseInt(quantiteStock),
      };

      if (isEditing) {
        await updateMedicament(medicament.id, medicamentData);
        Alert.alert("Succès", "Médicament modifié avec succès", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        await addMedicament(medicamentData);
        Alert.alert("Succès", "Médicament ajouté avec succès", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sauvegarder le médicament");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.headerCard}>
          <View style={styles.headerIcon}>
            <Ionicons
              name={isEditing ? "create" : "add-circle"}
              size={32}
              color="#4F46E5"
            />
          </View>
          <Text style={styles.headerTitle}>
            {isEditing ? "Modifier le médicament" : "Nouveau médicament"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isEditing
              ? "Modifiez les informations du médicament"
              : "Ajoutez un nouveau médicament au catalogue"}
          </Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Informations du médicament</Text>

          <Input
            label="Nom du médicament *"
            value={nom}
            onChangeText={setNom}
            placeholder="Ex: Doliprane"
            error={nomError}
          />

          <Input
            label="Dosage *"
            value={dosage}
            onChangeText={setDosage}
            placeholder="Ex: 500 mg"
            error={dosageError}
          />

          <Input
            label="Forme *"
            value={forme}
            onChangeText={setForme}
            placeholder="Ex: Comprimé, Gélule, Sirop..."
            error={formeError}
          />

          <Input
            label="Quantité en stock *"
            value={quantiteStock}
            onChangeText={setQuantiteStock}
            placeholder="Ex: 120"
            keyboardType="numeric"
            error={quantiteError}
          />
        </Card>

        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color="#3B82F6" />
            <Text style={styles.infoTitle}>Information</Text>
          </View>
          <Text style={styles.infoText}>
            Tous les champs marqués d'un astérisque (*) sont obligatoires. La
            quantité en stock sera utilisée pour suivre la disponibilité du
            médicament.
          </Text>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Annuler"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.cancelButton}
        />
        <Button
          title={isEditing ? "Modifier" : "Ajouter"}
          onPress={handleSubmit}
          loading={isSubmitting}
          style={styles.submitButton}
        />
      </View>
    </KeyboardAvoidingView>
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
  headerCard: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E40AF",
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#1E3A8A",
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});