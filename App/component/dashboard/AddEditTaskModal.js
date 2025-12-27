import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import CustomPicker from '../customPicker';

export default function AddEditTaskModal({
  customer,
  setCustomer,
  options,
  toEdit,
  saveTask,
  open,
  setOpen,
  date,
  setDate,
  showSuggestion,
  setShowSuggestion,
  filtered,
  selectedSuggestion,
}) {
  return (
    <View style={styles.blurView}>
      <View>
        <View style={styles.addTaskContainer}>
          {/* Name */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#4A4E69"
            value={customer.name}
            onFocus={() => setShowSuggestion(false)}
            onChangeText={(text) =>
              setCustomer({ ...customer, name: text })
            }
          />

          {/* Mobile + Date */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput
              style={[styles.input, { width: 222, height: 43 }]}
              keyboardType="numeric"
              placeholder="Mobile No."
              placeholderTextColor="#4A4E69"
              value={customer.mobile}
              onChangeText={(text) => {
                setCustomer({ ...customer, mobile: text });
                setShowSuggestion(true);
              }}
            />

            <TouchableOpacity
              onPress={() => {
                setOpen(true);
                setShowSuggestion(false);
              }}
              style={[
                styles.input,
                {
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 47,
                },
              ]}
            >
              <Image
                source={require('../../assets/vectors/calender.png')}
                style={{ width: 25, height: 25, resizeMode: 'contain' }}
              />

              <DatePicker
                modal
                open={open}
                date={date}
                mode="date"
                onConfirm={(selectedDate) => {
                  setOpen(false);
                  setDate(selectedDate);
                  setCustomer({
                    ...customer,
                    date: moment(selectedDate).format('YYYY-MM-DD'),
                  });
                }}
                onCancel={() => setOpen(false)}
              />
            </TouchableOpacity>
          </View>

          {/* Service Type */}
          <CustomPicker
            data={options}
            serviceType={customer.serviceType || 'Service type'}
            sendService={(itemValue) =>
              setCustomer({ ...customer, serviceType: itemValue })
            }
            toCloseSuggestion={() => setShowSuggestion(false)}
          />

          {/* City */}
          <TextInput
            style={[styles.input, { marginTop: 19 }]}
            placeholder="City"
            placeholderTextColor="#4A4E69"
            value={customer.city}
            onFocus={() => setShowSuggestion(false)}
            onChangeText={(text) =>
              setCustomer({ ...customer, city: text })
            }
          />

          {/* Address */}
          <TextInput
            style={[styles.input, { height: 105, textAlignVertical: 'top' }]}
            placeholder="Address"
            placeholderTextColor="#4A4E69"
            multiline
            numberOfLines={4}
            value={customer.address}
            onFocus={() => setShowSuggestion(false)}
            onChangeText={(text) =>
              setCustomer({ ...customer, address: text })
            }
          />

          {/* Submit */}
          <TouchableOpacity style={styles.addEditTaskButton} onPress={saveTask}>
            <LinearGradient
              colors={['#22223B', '#5D5DA1']}
              style={styles.addEditTaskButton}
            >
              <Text style={styles.addEditTaskText}>
                {toEdit ? 'Edit Task' : 'Add Task'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Suggestions */}
        {showSuggestion && customer.mobile?.toString().length > 0 && (
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
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  blurView: {
    borderRadius: 5,
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  addTaskContainer: {
    width: 317,
    height: 500,
    marginTop: 63,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#EBEEFF',
    borderRadius: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#22223B',
    color: '#4A4E69',
    fontFamily: 'Poppins',
    paddingHorizontal: 16,
    fontWeight: '400',
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 19,
  },
  addEditTaskButton: {
    width: 126,
    height: 43,
    borderRadius: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  addEditTaskText: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 16,
    color: '#FFFFFF',
    width: '100%',
    textAlign: 'center',
  },
  suggestionBg: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 207,
    left: 30,
    opacity: 0.8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
