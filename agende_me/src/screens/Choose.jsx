import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import BtnPrimary from '../components/atoms/BtnPrimary';
import DismissKeyboard from '../components/templates/DismissKeyboard';
import {useGeneralContext} from '../context/UserContext';
import {getTokensInStorage} from '../utils/localStorage';

export default function Choose() {
  const navigation = useNavigation();
  const {setLoading, setIslogged, isloading} = useGeneralContext();

  async function getSessionInLocalStorage() {
    return await getTokensInStorage();
  }

  useEffect(() => {
    setLoading(true);
    getSessionInLocalStorage()
      .then(e => {
        // console.log(e, 'User in localstorage');
        if (e?.accessToken && e?.refreshToken) {
          setIslogged(true);
        }
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* {isloading && <Loading style={styles.loading} />} */}
      {!isloading && (
        <DismissKeyboard>
          <SafeAreaView style={styles.container}>
            <View style={styles.main}>
              <Image
                source={require('../../assets/icon-ripped.png')} // Caminho da imagem local
                style={styles.image}
              />
              <Text style={styles.title}>{'Agende.Me'}</Text>
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
      )}
    </>
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
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    marginBottom: 30,
    marginTop: -150,
  },
  title: {
    width: 'auto',
    color: '#1acc4c',
    fontWeight: '700',
    fontSize: 40,
    marginBottom: 60,
    textShadowColor: '#a6a6a6',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 6,
  },
  botao: {
    margin: 10,
  },
});
