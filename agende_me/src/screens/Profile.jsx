import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from '../components/organisms/Header';
import {useGeneralContext} from '../context/UserContext';
import {findUser} from '../utils/fetchApi';
import Agenda from './Agenda';

export default function Profile({
  route: {
    params: {userId},
  },
}) {
  const navigation = useNavigation();
  // const {userId} = params;
  const {setLoading, isloading, user: actualUser} = useGeneralContext();
  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});

  useEffect(() => {
    setLoading(true);
    console.log(userId);
    if (userId && !user?.email && !profile?.createdAt) {
      findUser(userId)
        .then(e => {
          // console.log(e, 'User in localstorage');
          // if (e?.accessToken && e?.refreshToken) {
          //   setIslogged(true);
          // }
          console.log(e);
          setUser(e?.user);
          setProfile(e?.profile);

          setLoading(false);
        })
        .catch(e => {
          setLoading(false);
        })
        .finally(() => setLoading(false));
    } else {
      navigation.goBack();
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Handler para interceptar o botão voltar
    if (actualUser?.user?.role === 'admin') {
      const backAction = () => {
        // Alert.alert('Atenção', 'Você não pode voltar desta tela.');
        return true; // Retorna true para prevenir a ação de voltar
      };

      // Adiciona o listener
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      // Remove o listener ao desmontar o componente
      return () => backHandler.remove();
    }
  }, [actualUser]);

  return (
    <>
      {/* {isloading && <Loading style={styles.loading} />} */}
      <Header />
      {!isloading && (
        <SafeAreaView style={styles.container}>
          <View style={styles.main}>
            <View style={styles.userZone}>
              <Text style={styles.h2}>{'Perfil:'}</Text>
              <View style={{marginLeft: 20}}>
                <Text
                  selectable={true}
                  style={{...styles.text, textTransform: 'capitalize'}}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text selectable={true} style={styles.text}>
                  {user?.email}
                </Text>
                <FlatList
                  data={profile?.tags}
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
              <Text style={styles.h2}>{'Sobre:'}</Text>
              <View style={{marginLeft: 20}}>
                <Text style={styles.text}>{profile?.profile}</Text>
              </View>
            </View>
            {/* <BtnPrimary
              style={styles.botao}
              onPress={() => {
                navigation.navigate('Registrar');
              }}
              text="Registrar"
            /> */}
            <Agenda
              userId={user.id}
              setLoading={setLoading}
              isTheOwner={user.id === actualUser.user.id}
            />
          </View>
        </SafeAreaView>
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
    width: '100%',
  },
  botao: {
    margin: 10,
  },
  userZone: {
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
    width: '90%',
    marginTop: 30,
    gap: 9,
  },
  touchablePressed: {
    backgroundColor: '#e0e0e0',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  h2: {
    fontSize: 20,
    color: '#000',
    fontWeight: '700',
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
