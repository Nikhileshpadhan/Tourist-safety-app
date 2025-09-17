import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/Supabase.js";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // ✅ Handle Login
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login Failed", error.message);
    } else {
      const user = data.user;
      if (user) {
        // Upsert user to custom "users" table
        const { error: upsertError } = await supabase
          .from("users")
          .upsert([
            {
              id: user.id, // Supabase Auth UID
              email: user.email,
              role: "User",
              status: "Active",
            },
          ], { onConflict: 'id' });

        if (upsertError) {
          console.warn("Error upserting user:", upsertError.message);
        } else {
          console.log("User upserted to custom users table");
        }
      }

      navigation.replace("Main"); // redirect to drawer after login
    }
  };

  // ✅ Handle Signup and also insert into users table
  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Signup Failed", error.message);
      return;
    }

    const user = data.user;

    if (user) {
      // Insert into custom "users" table
      const { error: insertError } = await supabase
        .from("users")
        .insert([
          {
            id: users.id, // Supabase Auth UId
            email: users.email,
            role: "User",
            status: "Active",
          },
        ]);

      if (insertError) {
        console.log("Error inserting user:", insertError.message);
      } else {
        console.log("User added to custom users table");
      }
    }

    Alert.alert("Signup Success", "Check your email to confirm.");
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Tourist Safety App"
          titleStyle={styles.title}
        />
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry
          />
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
          >
            Login
          </Button>
          <Button
            mode="outlined"
            onPress={handleSignup}
            style={styles.button}
          >
            Signup
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});
