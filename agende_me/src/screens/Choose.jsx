import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Keyboard, SafeAreaView, StyleSheet, View} from 'react-native';
import BtnPrimary from '../components/atoms/BtnPrimary';
import DismissKeyboard from '../components/templates/DismissKeyboard';

export default function Choose() {
  const navigation = useNavigation();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  // const {isCreatingUser, setIsCreatingUser, haveError} = useAppContext();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <DismissKeyboard>
      <SafeAreaView style={styles.container}>
        <View style={styles.main}>
          <BtnPrimary
            style={styles.botao}
            onPress={() => {
              console.log('apertou client');
              navigation.navigate('Login');
            }}
            text="Cliente"
          />
          <BtnPrimary
            style={styles.botao}
            onPress={() => {
              console.log('apertou prestador');
            }}
            text="Prestador"
          />
        </View>
      </SafeAreaView>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  botao: {
    margin: 10,
  },
});
