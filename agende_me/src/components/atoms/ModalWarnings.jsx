import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function ModalWarnings({
  changeModalVisibility,
  isModalVisible,
  text,
}) {
  return (
    <TouchableOpacity
      onPress={() => changeModalVisibility(!isModalVisible)}
      style={styles.container}
    >
      <View style={styles.modal}>
        <Text style={styles.text}> {text} </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "rgb(27, 86, 44)",
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.29,
    shadowRadius: 32,
    elevation: 15,
  },
  text: {
    margin: 20,
    fontSize: 16,
    fontFamily: "NunitoSans-Bold",
    color: "#094834",
  },
});
