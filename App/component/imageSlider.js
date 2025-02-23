import React, { useRef, useEffect, useState } from "react";
import { View, ScrollView, Image } from "react-native";

const SCREEN_WIDTH = 249;

const ImageSlider = ({ serviceType }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(2);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const serviceImages = [];
    if (serviceType.includes("A.C")) {
      serviceImages.push(require("../assets/images/Machines/AC.jpg"));
    }
    if (serviceType.includes("Washing Machine")) {
      serviceImages.push(require("../assets/images/Machines/Washing_Machine.jpg"));
    }
    if (serviceType.includes("Refrigerator")) {
      serviceImages.push(require("../assets/images/Machines/Refrigerator.jpg"));
    }
    if (serviceType.includes("Microwave Oven")) {
      serviceImages.push(require("../assets/images/Machines/Microwave.jpg"));
    }
    if (serviceType.includes("RO Water Purifier")) {
      serviceImages.push(require("../assets/images/Machines/RO_Purifier.jpg"));
    }
    if (serviceType.includes("Water Heater")) {
      serviceImages.push(require("../assets/images/Machines/Heater.jpg"));
    }
    if (serviceType.includes("Induction Stove")) {
      serviceImages.push(require("../assets/images/Machines/Induction.jpg"));
    }
    if (serviceType.includes("Inverter/Battery")) {
      serviceImages.push(require("../assets/images/Machines/Inverter.jpg"));
    }
    if (serviceType.includes("Other")) {
      serviceImages.push(require("../assets/images/Machines/Others.jpg"));
    }
    setImages(serviceImages);
    setCurrentIndex(0); // Reset index when images change
  }, [serviceType]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < images.length) {
        scrollViewRef.current?.scrollTo({
          x: nextIndex * SCREEN_WIDTH,
          animated: true
        });
        setCurrentIndex(nextIndex);
      } else {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ x: 0, animated: false });
        }, 300); // Reset to first image without animation
        setCurrentIndex(0);
      }
    }, 3000); // Auto-scroll every 3 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentIndex]);

  return (
    <View style={{ borderTopStartRadius: 25, borderTopEndRadius: 25, overflow: "hidden", height: 143 }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        nestedScrollEnabled={false}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        {images.map((img, index) => (
          <Image key={index} source={img} style={{ width: SCREEN_WIDTH, height: 143 }} />
        ))}
      </ScrollView>
    </View>
  );
};

export default ImageSlider;
