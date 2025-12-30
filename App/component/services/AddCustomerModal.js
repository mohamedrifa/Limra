import React from "react";
import { View } from "react-native";
import AddProfile from "../../screens/AddService";

export default function AddCustomerModal({
  visible,
  navigateBack,
  customerId,
}) {
  if (!visible) return null;

  return (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <AddProfile
        navigateToServiceAdd={navigateBack}
        customerId={customerId}
      />
    </View>
  );
}
