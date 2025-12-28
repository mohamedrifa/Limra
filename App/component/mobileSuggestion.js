import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import { MobileNumbersSuggest } from "../api/taskApi";

export default function MobileSuggestion ({visible, customer, selectedSuggestion}) {
  if(!visible) return null;
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    const unsubscribe = MobileNumbersSuggest(setSuggestions);
    return () => unsubscribe();
  }, []);

  const filtered = suggestions.filter(item =>
    item
      ?.toString()
      .toLowerCase()
      .includes((customer.mobile ?? '').toString().toLowerCase())
  );
  return (
    <View style={styles.suggestionBg}>
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 2,
              height: 30,
              borderTopColor: '#808080',
              borderTopWidth: 0.5,
            }}
            onPress={() => selectedSuggestion(item)}
          >
            <Text
              style={{
                fontFamily: 'Poppins',
                fontSize: 16,
                color: '#4A4E69',
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
      </View>
  )
}

const styles = StyleSheet.create({
  suggestionBg: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 207,
    left: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});