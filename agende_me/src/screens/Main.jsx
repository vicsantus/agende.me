import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Input from '../components/atoms/Input';
import Header from '../components/organisms/Header';
import DismissKeyboard from '../components/templates/DismissKeyboard';
import {useGeneralContext} from '../context/UserContext';
import {getDataInsInStorage} from '../utils/localStorage';

export default function Main() {
  const navigation = useNavigation();
  const {setLoading, setIslogged, user, islogged, isloading} =
    useGeneralContext();
  const [input, setInput] = useState('');

  useEffect(() => {
    setLoading(true);
    if (!user) {
      getDataInsInStorage('user')
        .then(e => {
          if (e?.user?.role) {
            const role = e?.user?.role;
            setUser(e);
            if (role === 'admin') {
              navigation.navigate('Agenda');
            } else {
              navigation.navigate('Main');
            }
          }
          setLoading(false);
        })
        .catch(e => {
          setLoading(false);
        })
        .finally(() => setLoading(false));
    } else {
      if (user.user.role === 'admin') {
        navigation.navigate('Agenda');
      } else {
        navigation.navigate('Main');
      }
    }
    setLoading(false);
  }, []);

  return (
    <>
      {/* {isloading && <Loading style={styles.loading} />} */}
      <Header />
      {!isloading && (
        <DismissKeyboard>
          <SafeAreaView style={styles.container}>
            <View style={styles.main}>
              <Input
                editable={true}
                value={input}
                placeholder="Seu nome"
                onChange={v => setInput(v)}
                label="Nome"
                // error={errorNome}
                // errorMessage={errorMessageNome}
                returnKeyType="next"
                blurOnSubmit={false}
                style={/* isKeyboardVisible &&  */ {paddingVertical: 4}}
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
    justifyContent: 'flex-start',
    flex: 1,
  },
  text: {
    fontSize: 40,
    color: 'black',
    fontWeight: 'bold',
  },
});
