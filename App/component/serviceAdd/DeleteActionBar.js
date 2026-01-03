import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import DeleteIcon from "../../assets/vectors/delete_icon.png";

const { width } = Dimensions.get('window');

export default function DeleteActionBar({ visible, onDelete }) {
  const [isDeleted, setIsDeleted] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-40)).current;
  const scrollRef = useRef(null);

  React.useEffect(() => {
    if (visible) {
      setIsDeleted(false);
      fadeAnim.setValue(0);
      slideAnim.setValue(-40);
    }
  }, [visible]);


  if (!visible) return null;

  const showDeleteConfirmed = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const deleteItem = () => {
    setIsDeleted(true);
    showDeleteConfirmed();
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        x: width,
        animated: true,
      });
    }, 50);
    setTimeout(() => {
      onDelete();
    }, 300);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        ref={scrollRef}
        keyboardShouldPersistTaps="always"
        showsHorizontalScrollIndicator={false}
        style={styles.scrollBox}
      >
        <View style={styles.innerBox}>
          <Text style={styles.text}>Swipe To Delete Row</Text>
          <Text style={[styles.text, { color: '#FFFFFF' }]}>{'    <<'}</Text>
        </View>

        {!isDeleted && (
          <TouchableOpacity
            style={styles.deleteBg}
            activeOpacity={0.8}
            onPress={deleteItem}
          >
            <Image source={DeleteIcon} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        )}

        {isDeleted && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.innerBox,
              {
                backgroundColor: '#E02F2F',
                position: 'absolute',
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.text, { color: '#fff', marginRight: 16 }]}>
              Deleted
            </Text>
            <Image source={DeleteIcon} style={{ width: 20, height: 20 }} />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#141218',
    paddingHorizontal: 8,
    paddingTop: 9,
    paddingBottom: 54
  },
  scrollBox: {
    height: '100%',
    borderRadius: 4,
    flexDirection: 'row',
    width: width-16,
  },
  innerBox: {
    height: '100%',
    width: width,
    backgroundColor: '#1D1B20',
    paddingVertical: 7.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#E02F2F',
    fontSize: 14,
  },
  deletePage: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    backgroundColor: '#E02F2F',
  },
  deleteBg: {
    width: 72,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E02F2F',
  },
  deleteIcon: {
    fontSize: 16,
    color: '#fff',
  },
});
