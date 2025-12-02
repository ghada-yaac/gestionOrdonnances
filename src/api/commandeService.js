import { getItem, saveItem } from "./asyncStorage";

const COMMANDE_KEY = "commandes";

export const getCommandes = async () => {
  return (await getItem(COMMANDE_KEY)) || [];
};

export const addCommande = async (commande) => {
  const cmds = await getCommandes();
  const newList = [...cmds, commande];
  await saveItem(COMMANDE_KEY, newList);
  return newList;
};

export const updateCommandeStatus = async (id, status) => {
  const cmds = await getCommandes();
  const newList = cmds.map((c) =>
    c.id === id ? { ...c, status } : c
  );
  await saveItem(COMMANDE_KEY, newList);
  return newList;
};

export const getCommandeById = async (id) => {
  const cmds = await getCommandes();
  return cmds.find((c) => c.id === id) || null;
};