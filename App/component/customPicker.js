import React, { useState } from "react";
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";

const CustomPicker = ({ data, serviceType, sendService }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedServices, setSelectedServices] = useState("");

  const addServices = (service) => {
    setSelectedServices(serviceType);
    setSelectedServices((prevServices) => {
      let updatedServicesArray = prevServices ? prevServices.split(", ") : [];
      if (updatedServicesArray.includes(service)) {
        updatedServicesArray = updatedServicesArray.filter((item) => item !== service);
      } else {
        updatedServicesArray.push(service);
      }
      const updatedServicesString = updatedServicesArray.length > 0 ? updatedServicesArray.join(", ") : "";
      sendService(updatedServicesString);
      return updatedServicesString;
    });
  };
  return (
    <View>
      <TouchableOpacity 
        style={styles.pickerContainer} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectedText}>
          {selectedServices || serviceType}
        </Text>
        <Image source={require('../assets/vectors/pickerIcon.png')} style={{width: 24, height: 24}}/>
      </TouchableOpacity>
      <Modal 
        transparent={true} 
        animationType="fade" 
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={data}
              keyExtractor={(item) => item}
              ListFooterComponent={(
                <TouchableOpacity 
                  style={[styles.option, {borderTopWidth: 0.25,borderBottomWidth: 0.25, borderTopColor: '#1C1E1E80', borderBottomColor: '#1C1E1E80'}]} 
                  onPress={() => addServices("Other")}
                >
                  <View style={styles.checkBox}>
                    {serviceType.includes("Other") && (
                      <Image source={require('../assets/vectors/checkBoxTick.png')} style={{ width: 14, height: 14 }}/>
                    )}
                  </View>
                  <Text style={styles.optionText}>Other</Text>
                </TouchableOpacity>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.option} 
                  onPress={() => addServices(item)}
                >
                  <View style={styles.checkBox}>
                    {serviceType.includes(item) && (
                      <Image source={require('../assets/vectors/checkBoxTick.png')} style={{ width: 14, height: 14 }}/>
                    )}
                  </View>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={{height: 39, justifyContent: 'center'}}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setModalVisible(false)}
              >
                <Image source={require('../assets/vectors/submitArrow.png')} style={{width: 24, height: 24}}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    paddingHorizontal: 16,
    borderColor: "#22223B",
    borderRadius: 8,
    backgroundColor: "#EBEEFF",
    width: "100%",
    height: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  selectedText: {
    fontSize: 14,
    fontWeight: 400,
    color: "#4A4E69",
    fontFamily: 'Poppins',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    width: 299,
    height: 444,
    borderRadius: 15,
  },
  closeButton: {
    alignSelf: "center",
    width: 208,
    height: 27,
    backgroundColor: "#C9ADA7",
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  option: {
    padding: 12,
    height: 45,
    alignItems: 'center',
    flexDirection: 'row'
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    marginLeft: 12,
    color: "#111C3D",
    fontWeight: "300",
  },
  checkBox: {
    width: 14,
    height: 14,
    borderRadius: 2,
    borderColor: 'black',
    borderWidth: 1,
  }
});

export default CustomPicker;