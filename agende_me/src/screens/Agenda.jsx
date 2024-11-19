import React, {useState} from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
// import {DatePicker} from 'react-native-wheel-pick';
import DatePicker from '../utils/data-picker';

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [activities, setActivities] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newActivity, setNewActivity] = useState({
    startTime: '',
    endTime: '',
    description: '',
  });

  const addActivity = () => {
    const activitiesForDate = activities[selectedDate] || [];

    // Verifica se já existe uma atividade no mesmo horário
    const isTimeTaken = activitiesForDate.some(
      activity =>
        activity.startTime === newActivity.startTime ||
        activity.endTime === newActivity.endTime ||
        (newActivity.startTime >= activity.startTime &&
          newActivity.startTime < activity.endTime) ||
        (newActivity.endTime > activity.startTime &&
          newActivity.endTime <= activity.endTime),
    );

    if (isTimeTaken) {
      Alert.alert(
        'Horário indisponível',
        'Já existe uma atividade cadastrada neste horário.',
      );
      return;
    }

    // Adiciona a nova atividade
    setActivities(prev => ({
      ...prev,
      [selectedDate]: [...activitiesForDate, newActivity],
    }));
    setNewActivity({startTime: '', endTime: '', description: ''});
    setModalVisible(false);
  };

  const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'blue'};
  const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
  const workout = {key: 'workout', color: 'green'};
  console.log(activities);
  console.log(new Date(selectedDate));

  return (
    <View style={styles.container}>
      {/* Calendário */}
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        minDate={new Date().toISOString()}
        markingType={'multi-dot'}
        style={{width: '100%'}}
        markedDates={{
          [selectedDate]: {selected: true, marked: true, dots: [workout]},
          [activities.startTime]: {
            marked: true,
            selected: true,
            dots: [vacation],
          },
          [activities.endTime]: {marked: true, selected: true, dots: [massage]},
        }}
      />

      {/* Lista de atividades */}
      <Text style={styles.header}>Atividades para {selectedDate}</Text>
      <FlatList
        data={activities[selectedDate] || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.activity}>
            <Text style={styles.time}>
              {item.startTime.toString()} - {item.endTime.toString()}
            </Text>
            <Text style={{color: 'black'}}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noActivities}>Nenhuma atividade agendada.</Text>
        }
      />

      {/* Botão para adicionar nova atividade */}
      <Button
        title="Adicionar Atividade"
        onPress={() => setModalVisible(true)}
      />

      {/* Modal para adicionar atividade */}
      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Nova Atividade</Text>
            {/* Hora de Início */}
            <View style={styles.viewHours}>
              <Text style={styles.text}>{'Hora de Início (HH:MM)'}</Text>
              <DatePicker
                style={{
                  backgroundColor: 'white',
                  width: '90%',
                  height: 240,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                mode="time"
                date={new Date(selectedDate)}
                onDateChange={date =>
                  setNewActivity(prev => {
                    console.log(date);
                    return {...prev, startTime: date};
                  })
                }
              />
              {/* Hora de Término */}
              <Text style={styles.text}>{'Hora de Término (HH:MM)'}</Text>
              <DatePicker
                style={{
                  backgroundColor: 'white',
                  width: '90%',
                  height: 240,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                mode="time"
                date={new Date(selectedDate)}
                onDateChange={date =>
                  setNewActivity(prev => {
                    console.log(date);
                    return {...prev, endTime: date};
                  })
                }
              />
              {newActivity.startTime >= newActivity.endTime && (
                <Text style={{color: 'red', fontSize: 15}}>
                  {'Horario não permitido!'}
                </Text>
              )}
            </View>
            {/* Descrição */}
            <TextInput
              placeholder="Descrição"
              placeholderTextColor="rgba(9, 72, 52, 0.50)"
              style={styles.input}
              value={newActivity.description}
              onChangeText={text =>
                setNewActivity(prev => ({...prev, description: text}))
              }
            />
            <Button
              disabled={newActivity.startTime >= newActivity.endTime}
              title="Salvar"
              onPress={addActivity}
            />
            <Button
              title="Cancelar"
              onPress={() => setModalVisible(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    width: '90%',
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 10,
  },
  activity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  time: {
    fontWeight: 'bold',
    color: 'black',
  },
  noActivities: {
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: 'black',
  },
  viewHours: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    alignSelf: 'flex-start',
  },
});
