import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Alert, Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as SMS from "expo-sms";
import * as Accelerometer from "expo-sensors";
import { Card, Chip, FAB, Text } from "react-native-paper";
import { supabase } from "../lib/Supabase.js";

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [sosPreference, setSosPreference] = useState("sms+call");
  const [shakeEnabled, setShakeEnabled] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [sosTriggered, setSosTriggered] = useState(false);

  // Load initial data
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "GPS access is required for SOS");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      // Request SMS permissions
      await SMS.requestPermissionsAsync();

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (loc.coords) {
          await supabase.from('live_locations').upsert({
            user_id: user.id,
            lat: loc.coords.latitude,
            lon: loc.coords.longitude,
          }, { onConflict: 'user_id' });
        }

        const { data: contactsData } = await supabase
          .from('emergency_contacts')
          .select('*')
          .eq('user_id', user.id);
        setContacts(contactsData || []);

        const { data: settings } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        setSosPreference(settings?.sos_preference || "sms+call");
        setShakeEnabled(settings?.shake_enabled || false);
      }
    })();
  }, []);

  // Watch for location updates and sync to live_locations
  useEffect(() => {
    let watchSubscription = null;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        watchSubscription = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 60000 }, async (loc) => {
          setLocation(loc.coords);
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('live_locations').upsert({
              user_id: user.id,
              lat: loc.coords.latitude,
              lon: loc.coords.longitude,
            }, { onConflict: 'user_id' });
          }
        });
      }
    })();
    return () => {
      if (watchSubscription) {
        watchSubscription.remove();
      }
    };
  }, []);

  // Shake detection listener
  useEffect(() => {
    if (shakeEnabled) {
      const sub = Accelerometer.addListener(setAccelerometerData);
      setSubscription(sub);
      Accelerometer.setUpdateInterval(100);
    } else {
      if (subscription) {
        subscription.remove();
        setSubscription(null);
      }
    }
    return () => subscription?.remove();
  }, [shakeEnabled]);

  // Detect shake and trigger SOS
  useEffect(() => {
    if (shakeEnabled && !sosTriggered && accelerometerData) {
      const { x, y, z } = accelerometerData;
      const total = Math.sqrt(x * x + y * y + z * z);
      if (total > 15) {
        setSosTriggered(true);
        sendSOS();
        setTimeout(() => setSosTriggered(false), 3000); // Prevent multiple triggers for 3 seconds
      }
    }
  }, [accelerometerData]);

  // SOS action
  const sendSOS = async () => {
    if (!location) {
      Alert.alert("Error", "Location not available");
      return;
    }

    // Reload contacts in case they weren't loaded initially
    const { data, error } = await supabase.auth.getSession();
    const user = data.session?.user;
    console.warn('Debug sendSOS: auth session user', user);
    if (!user) {
      Alert.alert("Error", "User not authenticated - please login again");
      return;
    }

    const { data: contactsData, error: contactsError } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id);
    console.warn('Debug: loaded contacts for user', user.id, contactsData, contactsError);
    const updatedContacts = contactsData || [];
    setContacts(updatedContacts); // Update state

    if (updatedContacts.length === 0) {
      Alert.alert("No Contacts", "Please add emergency contacts in Profile.");
      return;
    }

    const message = `🚨 SOS ALERT 🚨
Help needed!
My location: https://maps.google.com/?q=${location.latitude},${location.longitude}`;

    // Send SMS
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync(
        updatedContacts.map((c) => c.contact_number), // send to all numbers
        message
      );
    } else {
      Alert.alert("Error", "SMS not available on this device");
    }

    // Call first contact if preference is sms+call
    if (sosPreference === "sms+call" && updatedContacts.length > 0) {
      Linking.openURL(`tel:${updatedContacts[0].contact_number}`);
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <Card style={styles.card}>
          <Card.Title title="Your Location" />
          <Card.Content>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.012,
                longitudeDelta: 0.006,
              }}
            >
              <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
            </MapView>
          </Card.Content>
        </Card>
      ) : (
        <Text>Loading location...</Text>
      )}

      <Card style={styles.card}>
        <Card.Content style={{ alignItems: "center" }}>
          <View style={styles.chipContainer}>
            <Chip icon="shield-check" style={{ backgroundColor: "#C8E6C9" }}>
              SAFE AREA
            </Chip>
            <Chip icon="robot" mode="outlined" onPress={() => navigation.navigate('Chatbot')}>
              Ask Chatbot
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <FAB
        icon="alarm-light"
        label="SOS"
        style={styles.fab}
        color="white"
        onPress={sendSOS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9", padding: 10 },
  card: {
    marginVertical: 8,
    borderRadius: 16,
    elevation: 3,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: Dimensions.get("window").height / 2.5,
    borderRadius: 12,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#D32F2F",
  },
  chipContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
});
