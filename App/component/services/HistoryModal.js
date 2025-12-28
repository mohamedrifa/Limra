import React from "react";
import { View } from "react-native";
import CustomerHistory from "../../screens/customerHistory";

export default function HistoryModal({
  visible,
  navigateBack,
  mobile,
}) {
  if (!visible) return null;

  return (
    <View style={{position: 'absolute', width: '100%', height: '100%'}}>
      <CustomerHistory mobile={mobile} navigateToServiceAdd={() => navigateBack()}/>;
    </View>
  );
}
