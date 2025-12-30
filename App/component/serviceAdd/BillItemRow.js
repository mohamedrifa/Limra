import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const BillItemRow = ({
  item,
  index,
  handleInputChange,
  ogChange,
  setShowSuggestion,
}) => {
  return (
    <View style={{ flexDirection: 'column' }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.tableVerticalLine1} />
        <View style={styles.tableSNo}>
          <Text style={styles.headerText}>{item.id}</Text>
        </View>
        <View style={styles.tableVerticalLine1} />
        <View style={styles.tableParticulars}>
          <TextInput
            style={[styles.inputText, { width: '100%' }]}
            value={item.particulars || ''}
            onFocus={() => setShowSuggestion(false)}
            onChangeText={(text) =>
              handleInputChange(index, 'particulars', text)
            }
          />
        </View>
        <View style={styles.tableVerticalLine1} />
        <View style={styles.tableRate}>
          <TextInput
            style={styles.inputText}
            value={item.rate || ''}
            onFocus={() => setShowSuggestion(false)}
            onChangeText={(text) => {
              handleInputChange(index, 'rate', text);
              ogChange(index, 'rate', text);
            }}
          />
        </View>
        <View style={styles.tableVerticalLine1} />
        <View style={styles.tableQty}>
          <TextInput
            style={styles.inputText}
            keyboardType="numeric"
            value={item.qty || ''}
            onFocus={() => setShowSuggestion(false)}
            onChangeText={(text) =>
              handleInputChange(index, 'qty', text)
            }
          />
        </View>
        <View style={styles.tableVerticalLine1} />
        <View style={styles.tableTotal}>
          <Text
            style={[
              styles.inputText,
              { width: '100%', textAlign: 'right', marginRight: 8 },
            ]}
          >
            {item.total || ''}
          </Text>
        </View>
        <View style={styles.tableVerticalLine1} />
        <View style={[styles.tableOgPrice, { alignItems: 'flex-end' }]}>
          <TextInput
            style={styles.inputText}
            keyboardType="numeric"
            value={item.originalPrice || ''}
            onFocus={() => setShowSuggestion(false)}
            onChangeText={(text) =>
              handleInputChange(index, 'originalPrice', text)
            }
          />
        </View>
        <View style={styles.tableVerticalLine2} />
        <View style={styles.tableCommision}>
          <Text
            style={[
              styles.inputText,
              { width: '100%', textAlign: 'right', marginRight: 8 },
            ]}
          >
            {item.commission || ''}
          </Text>
        </View>
        <View style={styles.tableVerticalLine2} />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.tableHorizontalLine1} />
        <View style={styles.tableHorizontalLine2} />
      </View>
    </View>
  );
};

export default BillItemRow;

const styles = StyleSheet.create({
  tableHorizontalLine1:{
    width: 466, 
    height: 1, 
    backgroundColor: '#22223B'
  },
  tableHorizontalLine2:{
    width: 230, 
    height: 1, 
    backgroundColor: '#9A8C98'
  },
  tableVerticalLine1: {
    height: 38,
    width: 1,
    backgroundColor: '#22223B',
  },
  tableVerticalLine2: {
    height: 38,
    width: 1,
    backgroundColor: '#9A8C98',
  },
  tableSNo: {
    width: 40,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableParticulars: {
    width: 206,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableRate: {
    width: 82,
    height: 38,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableQty: {
    width: 50,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableTotal: {
    width: 82,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableOgPrice: {
    width: 114,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableCommision: {
    width: 114,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
});