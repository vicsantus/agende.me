import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Loading from '../components/atoms/Loading';
import {useGeneralContext} from '../context/UserContext';
import Agenda from '../screens/Agenda';
import Choose from '../screens/Choose';
import Login from '../screens/Login';

// import { getDataInsInStorage, getTokensInStorage } from "../utils/localStorage";

export default function Routes() {
  const {isloading, setLoading, islogged, setIslogged} = useGeneralContext();
  const Stack = createNativeStackNavigator();

  async function getSessionInLocalStorage() {
    return await getTokensInStorage();
  }

  useEffect(() => {
    setLoading(true);
    getSessionInLocalStorage()
      .then(e => {
        if (!e) {
          // navigation.navigate('Agenda');
          setIslogged(false);
        } else {
          setIslogged(true);
        }
        // setLoading(false);
      })
      .catch(e => {
        // setLoading(false);
      });
  }, []);

  return (
    <>
      {isloading && <Loading style={styles.loading} />}
      {!islogged ? (
        <NavigationContainer initialRouteName={'Choose'}>
          <Stack.Navigator
            screenOptions={{
              gestureEnabled: false,
            }}>
            <Stack.Screen
              name="Choose"
              component={Choose}
              options={screenOptions}
            />
            <Stack.Screen
              name="Registrar"
              component={Login}
              options={screenOptions}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              initialParams={{login: true}}
              options={screenOptions}
            />
            <Stack.Screen
              name="Agenda"
              component={Agenda}
              options={screenOptions}
            />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <NavigationContainer initialRouteName={'Agenda'}>
          <Stack.Navigator
            screenOptions={{
              gestureEnabled: false,
            }}>
            <Stack.Screen
              name="Agenda"
              component={Agenda}
              options={screenOptions}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}

const screenOptions = {
  headerShown: false,
  animation: 'none',
};

const styles = StyleSheet.create({
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 300,
  },
});
