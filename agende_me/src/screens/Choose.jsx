import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import BtnPrimary from '../components/atoms/BtnPrimary';
import DismissKeyboard from '../components/templates/DismissKeyboard';
import {useGeneralContext} from '../context/UserContext';

export default function Choose() {
  const navigation = useNavigation();
  // const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const {setLoading} = useGeneralContext();
  // const {isCreatingUser, setIsCreatingUser, haveError} = useAppContext();

  useEffect(() => {
    setLoading(true);
    // const keyboardDidShowListener = Keyboard.addListener(
    //   'keyboardDidShow',
    //   () => {
    //     setIsKeyboardVisible(true);
    //   },
    // );

    // const keyboardDidHideListener = Keyboard.addListener(
    //   'keyboardDidHide',
    //   () => {
    //     setIsKeyboardVisible(false);
    //   },
    // );
    setTimeout(() => {
      setLoading(false);
    }, 4000);

    // return () => {
    //   keyboardDidShowListener.remove();
    //   keyboardDidHideListener.remove();
    // };
  }, []);

  return (
    <DismissKeyboard>
      <SafeAreaView style={styles.container}>
        <View style={styles.main}>
          <BtnPrimary
            style={styles.botao}
            onPress={() => {
              console.log('apertou client');
              navigation.navigate('Login', {login: true});
            }}
            text="Login"
          />
          <BtnPrimary
            style={styles.botao}
            onPress={() => {
              console.log('apertou prestador');
              navigation.navigate('Registrar');
            }}
            text="Registrar"
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
