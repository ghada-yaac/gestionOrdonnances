import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { useAuthStore } from "../../store/authStore";
import { Ionicons } from "@expo/vector-icons";

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login, isLoading, error, clearError, initializeData } = useAuthStore();

  useEffect(() => {
    initializeData();
  }, []);

  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("L'email est requis");
      isValid = false;
    } else if (!email.includes("@")) {
      setEmailError("Email invalide");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Le mot de passe est requis");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    clearError();
    console.log("Tentative de connexion avec:", email, password);
    
    const success = await login(email, password);
    console.log("Succès de connexion:", success);

    if (!success) {
      const currentError = useAuthStore.getState().error;
      Alert.alert("Erreur de connexion", currentError || "Email ou mot de passe incorrect");
    }
  };

  const fillTestCredentials = (role) => {
    if (role === "patient") {
      setEmail("patient@test.com");
      setPassword("patient123");
    } else if (role === "pharmacien") {
      setEmail("pharmacien@test.com");
      setPassword("pharma123");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="medical" size={48} color="#4F46E5" />
          </View>
          <Text style={styles.title}>Gestion d'Ordonnances</Text>
          <Text style={styles.subtitle}>
            Connectez-vous pour accéder à votre espace
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="exemple@email.com"
            keyboardType="email-address"
            error={emailError}
          />

          <Input
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            error={passwordError}
          />

          <Button
            title="Se connecter"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          <View style={styles.testAccountsContainer}>
            <Text style={styles.testAccountsTitle}>Comptes de test :</Text>

            <View style={styles.testButtons}>
              <Button
                title="Patient"
                onPress={() => fillTestCredentials("patient")}
                variant="outline"
                style={styles.testButton}
              />
              <Button
                title="Pharmacien"
                onPress={() => fillTestCredentials("pharmacien")}
                variant="outline"
                style={styles.testButton}
              />
            </View>

            <View style={styles.credentialsInfo}>
              <View style={styles.credentialRow}>
                <Ionicons name="person-outline" size={16} color="#6B7280" />
                <Text style={styles.credentialText}>
                  Patient: patient@test.com / patient123
                </Text>
              </View>
              <View style={styles.credentialRow}>
                <Ionicons name="medkit-outline" size={16} color="#6B7280" />
                <Text style={styles.credentialText}>
                  Pharmacien: pharmacien@test.com / pharma123
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  loginButton: {
    marginTop: 8,
  },
  testAccountsContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  testAccountsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  testButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  testButton: {
    flex: 1,
  },
  credentialsInfo: {
    gap: 8,
  },
  credentialRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  credentialText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 8,
  },
});