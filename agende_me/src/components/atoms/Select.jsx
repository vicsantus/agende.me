import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '../../utils/pixelScaling';

export default function Select({
  changeModalVisibility,
  isModalVisible,
  selected,
  error,
  errorMessage,
  style,
  label,
}) {
  return (
    <Pressable
      style={[styles.inputContainer, style && style]}
      onPress={() => changeModalVisibility(!isModalVisible)}>
      <Text style={styles.label}>{label}</Text>
      <View style={error ? styles.selectBoxError : styles.selectBox}>
        <Text style={styles.label}> {selected} </Text>
        <Image source={require('../../../assets/img/select/select-icon.png')} />
      </View>
      {error && <Text style={styles.error}> {errorMessage} </Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'column',
    width: actuatedNormalize(326),
    height: actuatedNormalizeVertical(91),
    justifyContent: 'center',
    gap: actuatedNormalizeVertical(3),
    paddingTop: actuatedNormalizeVertical(8),
  },
  label: {
    color: '#094834',
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: actuatedNormalizeVertical(16),
  },
  selectBox: {
    height: actuatedNormalizeVertical(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: actuatedNormalize(16),
    alignSelf: 'stretch',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(9, 72, 52, 0.50)',
  },
  selectBoxError: {
    height: actuatedNormalizeVertical(55),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: actuatedNormalize(16),
    alignSelf: 'stretch',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'red',
  },
  error: {
    color: 'red',
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: actuatedNormalizeVertical(12),
    alignSelf: 'flex-end',
  },

  // },
});
