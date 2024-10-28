import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import BtnPrimary from '../components/atoms/BtnPrimary';
import DismissKeyboard from '../components/templates/DismissKeyboard';
import {useGeneralContext} from '../context/UserContext';
import {getTokensInStorage} from '../utils/localStorage';

export default function Choose() {
  const navigation = useNavigation();
  const {setLoading, setIslogged} = useGeneralContext();

  async function getSessionInLocalStorage() {
    return await getTokensInStorage();
  }

  useEffect(() => {
    setLoading(true);
    getSessionInLocalStorage()
      .then(e => {
        console.log(e);
        if (e?.accessToken && e?.refreshToken) {
          setIslogged(true);
        }
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      });
  }, []);

  return (
    <DismissKeyboard>
      <SafeAreaView style={styles.container}>
        <View style={styles.main}>
          <BtnPrimary
            style={styles.botao}
            onPress={() => {
              navigation.navigate('Login', {login: true});
            }}
            text="Login"
          />
          <BtnPrimary
            style={styles.botao}
            onPress={() => {
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
