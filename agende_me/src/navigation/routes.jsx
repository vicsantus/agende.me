import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Choose from '../screens/Choose';
import Login from '../screens/Login';

// import { getDataInsInStorage, getTokensInStorage } from "../utils/localStorage";

export default function Routes() {
  const Stack = createNativeStackNavigator();

  return (
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
        <Stack.Screen name="Login" component={Login} options={screenOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const screenOptions = {
  headerShown: false,
  animation: 'none',
};
