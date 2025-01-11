import React from 'react';
import { View, StyleSheet } from 'react-native';
import Start from './screens/start';
import Login from './screens/logIn';

const LoginPages = ({ navigation }) => {
  const [showSecondPage, setShowSecondPage] = React.useState(false);

  return (
    <View style={styles.container}>
      {showSecondPage ? (
        <Login 
          navigation={navigation} 
          onGoBack={() => setShowSecondPage(false)} 
        />
      ) : (
        <Start onNext={() => setShowSecondPage(true)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LoginPages;
