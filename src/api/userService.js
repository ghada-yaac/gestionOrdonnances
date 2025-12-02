import { getItem, saveItem } from "./asyncStorage";

const USER_KEY = "users";

export const getUsers = async () => {
  return (await getItem(USER_KEY)) || [];
};

export const initializeUsers = async () => {
  const defaultUsers = [
    {
      id: "u222",
      role: "patient",
      name: "Jean Martin",
      email: "patient@test.com",
      password: "patient123",
      age: 45,
      adresse: "10 rue des Lilas",
      telephone: "0600000000"
    },
    {
      id: "u333",
      role: "pharmacien",
      name: "Marie Dubois",
      email: "pharmacien@test.com",
      password: "pharma123"
    }
  ];
  
  await saveItem(USER_KEY, defaultUsers);
  console.log("✅ Utilisateurs réinitialisés:", defaultUsers);
  return defaultUsers;
};

export const authenticateUser = async (email, password) => {
  let users = await getUsers();
  if (users.length === 0) {
    users = await initializeUsers();
  }
  
  console.log("Tentative de connexion avec:", email);
  console.log("Utilisateurs disponibles:", users);
  
  const user = users.find(
    (u) => u.email === email && u.password === password
  );
  
  console.log("Utilisateur trouvé:", user);
  return user || null;
};