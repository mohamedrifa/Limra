import React, { useRef, useEffect, useState } from "react";
import { View, ScrollView, Image } from "react-native";

const SCREEN_WIDTH = 249;

const ImageSlider = ({ serviceType }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [images, setImages] = useState([]);

  useEffect(() => {
    let serviceImages = [];
    if (serviceType.includes("A.C")) {
      serviceImages.push(require("../../assets/images/Machines/AC.jpg"));
    }
    if (serviceType.includes("Washing Machine")) {
      serviceImages.push(require("../../assets/images/Machines/Washing_Machine.jpg"));
    }
    if (serviceType.includes("Refrigerator")) {
      serviceImages.push(require("../../assets/images/Machines/Refrigerator.jpg"));
    }
    if (serviceType.includes("Microwave Oven")) {
      serviceImages.push(require("../../assets/images/Machines/Microwave.jpg"));
    }
    if (serviceType.includes("RO Water Purifier")) {
      serviceImages.push(require("../../assets/images/Machines/RO_Purifier.jpg"));
    }
    if (serviceType.includes("Water Heater")) {
      serviceImages.push(require("../../assets/images/Machines/Heater.jpg"));
    }
    if (serviceType.includes("Induction Stove")) {
      serviceImages.push(require("../../assets/images/Machines/Induction.jpg"));
    }
    if (serviceType.includes("Inverter/Battery")) {
      serviceImages.push(require("../../assets/images/Machines/Inverter.jpg"));
    }
    if (serviceType.includes("Other")) {
      serviceImages.push(require("../../assets/images/Machines/Others.jpg"));
    }
    const duplicatedImages = [
      serviceImages[0],
      ...serviceImages,
      serviceImages[0],
    ];

    setImages(duplicatedImages);
    setCurrentIndex(1);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: false });
    }, 100);
  }, [serviceType]);

  useEffect(() => {
    if(serviceType.includes(",")){
      const interval = setInterval(() => {
        const nextIndex = currentIndex + 1;
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            x: nextIndex * SCREEN_WIDTH,
            animated: true,
          });
        }
        setCurrentIndex(nextIndex);
        if (nextIndex === images.length - 1) {
          setTimeout(() => {
            scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: false });
            setCurrentIndex(1); 
          }, 500); 
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, images, serviceType]);

  return (
    <View style={{ borderTopStartRadius: 25, borderTopEndRadius: 25, overflow: "hidden", height: 143 }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
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
