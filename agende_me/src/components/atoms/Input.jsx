import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '../../utils/pixelScaling';

export default function Input({
  placeholder,
  onChange,
  label,
  itsPassword,
  error,
  errorMessage,
  returnKeyType,
  onSubmitEditing,
  blurOnSubmit,
  innerRef,
  value,
  editable,
  dinamicWidth,
  inputMode,
  style,
  inputStyle,
  keyboardType,
  multiln,
}) {
  return (
    <View
      style={[
        styles.inputContainer,
        // {
        //   marginBottom: errorMessage ? 8 : 0,
        //   marginTop: errorMessage ? 8 : 0,
        // },
        dinamicWidth && {width: null},
        style && style,
      ]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        editable={editable}
        value={value.toString()}
        onChangeText={values => onChange(values)}
        placeholder={placeholder}
        placeholderTextColor="rgba(9, 72, 52, 0.50)"
        secureTextEntry={itsPassword}
        style={error ? styles.textBoxError : {...styles.textBox, ...inputStyle}}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={blurOnSubmit}
        ref={innerRef}
        inputMode={inputMode && inputMode}
        keyboardType={keyboardType}
        multiline={multiln}
      />
      {error && <Text style={styles.error}> {errorMessage} </Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'column',
    width: actuatedNormalize(326),
    height: actuatedNormalizeVertical(91),
    paddingVertical: actuatedNormalizeVertical(8),
    // justifyContent: "center",
    // alignItems: "flex-start",
    gap: actuatedNormalizeVertical(3),
  },
  textBox: {
    paddingHorizontal: actuatedNormalize(16),
    paddingVertical: actuatedNormalizeVertical(12),
    alignSelf: 'stretch',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(9, 72, 52, 0.50)',
    color: '#094834',
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: actuatedNormalizeVertical(16),
    height: actuatedNormalizeVertical(48),
  },
  textBoxError: {
    paddingHorizontal: actuatedNormalize(16),
    paddingVertical: actuatedNormalizeVertical(12),
    alignSelf: 'stretch',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'red',
    color: '#094834',
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: actuatedNormalizeVertical(16),
    height: actuatedNormalizeVertical(48),
  },
  label: {
    color: '#094834',
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: actuatedNormalizeVertical(16),
    lineHeight: actuatedNormalizeVertical(24),
  },
  error: {
    color: 'red',
    fontFamily: 'NunitoSans_600SemiBold',
    fontSize: actuatedNormalizeVertical(12),
    alignSelf: 'flex-end',
  },
});
