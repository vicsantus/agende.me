import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useGeneralContext} from '../context/UserContext';
import {getTokensInStorage} from '../utils/localStorage';

export default function Agenda() {
  const {setLoading, setIslogged} = useGeneralContext();

  async function getSessionInLocalStorage() {
    return await getTokensInStorage();
  }
  useEffect(() => {
    console.log('Agenda!');

    setLoading(true);
    getSessionInLocalStorage()
      .then(e => {
        if (!e) {
          setIslogged(false);
        }
        setLoading(false);
      })
      .catch(e => {
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.text}>Agenda</Text>
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
    justifyContent: 'flex-start',
    marginTop: 20,
    flex: 1,
  },
  text: {
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold',
  },
});
