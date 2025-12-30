import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function CustomerList({
  customers,
  filteredCustomers,
  selectedNumbers,
  addToList,
  highlightText,
  searchQuery,
}) {
  const data = filteredCustomers || customers;

  return (
    <FlatList
      data={data}
      style={{ marginTop: 5 }}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View
          style={{ width: '100%', height: 0.25, backgroundColor: '#22223B' }}
        />
      }
      ListFooterComponent={
        selectedNumbers.length > 0
          ? <View style={{ height: 129 }} />
          : <View style={{ height: 77 }} />
      }
      renderItem={({ item }) => {
        const isSelected = selectedNumbers.includes(item.mobile);

        return (
          <View
            style={[
              styles.card,
              isSelected && { backgroundColor: '#FFFFFF' },
            ]}
          >
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={styles.name}>
                {highlightText(item.name, searchQuery)}
              </Text>
              <Text style={styles.mobile}>
                {highlightText(item.mobile, searchQuery)}
              </Text>
            </View>

            <TouchableOpacity onPress={() => addToList(item.mobile)}>
              <Image
                source={
                  isSelected
                    ? require('../../assets/vectors/tickViolet.png')
                    : require('../../assets/vectors/plusViolet.png')
                }
                style={{ width: 22, height: 22, resizeMode: 'contain' }}
              />
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17,
    borderBottomWidth: 0.25,
    borderBottomColor: '#22223B'
  },
  name :{
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 20,
  },
  mobile: {
    fontFamily: 'Quantico',
    fontWeight: 400,
    marginTop: 10,
    fontSize: 14,
  },
});