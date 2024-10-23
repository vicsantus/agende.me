import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import BtnPrimary from '../components/atoms/BtnPrimary';

export default function Choose() {
  const navigation = useNavigation();
  // useEffect(() => {
  //   console.log('chegou aqui');
  // }, []);

  return (
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
