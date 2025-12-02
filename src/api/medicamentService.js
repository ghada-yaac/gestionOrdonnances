import { getItem, saveItem } from "./asyncStorage";

const MEDICAMENT_KEY = "medicaments";

export const getMedicaments = async () => {
  return (await getItem(MEDICAMENT_KEY)) || [];
};

export const initializeMedicaments = async () => {
  // FORCER la recréation des médicaments à chaque fois
  const defaultMeds = [
    {
      id: "m001",
      nom: "Doliprane",
      dosage: "500 mg",
      forme: "Comprimé",
      quantiteStock: 120
    },
    {
      id: "m002",
      nom: "Ibuprofène",
      dosage: "400 mg",
      forme: "Comprimé",
      quantiteStock: 80
    },
    {
      id: "m003",
      nom: "Amoxicilline",
      dosage: "1 g",
      forme: "Gélule",
      quantiteStock: 50
    },
    {
      id: "m004",
      nom: "Aspirine",
      dosage: "500 mg",
      forme: "Comprimé",
      quantiteStock: 150
    },
    {
      id: "m005",
      nom: "Ventoline",
      dosage: "100 μg",
      forme: "Spray",
      quantiteStock: 30
    }
  ];
  
  // Toujours écraser les médicaments existants
  await saveItem(MEDICAMENT_KEY, defaultMeds);
  console.log("✅ Médicaments réinitialisés:", defaultMeds.length, "médicaments");
  return defaultMeds;
};

export const addMedicament = async (medicament) => {
  const meds = await getMedicaments();
  const newList = [...meds, medicament];
  await saveItem(MEDICAMENT_KEY, newList);
  return newList;
};

export const updateMedicament = async (id, updated) => {
  const meds = await getMedicaments();
  const newList = meds.map((m) => (m.id === id ? { ...m, ...updated } : m));
  await saveItem(MEDICAMENT_KEY, newList);
  return newList;
};

export const deleteMedicament = async (id) => {
  const meds = await getMedicaments();
  const newList = meds.filter((m) => m.id !== id);
  await saveItem(MEDICAMENT_KEY, newList);
  return newList;
};