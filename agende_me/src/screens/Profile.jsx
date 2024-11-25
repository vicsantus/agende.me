import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BtnPrimary from '../components/atoms/BtnPrimary';
import Input from '../components/atoms/Input';
import ModalTags from '../components/atoms/ModalTags';
import Header from '../components/organisms/Header';
import {useGeneralContext} from '../context/UserContext';
import {findUser, updateUser, updateUserProfile} from '../utils/fetchApi';
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
  const [editMode, setEditMode] = useState(false);
  const [tagsModal, setTagsModal] = useState(false);

  const handleSave = () => {
    if (profile?.tags?.length > 3) {
      Alert.alert('Erro', 'Você só pode adicionar até 3 tags.');
      return;
    }

    setLoading(true);

    updateUserProfile(userId, {
      profile: profile.profile,
      tags: profile.tags,
    })
      .then(async p => {
        const u = await updateUser(userId, {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
        setProfile(p);
        setUser(u);
        setEditMode(false);
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
      })
      .catch(() => Alert.alert('Erro', 'Não foi possível atualizar o perfil.'))
      .finally(() => setLoading(false));
  };

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
      {/* <ScrollView> */}
      <KeyboardAwareScrollView
        style={{flex: 1}}
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={{flexGrow: 1}}>
        {!isloading && (
          <SafeAreaView style={styles.container}>
            <View style={styles.main}>
              <View style={styles.userZone}>
                <Text style={styles.h2}>
                  {editMode ? 'Editar Perfil' : 'Perfil:'}
                </Text>
                {editMode ? (
                  <>
                    <Input
                      editable={true}
                      value={user.firstName}
                      placeholder="Digite seu primeiro nome"
                      onChange={text => setUser({...user, firstName: text})}
                      label="Nome"
                      // error={errorNome}
                      // errorMessage={errorMessageNome}
                      returnKeyType="next"
                      blurOnSubmit={false}
                      style={/* isKeyboardVisible &&  */ {paddingVertical: 4}}
                    />
                    <Input
                      editable={true}
                      value={user.lastName}
                      placeholder="Digite seu sobrenome"
                      onChange={text => setUser({...user, lastName: text})}
                      label="Sobrenome"
                      // error={errorNome}
                      // errorMessage={errorMessageNome}
                      returnKeyType="next"
                      blurOnSubmit={false}
                      style={/* isKeyboardVisible &&  */ {paddingVertical: 4}}
                    />
                    <Input
                      editable={true}
                      value={user.email}
                      placeholder="Digite seu email"
                      onChange={text => setUser({...user, email: text})}
                      label="E-mail"
                      // error={errorNome}
                      // errorMessage={errorMessageNome}
                      returnKeyType="next"
                      blurOnSubmit={false}
                      style={/* isKeyboardVisible &&  */ {paddingVertical: 4}}
                    />
                    <Input
                      editable={true}
                      value={profile.profile}
                      placeholder="Digite seu perfil"
                      onChange={text => setProfile({...profile, profile: text})}
                      label="Sobre"
                      // error={errorNome}
                      // errorMessage={errorMessageNome}
                      returnKeyType="next"
                      blurOnSubmit={false}
                      style={{
                        paddingVertical: 4,
                        height: 100,
                        textAlignVertical: 'top',
                      }}
                      inputStyle={{height: 100}}
                      multiln={true}
                    />
                    <FlatList
                      data={profile.tags}
                      renderItem={({item, index}) => (
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>{item}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              const newTags = [...profile.tags];
                              newTags.splice(index, 1);
                              setProfile({...profile, tags: newTags});
                            }}>
                            <Text style={styles.removeTag}>X</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      keyExtractor={(tag, idx) => `${tag}-${idx}`}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    />
                    <TouchableOpacity
                      style={styles.addTagButton}
                      onPress={() => setTagsModal(true)}>
                      <Text style={styles.addTagText}>Adicionar Tag</Text>
                    </TouchableOpacity>
                    <ModalTags
                      profile={profile}
                      setProfile={setProfile}
                      isVisible={tagsModal}
                      onClose={() => setTagsModal(false)}
                    />
                  </>
                ) : (
                  <>
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
                  </>
                )}
                {/* <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => (editMode ? handleSave() : setEditMode(true))}>
                  <Text style={styles.editButtonText}>
                    {editMode ? 'Salvar' : 'Editar'}
                  </Text>
                </TouchableOpacity> */}
                {/* <Button
                  onPress={() => (editMode ? handleSave() : setEditMode(true))}
                  title={editMode ? 'Salvar' : 'Editar'}
                /> */}
                {user.id === actualUser.user.id && (
                  <BtnPrimary
                    onPress={() =>
                      editMode ? handleSave() : setEditMode(true)
                    }
                    text={editMode ? 'Salvar' : 'Editar'}
                    style={[
                      /* {marginTop: 21}, isKeyboardVisible &&  */ {
                        marginTop: 13,
                      },
                    ]}
                  />
                )}
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
      </KeyboardAwareScrollView>
      {/* </ScrollView> */}
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
    marginTop: 30,
    margin: 5,
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
  removeTag: {
    color: 'red',
    marginLeft: 5,
  },
  addTagButton: {
    marginTop: 10,
  },
  addTagText: {
    color: '#1ACC4C',
    marginTop: 20,
  },
  editButton: {
    marginTop: 20,
  },
  editButtonText: {
    fontSize: 16,
    color: 'white',
    // backgroundColor: 'blue',
    padding: 10,
  },
  input: {
    borderBottomWidth: 1,
    fontSize: 16,
    marginVertical: 10,
    color: 'black',
  },
});
