import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import BtnPrimary from '../components/atoms/BtnPrimary';
import Input from '../components/atoms/Input';
import Header from '../components/organisms/Header';
import DismissKeyboard from '../components/templates/DismissKeyboard';
import {useGeneralContext} from '../context/UserContext';
import {searchAdmins} from '../utils/fetchApi';
import {getDataInsInStorage} from '../utils/localStorage';

export default function Main() {
  const navigation = useNavigation();
  const {setLoading, setIslogged, user, islogged, isloading} =
    useGeneralContext();
  const [input, setInput] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);

  const onClickButton = async () => {
    const users = await searchAdmins(input);
    // console.log(JSON.stringify(users, null, 2));
    setSearchedUsers(users);
    return users;
  };

  useEffect(() => {
    setLoading(true);
    if (!user) {
      getDataInsInStorage('user')
        .then(e => {
          if (e?.user?.role) {
            const role = e?.user?.role;
            setUser(e);
            if (role === 'admin') {
              navigation.navigate('Agenda');
            } else {
              navigation.navigate('Main');
            }
          }
          setLoading(false);
        })
        .catch(e => {
          setLoading(false);
        })
        .finally(() => setLoading(false));
    } else {
      if (user.user.role === 'admin') {
        navigation.navigate('Agenda');
      } else {
        navigation.navigate('Main');
      }
    }
    setLoading(false);
  }, []);

  return (
    <>
      {/* {isloading && <Loading style={styles.loading} />} */}
      <Header />
      {!isloading && (
        <DismissKeyboard>
          <SafeAreaView style={styles.container}>
            <View style={styles.main}>
              <Input
                editable={true}
                value={input}
                placeholder="O que você procura?"
                onChange={v => setInput(v)}
                label="Procure"
                // error={errorNome}
                // errorMessage={errorMessageNome}
                returnKeyType="next"
                blurOnSubmit={false}
                style={/* isKeyboardVisible &&  */ {paddingVertical: 4}}
              />
              <BtnPrimary
                text="Pesquisar"
                textStyle={{fontSize: 20}}
                onPress={onClickButton}
                style={{
                  // backgroundColor: 'green',
                  width: '90%',
                  height: 60,
                }}
              />
              {searchedUsers.length > 0 ? (
                <FlatList
                  data={searchedUsers}
                  style={{width: '90%', marginTop: 10}}
                  renderItem={({item}) => (
                    <TouchableHighlight
                      style={styles.touchable}
                      underlayColor="#e0e0e0"
                      onPress={() => console.log('Usuário clicado:', item.id)}>
                      <View>
                        <Text style={styles.text}>
                          {item.firstName} {item.lastName}
                        </Text>
                        <Text style={styles.text}>{item.email}</Text>
                        <FlatList
                          data={item.profileUser.tags}
                          renderItem={({item: tag}) => (
                            <View style={styles.tag}>
                              <Text style={styles.tagText}>{tag}</Text>
                            </View>
                          )}
                          keyExtractor={(t, idx) => `${t}-${idx}`}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                        />
                      </View>
                    </TouchableHighlight>
                  )}
                  keyExtractor={item => item.id.toString()}
                />
              ) : (
                <Text style={{...styles.text, marginTop: 20}}>
                  {'Nenhum usuario na pesquisa!'}
                </Text>
              )}
            </View>
          </SafeAreaView>
        </DismissKeyboard>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  touchable: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  touchablePressed: {
    backgroundColor: '#e0e0e0',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
});
