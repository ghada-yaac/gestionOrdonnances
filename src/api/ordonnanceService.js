import { getItem, saveItem } from "./asyncStorage";

const ORDONNANCE_KEY = "ordonnances";

export const getOrdonnances = async () => {
  return (await getItem(ORDONNANCE_KEY)) || [];
};

export const initializeOrdonnances = async () => {
  // FORCER la recréation des ordonnances à chaque fois
  const defaultOrdonnances = [
    {
      id: "o888",
      patientId: "u222", // Correspond à l'ID du patient Jean Martin
      medecinId: "u111",
      medecinName: "Dr Dupont",
      medicaments: [
        {
          idMedicament: "m001",
          nomMedicament: "Doliprane",
          dosage: "500 mg",
          quantiteParJour: 2,
          duree: 5
        }
      ],
      date: "2025-01-20",
      notes: "Prendre après les repas"
    },
    {
      id: "o889",
      patientId: "u222", // Correspond à l'ID du patient Jean Martin
      medecinId: "u111",
      medecinName: "Dr Dupont",
      medicaments: [
        {
          idMedicament: "m002",
          nomMedicament: "Ibuprofène",
          dosage: "400 mg",
          quantiteParJour: 3,
          duree: 7
        },
        {
          idMedicament: "m003",
          nomMedicament: "Amoxicilline",
          dosage: "1 g",
          quantiteParJour: 2,
          duree: 7
        }
      ],
      date: "2025-01-25",
      notes: "Traitement antibiotique complet - Ne pas arrêter avant la fin"
    },
    {
      id: "o890",
      patientId: "u222",
      medecinId: "u111",
      medecinName: "Dr Martin",
      medicaments: [
        {
          idMedicament: "m001",
          nomMedicament: "Doliprane",
          dosage: "500 mg",
          quantiteParJour: 3,
          duree: 3
        }
      ],
      date: "2025-02-01",
      notes: "En cas de fièvre supérieure à 38°C"
    },
    {
      id: "o891",
      patientId: "u222",
      medecinId: "u111",
      medecinName: "Dr Lefebvre",
      medicaments: [
        {
          idMedicament: "m002",
          nomMedicament: "Ibuprofène",
          dosage: "400 mg",
          quantiteParJour: 2,
          duree: 5
        }
      ],
      date: "2025-01-15",
      notes: "Pour douleurs musculaires"
    }
  ];
  
  await saveItem(ORDONNANCE_KEY, defaultOrdonnances);
  console.log("✅ Ordonnances réinitialisées:", defaultOrdonnances.length, "ordonnances");
  return defaultOrdonnances;
};

export const addOrdonnance = async (ordonnance) => {
  const ords = await getOrdonnances();
  const newList = [...ords, ordonnance];
  await saveItem(ORDONNANCE_KEY, newList);
  return newList;
};

export const updateOrdonnance = async (id, updated) => {
  const ords = await getOrdonnances();
  const newList = ords.map((o) => (o.id === id ? { ...o, ...updated } : o));
  await saveItem(ORDONNANCE_KEY, newList);
  return newList;
};