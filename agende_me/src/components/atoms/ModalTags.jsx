import React, {useState} from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Input from './Input';

export default function ModalTags({profile, setProfile, isVisible, onClose}) {
  const [tags, setTags] = useState(profile.tags || ['']);

  const handleTagChange = (text, index) => {
    const updatedTags = [...tags];
    updatedTags[index] = text;
    setTags(updatedTags);
  };

  const handleSave = () => {
    const filteredTags = tags.filter(tag => tag.trim() !== '');
    if (filteredTags.length > 3) {
      alert('Você só pode adicionar até 3 tags.');
    } else {
      setProfile({...profile, tags: filteredTags});
      onClose();
    }
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Adicionar Tags</Text>
          <FlatList
            data={[...Array(3).keys()]} // Gera [0, 1, 2] para até 3 inputs
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item: index}) => (
              // <TextInput
              //   placeholderTextColor="rgba(9, 72, 52, 0.50)"
              //   style={styles.input}
              //   value={tags[index] || ''}
              //   onChangeText={text => handleTagChange(text, index)}
              //   placeholder={`Tag ${index + 1}`}
              // />
              <Input
                editable={true}
                value={tags[index] || ''}
                placeholder={`Tag ${index + 1}`}
                onChange={text => handleTagChange(text, index)}
                label={`Tag ${index + 1}`}
                // error={errorNome}
                // errorMessage={errorMessageNome}
                returnKeyType="next"
                blurOnSubmit={false}
                style={{
                  paddingVertical: 4,
                  width: '100%',
                }}
              />
            )}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    fontSize: 16,
    padding: 5,
    color: 'black',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
