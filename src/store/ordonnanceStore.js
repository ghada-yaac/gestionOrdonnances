import { create } from "zustand";
import { 
  getOrdonnances, 
  addOrdonnance, 
  updateOrdonnance,
  deleteOrdonnance 
} from "../api/ordonnanceService";

export const useOrdonnanceStore = create((set) => ({
  ordonnances: [],
  isLoading: false,

  loadOrdonnances: async () => {
    set({ isLoading: true });
    const data = await getOrdonnances();
    set({ ordonnances: data, isLoading: false });
  },

  addOrdonnance: async (ordonnance) => {
    const updated = await addOrdonnance(ordonnance);
    set({ ordonnances: updated });
  },

  updateOrdonnance: async (id, updated) => {
    const newList = await updateOrdonnance(id, updated);
    set({ ordonnances: newList });
  },

  deleteOrdonnance: async (id) => {
    console.log("🗑️ Store: Suppression de l'ordonnance", id);
    const newList = await deleteOrdonnance(id);
    console.log("✅ Store: Nouvelle liste avec", newList.length, "ordonnances");
    set({ ordonnances: newList });
    return newList;
  },

  getOrdonnancesByPatient: (patientId) => {
    const state = useOrdonnanceStore.getState();
    return state.ordonnances.filter((o) => o.patientId === patientId);
  },

  getOrdonnanceById: (id) => {
    const state = useOrdonnanceStore.getState();
    return state.ordonnances.find((o) => o.id === id);
  }
}));