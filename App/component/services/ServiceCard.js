import React, { memo, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { Dimensions } from 'react-native';
import DeleteIcon from "../../assets/vectors/delete_icon.png";

const { width } = Dimensions.get('window');

function ServiceCard ({
  item,
  selectedDate,
  searchActive,
  searchQuery,
  highlightText,
  editCustomer,
  customerHistory,
  openDialPad,
  openWhatsApp,
  addToTask,
  isOpen,
  onOpen,
  onClose,
  onDelete
}) {
  if (item.date !== selectedDate && !searchActive) return null;

  const scrollRef = useRef(null);

  const handleScrollEnd = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    if (x > 30) {
      scrollRef.current?.scrollTo({ x: 50, animated: true });
      onOpen();
    } else {
      scrollRef.current?.scrollTo({ x: 0, animated: true });
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollTo({ x: 50, animated: true });
    } else {
      scrollRef.current?.scrollTo({ x: 0, animated: true });
    }
  }, [isOpen]);

  const ContentCard = () => {
    return(
      <View style={styles.card}>
        <View style={styles.listLine} />
        <View style={styles.listView}>
          <View style={styles.listDatas}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.name}>{highlightText(item.name, searchQuery)}</Text>
              <Text style={styles.city}>{highlightText(item.city, searchQuery)}</Text>
              <Text style={styles.address}>{highlightText(item.address, searchQuery)}</Text>
              <Text style={styles.machine}>
                {highlightText(item.serviceType, searchQuery)}
              </Text>
              <Text style={styles.mobile}>
                {highlightText(item.mobile, searchQuery)}
              </Text>
            </ScrollView>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => editCustomer(item.id)}
            >
              <Image
                source={require("../../assets/vectors/profileEdit.png")}
                style={styles.iconSmall}
              />
            </TouchableOpacity>
            <View style={styles.listIcons}>
              <TouchableOpacity onPress={() => customerHistory(item.mobile)}>
                <Image
                  source={require("../../assets/vectors/history.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openDialPad(item.mobile)}>
                <Image
                  source={require("../../assets/vectors/call.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openWhatsApp(item.mobile)}>
                <Image
                  source={require("../../assets/vectors/whatsapp.png")}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.addToTask}
              onPress={() => addToTask(item.id)}
            >
              <Text style={styles.addToTaskText}>Add To Task</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.listLine} />
      </View>
    );
  }

  const DeleteComponent = () => {
    return(
      <TouchableOpacity onPress={() => onDelete(item.id)} style={{backgroundColor: "#E02F2F", width: 50, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={DeleteIcon}
          style={{width: 20, height: 20}}
        />
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      onScrollEndDrag={handleScrollEnd}
    >
      <ContentCard/>
      <DeleteComponent/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width,
    height: 215,
    backgroundColor: "#EBEEFF",
    justifyContent: "space-between",
  },
  listLine: {
    width: "100%",
    height: 0.5,
    backgroundColor: "#22223B",
  },
  listView: {
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listDatas: {
    width: 214,
    height: 195,
  },
  name: {
    fontSize: 20,
    color: "#22223B",
    fontFamily: "Poppins",
    marginBottom: 10,
  },
  city: {
    fontSize: 14,
    color: "#22223B",
    fontFamily: "Poppins",
    marginBottom: 10,
  },
  address: {
    fontSize: 14,
    color: "#22223B",
    fontFamily: "Poppins",
    marginBottom: 10,
  },
  machine: {
    fontSize: 14,
    color: "#22223B",
    fontFamily: "Poppins",
    marginBottom: 10,
  },
  mobile: {
    fontSize: 14,
    color: "#22223B",
    fontFamily: "Quantico",
  },
  rightSection: {
    width: 101,
    height: 195,
    justifyContent: "space-between",
  },
  listIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    width: 27,
    height: 27,
  },
  iconSmall: {
    width: 24,
    height: 24,
  },
  addToTask: {
    width: 101,
    height: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#22223B",
    alignItems: "center",
    justifyContent: "center",
  },
  addToTaskText: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: "#22223B",
  },
});

export default memo(ServiceCard);