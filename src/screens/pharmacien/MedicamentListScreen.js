import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useMedicamentStore } from "../../store/medicamentStore";
import { MedicamentItem } from "../../components/pharmacien/MedicamentItem";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Ionicons } from "@expo/vector-icons";

export const MedicamentListScreen = ({ navigation }) => {
  const { medicaments, loadMedicaments, deleteMedicament, isLoading } =
    useMedicamentStore();

  useEffect(() => {
    loadMedicaments();
  }, []);

  // Recharger quand on revient sur l'écran (après ajout/modification)
  useFocusEffect(
    React.useCallback(() => {
      console.log("🔄 Rechargement des médicaments...");
      loadMedicaments();
    }, [])
  );

  const handleRefresh = () => {
    loadMedicaments();
  };

  const handleEdit = (medicament) => {
    navigation.navigate("MedicamentForm", { medicament });
  };

  const handleDelete = (id, nom) => {
    Alert.alert(
      "Confirmer la suppression",
      `Voulez-vous vraiment supprimer ${nom} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMedicament(id);
              Alert.alert("Succès", "Médicament supprimé");
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer le médicament");
            }
          },
        },
      ]
    );
  };

  const handleAdd = () => {
    navigation.navigate("MedicamentForm", { medicament: null });
  };

  if (isLoading && medicaments.length === 0) {
    return <LoadingSpinner message="Chargement des médicaments..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Gestion des médicaments</Text>
          <Text style={styles.subtitle}>
            {medicaments.length} médicament{medicaments.length > 1 ? "s" : ""} au
            catalogue
          </Text>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {medicaments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="medkit-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Aucun médicament</Text>
          <Text style={styles.emptyText}>
            Commencez par ajouter des médicaments à votre catalogue
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleAdd}>
            <Ionicons name="add-circle-outline" size={24} color="#4F46E5" />
            <Text style={styles.emptyButtonText}>Ajouter un médicament</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={medicaments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MedicamentItem
              medicament={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item.id, item.nom)}
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
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
    marginLeft: 8,
  },
});