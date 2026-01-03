import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import BillItemRow from './BillItemRow';

const BillTable = ({
  billItems,
  billTotals,
  handleInputChange,
  ogChange,
  setShowSuggestion,
  handleAddRow,
  setDeleteVisible,
  setSelectedItemId,
}) => {
  return (
    <ScrollView
      horizontal
      style={{ marginTop: 18 }}
      showsHorizontalScrollIndicator={false}
    >
      <View style={{ flexDirection: 'column' }}>

        {/* Top Line */}
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.tableHorizontalLine1} />
          <View style={styles.tableHorizontalLine2} />
        </View>

        {/* Header Row */}
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.tableVerticalLine1} />
          <View style={styles.tableSNo}><Text style={styles.headerText}>S.NO</Text></View>
          <View style={styles.tableVerticalLine1} />
          <View style={styles.tableParticulars}><Text style={styles.headerText}>Particulars</Text></View>
          <View style={styles.tableVerticalLine1} />
          <View style={styles.tableRate}><Text style={styles.headerText}>Rate</Text></View>
          <View style={styles.tableVerticalLine1} />
          <View style={styles.tableQty}><Text style={styles.headerText}>Qty</Text></View>
          <View style={styles.tableVerticalLine1} />
          <View style={styles.tableTotal}><Text style={styles.headerText}>Total</Text></View>
          <View style={styles.tableVerticalLine1} />
          <View style={styles.tableOgPrice}><Text style={styles.headerText}>Original Price</Text></View>
          <View style={styles.tableVerticalLine2} />
          <View style={styles.tableCommision}><Text style={styles.headerText}>Balance</Text></View>
          <View style={styles.tableVerticalLine2} />
        </View>

        {/* Header Bottom Line */}
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.tableHorizontalLine1} />
          <View style={styles.tableHorizontalLine2} />
        </View>

        {/* Rows */}
        <FlatList
          data={billItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <BillItemRow
              item={item}
              index={index}
              styles={styles}
              handleInputChange={handleInputChange}
              ogChange={ogChange}
              setShowSuggestion={setShowSuggestion}
              setDeleteVisible={setDeleteVisible}
              setSelectedItemId={setSelectedItemId}
            />
          )}
        />

        {/* Add Row Button */}
        <TouchableOpacity
          style={styles.addRowButton}
          onPress={handleAddRow}
        >
          <Text style={styles.addButtonText}>Add 1 more row</Text>
          <Image
            style={styles.addButtonIcon}
            source={require('../../assets/vectors/plus_black.png')}
          />
        </TouchableOpacity>

        {/* Footer Line */}
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.tableHorizontalLine1} />
          <View style={styles.tableHorizontalLine2} />
        </View>

        {/* Totals Row */}
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.tableVerticalLine1} />
          <View style={styles.overallTotal}>
            <Text style={styles.headerText}>Total</Text>
          </View>
          <View style={styles.tableVerticalLine1} />
          <View style={styles.tableTotal}>
            <Text style={[styles.inputText, { textAlign: 'right', marginRight: 8, width: '100%' }]}>
              {billTotals.customTotal}
            </Text>
          </View>
          <View style={styles.tableVerticalLine1} />
          <View style={styles.tableOgPrice}>
            <Text style={[styles.inputText, { textAlign: 'right', marginRight: 8, width: '100%' }]}>
              {billTotals.ogTotal}
            </Text>
          </View>
          <View style={styles.tableVerticalLine2} />
          <View style={styles.tableCommision}>
            <Text style={[styles.inputText, { textAlign: 'right', marginRight: 8, width: '100%' }]}>
              {billTotals.commisionTotal}
            </Text>
          </View>
          <View style={styles.tableVerticalLine2} />
        </View>

        {/* Bottom Line */}
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.tableHorizontalLine1} />
          <View style={styles.tableHorizontalLine2} />
        </View>

      </View>
    </ScrollView>
  );
};

export default BillTable;


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
  headerText: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 14,
    color: '#22223B'
  },
  inputText: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    height: 60,
    textAlignVertical: 'center',
    color: '#22223B',
  },
  addRowButton: {
    height: 20,
    width: 466,
    backgroundColor: '#C9ADA7',
    borderStartColor: '#22223B',
    borderEndColor: '#22223B',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderEndWidth: 1,
    borderStartWidth: 1,
  },
  addButtonText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: 400,
    color: '#22223B',
  },
  addButtonIcon: {
    width: 10,
    height: 10,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  overallTotal: {
    height: 38,
    width: 381,
    alignItems: 'center',
    justifyContent: 'center',
  },
});