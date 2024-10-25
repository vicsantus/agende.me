import React from "react";
import { TouchableWithoutFeedback, Keyboard, View } from "react-native";

export default function DismissKeyboard({ children }) {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[{ height: "100%" }]}>{children}</View>
    </TouchableWithoutFeedback>
  );
}
