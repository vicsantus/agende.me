import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

export default function ModalPicker({
  changeModalVisibility,
  isModalVisible,
  setData,
  data,
}) {
  const onPressItem = (option, id) => {
    changeModalVisibility(!isModalVisible);
    setData(option, id);
  };

  const Option = ({title, id}) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => onPressItem(title, id)}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );

  const Separator = () => <View style={styles.separator} />;
  return (
    <TouchableOpacity
      onPress={() => changeModalVisibility(!isModalVisible)}
      style={styles.container}>
      <View style={[styles.modal, {width: WIDTH / 1.5, height: HEIGHT / 2}]}>
        <FlatList
          data={data}
          renderItem={({item}) => <Option title={item.nome} id={item.id} />}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={Separator}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
  },
  option: {
    alignItems: 'flex-start',
  },
  text: {
    margin: 20,
    fontFamily: 'NunitoSans_900Black',
    fontSize: 20,
    fontStyle: 'normal',
    lineHeight: 24,
    color: '#094834',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(9, 72, 52, 0.50)',
    marginHorizontal: 20,
  },
});
