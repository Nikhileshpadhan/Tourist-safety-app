import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Text,
  Card,
  List,
  Avatar,
  Button,
  TextInput,
  IconButton,
} from "react-native-paper";
import { supabase } from "../lib/Supabase.js";

export default function ProfileScreen() {
  const [contacts, setContacts] = useState([]);
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  // Load user and contacts from Supabase
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: contactsData, error } = await supabase
          .from('emergency_contacts')
          .select('*')
          .eq('user_id', user.id);

        console.warn('Debug Profile: loaded contacts for user', user.id, contactsData, error);
        if (!error) {
          setContacts(contactsData);
        }
      }
    })();
  }, []);

  // Add a contact
  const addContact = async () => {
    if (newName.trim() === "" || newNumber.trim() === "") return;

    if (!user || !user.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert([{ user_id: user.id, contact_name: newName.trim(), contact_number: newNumber.trim() }])
      .select()
      .single();

    if (!error) {
      setContacts([...contacts, data]);
      setNewName("");
      setNewNumber("");
    } else {
      console.error("Supabase error:", error);
      Alert.alert("Error", "Failed to add contact: " + error.message);
    }
  };

  // Delete a contact
  const deleteContact = async (contact) => {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .match({ id: contact.id, user_id: user.id });

    if (!error) {
      setContacts(contacts.filter(c => c.id !== contact.id));
    } else {
      Alert.alert("Error", "Failed to delete contact");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.card}>
        <Card.Content style={styles.profileHeader}>
          <Avatar.Image size={80} source={require("../../assets/icon.png")} />
        <View style={styles.userInfo}>
          <Text variant="headlineSmall">{user?.user_metadata?.full_name || user?.email || "User"}</Text>
          <Text variant="bodyMedium">{user?.email}</Text>
        </View>
        </Card.Content>
      </Card>

      {/* Emergency Contacts */}
      <Card style={styles.card}>
        <Card.Title title="Emergency Contacts" />
        <Card.Content>
          {contacts.length === 0 ? (
            <Text>No contacts saved</Text>
          ) : (
            contacts.map((c) => (
              <List.Item
                key={c.id}
                title={c.contact_name}
                description={c.contact_number}
                left={(props) => <List.Icon {...props} icon="phone" />}
                right={(props) => (
                  <IconButton
                    icon="delete"
                    iconColor="red"
                    onPress={() => deleteContact(c)}
                  />
                )}
              />
            ))
          )}

          {/* Input for new contact */}
          <TextInput
            label="Contact Name"
            value={newName}
            onChangeText={setNewName}
            mode="outlined"
            style={{ marginTop: 10 }}
          />
          <TextInput
            label="Contact Number"
            value={newNumber}
            onChangeText={setNewNumber}
            keyboardType="phone-pad"
            mode="outlined"
            style={{ marginTop: 10 }}
          />
          <Button
            mode="contained"
            style={{ marginTop: 10 }}
            onPress={addContact}
          >
            + Add Contact
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  card: { margin: 16, marginBottom: 8, borderRadius: 12 },
  profileHeader: { flexDirection: "row", alignItems: "center" },
  userInfo: { marginLeft: 16, flex: 1 },
});
