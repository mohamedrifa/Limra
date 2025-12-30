import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import moment from 'moment';

export default function CustomerTimelineItem({
  item,
  index,
  customers,
  styles,
  onPress,
}) {
  const currentMonth = moment(item.date).format('MMMM YYYY');
  const prevItem = customers[index - 1];

  const showMonthHeader =
    index === 0 ||
    moment(prevItem?.date).format('MMMM YYYY') !== currentMonth;

  const nextItem = customers[index + 1];
  const isLastMonth =
    !nextItem ||
    moment(nextItem.date).format('MMMM YYYY') !== currentMonth;

  return (
    <View style={styles.card}>
      {showMonthHeader && (
        <View
          style={{
            width: '100%',
            height: 64,
            alignItems: 'center',
            flexDirection: 'row',
            paddingLeft: 16,
          }}
        >
          <Text style={[styles.monthHeader, { fontFamily: 'Poppins' }]}>
            {moment(item.date).format('MMMM')}{' '}
          </Text>
          <Text style={[styles.monthHeader, { fontFamily: 'Quantico' }]}>
            {moment(item.date).format('YYYY')}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.listView}
        onPress={() => onPress(item.id)}
      >
        <View
          style={{
            width: 78,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text style={[styles.listDate, { fontFamily: 'Quantico' }]}>
              {moment(item.date).format('DD ')}
            </Text>
            <Text style={[styles.listDate, { fontFamily: 'Poppins' }]}>
              {moment(item.date).format('MMM')}
            </Text>
          </View>
          <Image
            source={require('../assets/vectors/pin.png')}
            style={{ width: 13, height: 13, marginTop: 5 }}
          />
        </View>

        <View
          style={[
            styles.lineView,
            index === 0 && { flexDirection: 'column-reverse' },
          ]}
        >
          <View
            style={[
              customers.length !== 1 && styles.line,
              index === 0 && { flex: 0.5 },
              index === customers.length - 1 && { flex: 0.5 },
            ]}
          />
          <View
            style={[
              styles.ovalMark2,
              showMonthHeader && styles.ovalMark1,
              isLastMonth && styles.ovalMark1,
            ]}
          />
        </View>

        <Text style={styles.serviceTypes}>
          {item.serviceType.replace(/, /g, ', \n')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
