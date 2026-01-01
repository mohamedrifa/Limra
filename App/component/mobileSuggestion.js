import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { MobileNumbersSuggest, selectCustomerByMobile } from "../api/serviceApi";

export default function MobileSuggestion({ visible, customer, setCustomer }) {
  if (!visible) return null;

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const unsubscribe = MobileNumbersSuggest(setSuggestions);
    return () => unsubscribe();
  }, []);

  const filtered = suggestions.filter(item =>
    item
      .toString()
      .includes(customer.mobile ?? '')
  );

  const selectedSuggestion = async (mobileNo) => {
    selectCustomerByMobile(mobileNo, setCustomer);
  };

  return (
    <View style={styles.suggestionBg}>
      <FlatList
        data={filtered}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => selectedSuggestion(item)}
          >
            <Text style={styles.text}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  suggestionBg: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: 'absolute',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    zIndex: 10,
  },
  item: {
    padding: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#808080',
  },
  text: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#4A4E69',
  },
});
