import { create } from "zustand";
import { authenticateUser, initializeUsers } from "../api/userService";
import { initializeMedicaments } from "../api/medicamentService";
import { initializeOrdonnances } from "../api/ordonnanceService";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Initialiser les données par défaut
  initializeData: async () => {
    console.log("🔄 Initialisation des données...");
    await initializeUsers();
    await initializeMedicaments();
    await initializeOrdonnances();
    console.log("✅ Toutes les données ont été initialisées");
  },

  // Connexion
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // S'assurer que les données sont initialisées avant la connexion
      await initializeUsers();
      await initializeMedicaments();
      await initializeOrdonnances();
      
      const user = await authenticateUser(email, password);
      console.log("Résultat de l'authentification:", user);
      
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false, error: null });
        return true;
      } else {
        set({ 
          error: "Email ou mot de passe incorrect", 
          isLoading: false 
        });
        return false;
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      set({ 
        error: "Erreur de connexion", 
        isLoading: false 
      });
      return false;
    }
  },

  // Déconnexion
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  // Effacer l'erreur
  clearError: () => {
    set({ error: null });
  }
}));