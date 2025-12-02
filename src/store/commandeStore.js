import { create } from "zustand";
import { 
  getCommandes, 
  addCommande, 
  updateCommandeStatus 
} from "../api/commandeService";

export const useCommandeStore = create((set) => ({
  commandes: [],
  isLoading: false,

  loadCommandes: async () => {
    set({ isLoading: true });
    const data = await getCommandes();
    set({ commandes: data, isLoading: false });
  },

  addCommande: async (commande) => {
    const updated = await addCommande(commande);
    set({ commandes: updated });
    return commande;
  },

  updateCommandeStatus: async (id, status) => {
    const newList = await updateCommandeStatus(id, status);
    set({ commandes: newList });
  },

  getCommandesByPatient: (patientId) => {
    const state = useCommandeStore.getState();
    return state.commandes.filter((c) => c.patientId === patientId);
  },

  getCommandesByPharmacien: (pharmacienId) => {
    const state = useCommandeStore.getState();
    return state.commandes.filter((c) => c.pharmacienId === pharmacienId);
  },

  getCommandeById: (id) => {
    const state = useCommandeStore.getState();
    return state.commandes.find((c) => c.id === id);
  }
}));