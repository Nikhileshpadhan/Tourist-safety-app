import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Card, Text, List, Searchbar } from "react-native-paper";
import kb from "../chatbot/kb.js";

export default function ChatbotScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = (text) => {
    setQuery(text);
    if (text.trim() === "") {
      setResults([]);
      return;
    }

    const normalized = text.toLowerCase();
    const filtered = kb.filter((item) =>
      item.title.toLowerCase().includes(normalized) ||
      item.tags.some((tag) => tag.toLowerCase().includes(normalized))
    );
    setResults(filtered);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Tourist Chatbot" />
        <Card.Content>
          <Searchbar
            placeholder="Ask about safety, travel tips, or app help..."
            value={query}
            onChangeText={handleSearch}
            style={styles.searchbar}
          />
        </Card.Content>
      </Card>

      <ScrollView style={styles.scrollContainer}>
        {results.map((item) => (
          <Card key={item.id} style={styles.resultCard}>
            <Card.Title title={item.title} titleStyle={{ fontWeight: "bold" }} />
            <Card.Content>
              <Text>{item.text}</Text>
            </Card.Content>
          </Card>
        ))}
        {query && results.length === 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text>No matching information found. Try different keywords.</Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F9", padding: 16 },
  card: { borderRadius: 16, elevation: 3, marginBottom: 16 },
  searchbar: { marginBottom: 0 },
  scrollContainer: { flex: 1 },
  resultCard: { borderRadius: 16, elevation: 3, marginBottom: 12 },
});
