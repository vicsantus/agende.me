import React, {useEffect, useState} from 'react';
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
import BtnPrimary from '../components/atoms/BtnPrimary';
import Loading from '../components/atoms/Loading';
import DatePicker from '../utils/data-picker';
import {
  createNewSchedules,
  deleteSchedule,
  getSchedule,
  validSchedule,
} from '../utils/fetchApi';

export default function Agenda({userId, isTheOwner}) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [activities, setActivities] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [agenda, setAgenda] = useState({});
  const [newActivity, setNewActivity] = useState({
    startTime: '',
    endTime: '',
    description: '',
  });
  const [isLoading, setLoading] = useState(false);
  const now = {key: 'now', color: 'white', selectedDotColor: 'white'};

  async function deleteDate(date, index) {
    try {
      setLoading(true);
      const newDate = new Date(date).toISOString().split('T')[0];
      const deleted = await deleteSchedule(userId, date);
      const updatedActivities = {...activities};

      // Remover o item do array de atividades
      updatedActivities[newDate].splice(index, 1);

      // Se não houver mais atividades na data, remover a chave
      if (updatedActivities[newDate].length === 0) {
        delete updatedActivities[newDate];
      }

      // Atualizar o estado
      setActivities(updatedActivities);
      setLoading(false);
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async function addActivity() {
    const activitiesForDate = activities[selectedDate] || [];

    const isTimeTaken = activitiesForDate.some(
      activity =>
        activity.startTime === newActivity.startTime ||
        activity.endTime === newActivity.endTime ||
        (newActivity.startTime >= activity.startTime &&
          newActivity.startTime < activity.endTime) ||
        (newActivity.endTime > activity.startTime &&
          newActivity.endTime <= activity.endTime),
    );

    const isConflicted = await validSchedule(
      userId,
      newActivity.startTime,
      newActivity.endTime,
    );

    if (isTimeTaken || isConflicted) {
      Alert.alert(
        'Horário indisponível',
        'Já existe uma atividade cadastrada neste horário.',
      );
      return;
    }

    await createNewSchedules(
      userId,
      newActivity.startTime,
      newActivity.endTime,
      newActivity.description,
    );

    setActivities(prev => ({
      ...prev,
      [selectedDate]: [...activitiesForDate, newActivity],
    }));

    setNewActivity({startTime: '', endTime: '', description: ''});
    setModalVisible(false);
  }

  useEffect(() => {
    const datas = Object.keys(activities);
    const schedule = datas.reduce((acc, date) => {
      const dots = activities[date].map((v, idx) => {
        return {key: `workout-${idx}`, color: 'red'};
      });

      acc[date] = {
        selected: true,
        dots,
      };
      return acc;
    }, {});

    setAgenda(schedule);
  }, [activities]);

  useEffect(() => {
    setLoading(true);

    getSchedule(userId)
      .then(e => {
        if (e[0]) {
          const formattedData = e.reduce((acc, item) => {
            const dateKey = new Date(item.dateStart)
              .toISOString()
              .split('T')[0];

            if (!acc[dateKey]) {
              acc[dateKey] = [];
            }

            acc[dateKey].push({
              startTime: item.dateStart,
              endTime: item.dateEnd,
              description: item.comments.trim(),
            });

            return acc;
          }, {});
          setActivities(formattedData);
          setLoading(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <View style={styles.container}>
      {/* Calendário */}
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        minDate={new Date().toISOString()}
        markingType={'multi-dot'}
        style={{width: '100%'}}
        markedDates={{
          [selectedDate]: {selected: true, marked: true, dots: [now]},
          ...agenda,
        }}
      />

      {/* Lista de atividades */}
      <Text style={styles.header}>
        Atividades para {new Date(selectedDate).toISOString().split('T')[0]}
      </Text>
      <FlatList
        data={activities[selectedDate] || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <View style={styles.activity}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-evenly',
                flexDirection: 'row',
                width: '100%',
              }}>
              <Text style={styles.time}>
                {String(new Date(item.startTime).getUTCHours()).padStart(
                  2,
                  '0',
                )}
                :
                {String(new Date(item.startTime).getUTCMinutes()).padStart(
                  2,
                  '0',
                )}
                {' - '}
                {String(new Date(item.endTime).getUTCHours()).padStart(2, '0')}:
                {String(new Date(item.endTime).getUTCMinutes()).padStart(
                  2,
                  '0',
                )}
              </Text>
              {isTheOwner && (
                <BtnPrimary
                  text="X"
                  onPress={async () => {
                    return await deleteDate(item.startTime, index);
                  }}
                  textStyle={{
                    fontWeight: '700',
                    fontSize: 15,
                  }}
                  style={{
                    backgroundColor: 'red',
                    width: 30,
                    height: 30,
                  }}
                />
              )}
            </View>
            <Text style={{color: 'black'}}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noActivities}>Nenhuma atividade agendada</Text>
        }
      />

      {/* Botão para adicionar nova atividade */}
      <Button
        title="Adicionar Atividade"
        onPress={() => {
          const newDate = new Date(selectedDate);
          newDate.setUTCHours(0, 0, 0, 0);
          setSelectedDate(newDate.toISOString().split('T')[0]);
          setModalVisible(true);
        }}
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
                    const newDate = new Date(selectedDate);
                    newDate.setUTCHours(
                      new Date(date).getUTCHours(),
                      new Date(date).getUTCMinutes(),
                      0,
                      0,
                    );

                    return {...prev, startTime: newDate};
                  })
                }
              />
              {/* Hora de Término */}
              {newActivity.startTime !== '' && (
                <>
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
                        const newDate = new Date(selectedDate);

                        newDate.setUTCHours(
                          new Date(date).getUTCHours(),
                          new Date(date).getUTCMinutes(),
                          0,
                          0,
                        );

                        return {...prev, endTime: newDate};
                      })
                    }
                  />
                </>
              )}
              {new Date(newActivity.startTime) >=
                new Date(newActivity.endTime) && (
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
              onPress={() => {
                setNewActivity({startTime: '', endTime: '', description: ''});
                setModalVisible(false);
              }}
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
    width: '100%',
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 10,
  },
  activity: {
    width: '100%',
    flexDirection: 'column',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
    alignSelf: 'flex-start',
  },
});
