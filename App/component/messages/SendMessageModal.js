import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  StyleSheet
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function SendMessageModal({
  visible,
  toWhatsapp,
  toggleSwitch,
  message,
  setMessage,
  selectedNumbers,
  onCancel,
  onSend,
}) {
  if (!visible) return null;

  return (
    <View style={styles.blurView}>
      <View style={styles.sendTaskContainer}>
        <View style={{ width: '100%', flexDirection: 'row-reverse' }}>
          <LinearGradient
            colors={
              toWhatsapp
                ? ['#2D3436', '#D3D3D3']
                : ['#D3D3D3', '#2D3436']
            }
            style={[styles.switchContainer, toWhatsapp && styles.switchActive]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Switch
              trackColor={{ false: 'transparent', true: 'transparent' }}
              thumbColor={toWhatsapp ? '#ffffff' : '#f4f3f4'}
              thumbBorderColor="#22223B"
              thumbBorderWidth={1}
              onValueChange={toggleSwitch}
              value={toWhatsapp}
              style={styles.switch}
            />
          </LinearGradient>
          <Image
            source={
              toWhatsapp
                ? require('../../assets/vectors/whatsappBlack.png')
                : require('../../assets/vectors/sms.png')
            }
            style={styles.messageImage}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter Message Here"
          placeholderTextColor="#4A4E69"
          multiline
          scrollEnabled
          value={message}
          onChangeText={setMessage}
        />
        <Text
          style={{
            fontFamily: 'Poppins',
            fontWeight: 400,
            fontSize: 16,
            color: '#9A8C98',
            textDecorationLine: 'underline',
          }}
        >
          {selectedNumbers.length} profile selected
        </Text>
        <View
          style={{
            width: 272,
            height: 43,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 17,
          }}
        >
          <TouchableOpacity
            style={[styles.sendConfirmButton, { borderWidth: 1 }]}
            onPress={onCancel}
          >
            <Text style={[styles.sendConfirmText, { color: '#22223B' }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendConfirmButton} onPress={onSend}>
            <LinearGradient
              colors={['#22223B', '#5D5DA1']}
              style={[styles.sendConfirmButton, { width: '100%' }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.sendConfirmText, { color: '#FFFFFF' }]}>
                Send
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  sendTaskContainer: {
    width: '100%',
    height: 422,
    position: 'absolute',
    padding: 16,
    backgroundColor: '#EBEEFF',
    borderRadius: 5,
  },
  sendConfirmButton: {
    width: 100,
    height: 43,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBEEFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  switchContainer: {
    width: 55,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#22223B',
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  switchActive: {
    backgroundColor: '#bbb',
  },
  switch: {
    transform: [{ scale: 1.2 }], 
  },
  messageImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 10,
  },
  sendConfirmText: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: 400,
  },
    input: {
    width: '100%',
    height: 247,
    borderColor: '#22223B',
    color: '#4A4E69',
    fontFamily: 'Poppins',
    paddingHorizontal: 16,
    fontWeight: 400,
    textAlignVertical: 'top',
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 5,
  },
});