import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet} from 'react-native';
import Loading from '../components/atoms/Loading';
import {useGeneralContext} from '../context/UserContext';
import Agenda from '../screens/Agenda';
import Choose from '../screens/Choose';
import Login from '../screens/Login';

// import { getDataInsInStorage, getTokensInStorage } from "../utils/localStorage";

export default function Routes() {
  const {isloading} = useGeneralContext();
  const Stack = createNativeStackNavigator();

  return (
    <>
      {isloading && <Loading style={styles.loading} />}
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
