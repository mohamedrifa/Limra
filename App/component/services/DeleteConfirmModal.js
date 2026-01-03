import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export default function DeleteConfirmModal({
  visible,
  onCancel,
  onConfirm,
}) {
  if (!visible) return null;

  return (
    <Pressable style={styles.blurView} onPress={onCancel}>
      <Pressable style={styles.closeTaskContainer} onPress={() => {}}>
        <LinearGradient
          colors={["#22223B", "#5D5DA1"]}
          style={{
            width: "100%",
            borderTopRightRadius: 5,
            borderTopLeftRadius: 5,
            height: 43,
            alignItems: "center",
            justifyContent: "center",
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.addTaskButtonText}>Are you sure?</Text>
        </LinearGradient>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <TouchableOpacity
            style={[styles.delConfirmButton, { borderWidth: 1 }]}
            onPress={onCancel}
          >
            <Text style={[styles.delConfirmText, { color: "#22223B" }]}>
              No
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.delConfirmButton, { borderWidth: 1, borderColor: '#E02F2F' }]}
            onPress={onConfirm}
          >
            <Text style={[styles.delConfirmText, { color: '#E02F2F' }]}>
              Yes
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Pressable>
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
  addTaskButtonText: {
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: 16,
    color: '#FFFFFF',
  },
  closeTaskContainer: {
    width: 231,
    height: 103,
    backgroundColor: '#EBEEFF',
    position: 'absolute',
    bottom: 200,
    borderRadius: 5,
  },
  delConfirmButton: {
    width: 70,
    height: 35,
    backgroundColor: '#EBEEFF',
    borderRadius: 30,
    borderColor: '#22223B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  delConfirmText: {
    fontFamily: 'Questrial',
    fontWeight: 400,
    color: '#22223B',
    fontSize: 16,
  },
});