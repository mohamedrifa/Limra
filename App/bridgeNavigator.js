import React, { useEffect, useState, useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import auth from "@react-native-firebase/auth";
import Immersive from "react-native-immersive";
import { Modal, View, StyleSheet, TouchableOpacity, Text, Linking } from "react-native";
import { ref, onValue } from "firebase/database";
import LoginPages from "./loginPages";
import ApplicationMain from "./applicationMain";
import { database } from "../firebase";

const CURRENT_VERSION = "2.0";

const Stack = createStackNavigator();

/* ---------------- APP CONTENT ---------------- */

const AppContent = () => {
  const [initialRoute, setInitialRoute] = useState("LoginPages");
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    Immersive.on();
    return () => Immersive.off();
  }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setInitialRoute(user ? "ApplicationMain" : "LoginPages");
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="LoginPages"
          component={LoginPages}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ApplicationMain"
          component={ApplicationMain}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

/* ---------------- ROOT ---------------- */

export default function BridgeNavigator() {
  const [appData, setAppData] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);

  /* ---------- Fetch App Config ---------- */
  useEffect(() => {
    const r = ref(database, "App");
    const unsub = onValue(r, snapshot => {
      setAppData(snapshot.val());
    });

    return () => unsub();
  }, []);

  /* ---------- Version Check ---------- */
  useEffect(() => {
    if (!appData?.version) return;

    const latest = parseFloat(appData.version);
    const current = parseFloat(CURRENT_VERSION);

    if (latest > current) setShowUpdate(true);
  }, [appData]);

  return (
      <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
        <AppContent />

        {/* 🔔 LIGHT THEME UPDATE MODAL */}
        <Modal visible={showUpdate} transparent animationType="fade">
          <View style={styles.backdrop}>
            <View style={styles.card}>
              <Text style={styles.title}>Update Available</Text>

              <Text style={styles.text}>
                A new version of the app is available. Please update to continue.
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.laterBtn}
                  onPress={() => setShowUpdate(false)}
                >
                  <Text style={styles.laterText}>Later</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => Linking.openURL(appData?.url)}
                >
                  <Text style={styles.downloadText}>Download</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  laterBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  laterText: {
    color: "#111827",
    fontWeight: "700",
  },
  downloadBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  downloadText: {
    color: "#ffffff",
    fontWeight: "800",
  },
});
