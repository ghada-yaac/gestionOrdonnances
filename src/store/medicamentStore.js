import { create } from "zustand";
import { 
  getMedicaments, 
  addMedicament, 
  updateMedicament, 
  deleteMedicament 
} from "../api/medicamentService";

export const useMedicamentStore = create((set) => ({
  medicaments: [],
  isLoading: false,

  loadMedicaments: async () => {
    set({ isLoading: true });
    const data = await getMedicaments();
    set({ medicaments: data, isLoading: false });
  },

  addMedicament: async (med) => {
    const updated = await addMedicament(med);
    set({ medicaments: updated });
  },

  updateMedicament: async (id, updated) => {
    const newList = await updateMedicament(id, updated);
    set({ medicaments: newList });
  },

  deleteMedicament: async (id) => {
    const newList = await deleteMedicament(id);
    set({ medicaments: newList });
  },

  getMedicamentById: (id) => {
    return useMedicamentStore.getState().medicaments.find((m) => m.id === id);
  }
}));