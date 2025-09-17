import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { Card, List, Switch, Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/Supabase.js";

export default function SettingScreen() {
  const navigation = useNavigation();
  const [sosPreference, setSosPreference] = useState("sms+call"); // Default: SMS + Call
  const [locationSharing, setLocationSharing] = useState(false); // Default: Only on SOS
  const [shakeEnabled, setShakeEnabled] = useState(false); // Default: Disabled

  // Load preferences from Supabase
  useEffect(() => {
    const loadSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: settings } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (settings) {
          setSosPreference(settings.sos_preference || "sms+call");
          setLocationSharing(settings.location_sharing || false);
          setShakeEnabled(settings.shake_enabled || false);
        }
      }
    };
    loadSettings();
  }, []);

  // Save settings to Supabase
  const saveSettings = async (updates) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('user_settings')
        .upsert([{ user_id: user.id, ...updates }]);
    }
  };

  // Toggle SOS Preference
  const toggleSosPreference = async (preference) => {
    setSosPreference(preference);
    await saveSettings({ sos_preference: preference });
  };

  // Toggle Location Sharing
  const toggleLocationSharing = async (value) => {
    setLocationSharing(value);
    await saveSettings({ location_sharing: value });
  };

  // Toggle Shake Enabled
  const toggleShake = async (value) => {
    setShakeEnabled(value);
    await saveSettings({ shake_enabled: value });
  };

  // Clear Emergency Contacts
  const clearContacts = async () => {
    Alert.alert(
      "Clear Emergency Contacts",
      "Are you sure you want to remove all emergency contacts?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('emergency_contacts').delete().eq('user_id', user.id);
            }
            Alert.alert("Success", "Emergency contacts cleared.");
          },
        },
      ]
    );
  };

  // Logout and Clear Profile
  const logout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            await supabase.auth.signOut();
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* SOS Preferences */}
      <Card style={styles.card}>
        <Card.Title title="SOS Preferences" />
        <Card.Content>
          <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
            Choose how SOS alerts are sent
          </Text>
          <List.Item
            title="SMS only"
            titleStyle={sosPreference === "sms" ? { fontWeight: "bold", color: "#1976D2" } : {}}
            onPress={() => toggleSosPreference("sms")}
            right={(props) => (
              <Switch
                value={sosPreference === "sms"}
                onValueChange={(value) => value && toggleSosPreference("sms")}
              />
            )}
          />
          <List.Item
            title="SMS + Call"
            titleStyle={sosPreference === "sms+call" ? { fontWeight: "bold", color: "#1976D2" } : {}}
            onPress={() => toggleSosPreference("sms+call")}
            right={(props) => (
              <Switch
                value={sosPreference === "sms+call"}
                onValueChange={(value) => value && toggleSosPreference("sms+call")}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Location Sharing */}
      <Card style={styles.card}>
        <Card.Title title="Location Sharing" />
        <Card.Content>
          <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
            Choose when to share your location
          </Text>
          <List.Item
            title="Always allow location"
            titleStyle={locationSharing ? { fontWeight: "bold", color: "#1976D2" } : {}}
            onPress={() => toggleLocationSharing(true)}
            right={(props) => (
              <Switch
                value={locationSharing}
                onValueChange={toggleLocationSharing}
              />
            )}
          />
          <List.Item
            title="Only share location on SOS"
            titleStyle={!locationSharing ? { fontWeight: "bold", color: "#1976D2" } : {}}
            onPress={() => toggleLocationSharing(false)}
          />
        </Card.Content>
      </Card>

      {/* Shake to SOS */}
      <Card style={styles.card}>
        <Card.Title title="Shake to SOS" />
        <Card.Content>
          <List.Item
            title="Enable Shake-to-SOS"
            titleStyle={shakeEnabled ? { fontWeight: "bold", color: "#1976D2" } : {}}
            onPress={() => toggleShake(!shakeEnabled)}
            right={(props) => (
              <Switch value={shakeEnabled} onValueChange={toggleShake} />
            )}
          />
        </Card.Content>
      </Card>

      {/* Emergency Contacts */}
      <Card style={styles.card}>
        <Card.Title title="Emergency Contacts" />
        <Card.Content>
          <Button mode="outlined" onPress={clearContacts} style={styles.button}>
            Clear Emergency Contacts
          </Button>
        </Card.Content>
      </Card>

      {/* Profile & App */}
      <Card style={styles.card}>
        <Card.Title title="Profile & App" />
        <Card.Content>
          <Button mode="contained" onPress={logout} style={styles.button}>
            Logout (Clear Profile)
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9", padding: 16 },
  card: { borderRadius: 16, elevation: 3, marginBottom: 16 },
  button: { marginVertical: 8 },
});
