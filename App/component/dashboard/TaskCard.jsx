import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import ImageSlider from "../imageSlider";

export default function TaskCard({
  item,
  index,
  animation,
  onEdit,
  onClose,
  onAddToProfile,
}) {
  if (!item || item.id === "overallTasks" || item.id === "completedTasks") {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.cardView,
        {
          transform: [
            {
              translateY: animation || new Animated.Value(0),
            },
          ],
        },
      ]}
    >
      <ImageSlider serviceType={item.serviceType} />

      <View style={styles.listView}>
        <ScrollView
          style={{ height: "100%" }}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.date}>
            {moment(item.date).format("DD-ddd").toUpperCase()}
          </Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.mobile}>{item.mobile}</Text>
          <Text style={styles.serviceType}>{item.serviceType}</Text>
          <Text style={styles.city}>{item.city}</Text>
          <Text style={styles.address}>{item.address}</Text>
          <View style={{ height: 61 }} />
        </ScrollView>

        <TouchableOpacity style={styles.taskEdit} onPress={() => onEdit(item.id)}>
          <Image
            source={require("../../assets/vectors/taskEdit.png")}
            style={{ height: 35, width: 35, resizeMode: "contain" }}
          />
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={["#F8FAFFCF", "#F9FBFF"]}
        style={styles.cardButtonView}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => onClose(index, item.id)}
        >
          <Text style={styles.buttonText1}>Close</Text>
        </TouchableOpacity>

        {!item.isAddedToProfile ? (
          <TouchableOpacity
            style={styles.addToTaskButton}
            onPress={() => onAddToProfile(item.id)}
          >
            <Text style={styles.buttonText1}>Add to profile</Text>
          </TouchableOpacity>
        ) : (
          <LinearGradient
            colors={["#5D5DA1", "#22223B"]}
            style={[styles.addToTaskButton, { flexDirection: "row" }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Image
              source={require("../../assets/vectors/tickWhite.png")}
              style={{ width: 20, height: 20, resizeMode: "contain" }}
            />
            <Text style={styles.buttonText2}>Added</Text>
          </LinearGradient>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardView: {
    width: 249,
    height: 438,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  listView: {
    paddingHorizontal: 10,
    paddingTop: 10,
    flex: 1,
  },
  date: {
    fontFamily: "Quantico-Bold",
    fontSize: 20,
    color: "#9A8C98",
  },
  name: {
    fontFamily: "Poppins",
    fontSize: 20,
    color: "#22223B",
    marginTop: 15,
  },
  mobile: {
    fontFamily: "Quantico",
    fontSize: 16,
    color: "#22223B",
    marginTop: 15,
  },
  serviceType: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: "#22223B",
    marginTop: 15,
  },
  city: {
    fontFamily: "Poppins",
    fontSize: 16,
    color: "#22223B",
    marginTop: 15,
  },
  address: {
    fontFamily: "Poppins",
    fontSize: 15,
    color: "#22223B",
    marginTop: 15,
  },
  cardButtonView: {
    width: "100%",
    height: 61,
    position: "absolute",
    padding: 10,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  closeButton: {
    width: 79,
    backgroundColor: "#F9FBFF",
    borderRadius: 30,
    justifyContent: "center",
    borderWidth: 0.5,
  },
  addToTaskButton: {
    width: 129,
    backgroundColor: "#F9FBFF",
    borderRadius: 30,
    justifyContent: "center",
    borderWidth: 0.5,
  },
  buttonText1: {
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: 16,
    color: "#22223B",
  },
  buttonText2: {
    fontFamily: "Poppins",
    marginLeft: 10,
    fontSize: 16,
    color: "#FFFFFF",
  },
  taskEdit: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
