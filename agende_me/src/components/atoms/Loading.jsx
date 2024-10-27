import React from 'react';
import {ActivityIndicator, View} from 'react-native';

export default function Loading({style}) {
  return (
    <View style={{...style}}>
      <ActivityIndicator />
    </View>
  );
}
