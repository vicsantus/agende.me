import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from "../../utils/pixelScaling";

export default function BtnSecondary({
  small,
  onPress,
  text,
  style,
  isBtnDisabled,
  customTextStyle,
}) {
  const btnSize = small ? actuatedNormalize(245) : actuatedNormalize(326);
  return (
    <TouchableOpacity
      style={[styles.btnSecondary, { width: btnSize }, style]}
      onPress={onPress}
      disabled={isBtnDisabled}
    >
      <Text style={[styles.textButtonCrearCuenta, customTextStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnSecondary: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: actuatedNormalize(245),
    height: actuatedNormalizeVertical(52),
    borderRadius: 1000,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "rgba(26, 204, 76, 1.0)",
  },
  textButtonCrearCuenta: {
    fontFamily: "NunitoSans_900Black",
    fontSize: actuatedNormalizeVertical(20),
    color: "#1ACC4C",
    textAlign: "center",
    flex: 1,
  },
});
