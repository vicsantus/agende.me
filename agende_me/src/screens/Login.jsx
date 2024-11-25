import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, Modal, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import BtnPrimary from '../components/atoms/BtnPrimary';
import BtnSecondary from '../components/atoms/BtnSecondary';
import Input from '../components/atoms/Input';
import ModalPicker from '../components/atoms/ModalPicker';
import ModalWarnings from '../components/atoms/ModalWarnings';
import Select from '../components/atoms/Select';
import {useGeneralContext} from '../context/UserContext';
import {criarUser, loginUser} from '../utils/fetchApi';
import {
  saveAcessTokenInStorage,
  saveDataInStorage,
} from '../utils/localStorage';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '../utils/validateInputs';

export default function Login({login, route}) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tel, setTel] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [errorSenha, setErrorSenha] = useState(false);
  const [errorTipo, setErrorTipo] = useState(false);
  const [errorMessageSenha, setErrorMessageSenha] = useState('');
  const [errorMessageTipo, setErrorMessageTipo] = useState('');
  const [errorNome, setErrorNome] = useState(false);
  const [errorMessageNome, setErrorMessageNome] = useState('');
  const [errorTel, setErrorTel] = useState(false);
  const [errorMessageTel, setErrorMessageTel] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalWarningVisible, setIsModalWarningVisible] = useState(false);
  const [warningText, setWarningText] = useState('');
  const telRef = useRef();
  const emailRef = useRef();
  const senhaRef = useRef();
  const tipoRef = useRef();
  const {setLoading, setIslogged, setUser} = useGeneralContext();
  const navigation = useNavigation();

  const cleanErrors = () => {
    setErrorEmail(false);
    setErrorMessageEmail('');
    setErrorSenha(false);
    setErrorMessageSenha('');
    setErrorNome(false);
    setErrorMessageNome('');
    setErrorTel(false);
    setErrorMessageTel('');
    setErrorTipo(false);
    setErrorMessageTipo('');
  };

  function validPass(senha) {
    const verifyPassword = validatePassword(senha);
    if (verifyPassword.error) {
      setErrorSenha(true);
      setErrorMessageSenha(verifyPassword.message);
    }
  }

  async function createUser() {
    setLoading(true);
    cleanErrors(); // Limpar todos os erros ao iniciar o processo de criação

    // Validações e verificações de erro individuais
    const verifyName = validateName(nome);
    const verifyPassword = validatePassword(senha);
    const verifyEmail = validateEmail(email);
    const phoneError = tel.length < 15; // Verifica se o telefone possui um número válido com formatação

    // Atualizar estados de erro com base nas validações
    if (verifyName.error) {
      setErrorNome(true);
      setErrorMessageNome(verifyName.message);
    }
    if (verifyPassword.error) {
      setErrorSenha(true);
      setErrorMessageSenha(verifyPassword.message);
    }
    if (verifyEmail.error) {
      setErrorEmail(true);
      setErrorMessageEmail(verifyEmail.message);
    }
    if (phoneError) {
      setErrorTel(true);
      setErrorMessageTel('Formato de telefone errado!');
    }
    if (!tipo || !['admin', 'user'].includes(tipo.id)) {
      setErrorTipo(true);
      setErrorMessageTipo('Necessário um tipo válido!');
    }

    // Se houver qualquer erro, cancelar o processo e encerrar a função
    if (
      verifyPassword.error ||
      verifyEmail.error ||
      (!isLogin && (verifyName.error || phoneError || errorTipo))
    ) {
      setLoading(false); // Finalizar o estado de carregamento
      return;
    }
    try {
      if (isLogin) {
        const user = await loginUser(email, senha);
        if (!user) {
          Alert.alert('Erro ao fazer login', 'Não foi possivel fazer login!');
          return;
        }
        await saveAcessTokenInStorage(
          user?.tokens?.access?.token,
          user?.tokens?.refresh?.token,
        );
        await saveDataInStorage('user', {...user, tokens: null});
        setUser({...user, tokens: null});

        setIslogged(true);
        setLoading(false);
        // navigation.navigate('Main');
      } else {
        const user = await criarUser(
          email,
          senha,
          nome.split(' ')[0],
          nome.split(' ').at(-1),
          tipo.id,
        );
        if (!user) {
          Alert.alert(
            'Erro ao criar usuário',
            'Não foi possivel criar usuário!',
          );
          return;
        }
        await saveAcessTokenInStorage(
          user?.tokens?.access?.token,
          user?.tokens?.refresh?.token,
        );

        await saveDataInStorage('user', {...user, tokens: null});
        setUser({...user, tokens: null});
        setIslogged(true);
        setLoading(false);
        // navigation.navigate('Main');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const handlePhoneChange = input => {
    let digitsOnly = input.replace(/\D/g, '');

    if (digitsOnly.length > 11) {
      digitsOnly = digitsOnly.slice(0, 11);
    }

    let formattedPhone = digitsOnly.replace(/^(\d{2})(\d)/g, '($1) $2');
    formattedPhone = formattedPhone.replace(/(\d{5})(\d)/, '$1-$2');

    setTel(formattedPhone);
  };

  const setData = (option, id) => {
    setTipo({
      name: option,
      id,
    });
    setErrorTipo(false);
    setErrorMessageTipo('');
  };

  useEffect(() => {
    if (!login && !route?.params?.login) {
      setIsLogin(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.text}>{isLogin ? 'Login' : 'Registrar'}</Text>
      </View>
      <View style={styles.main2}>
        {!isLogin && (
          <>
            <Input
              editable={true}
              value={nome.toString()}
              placeholder="Seu nome"
              onChange={value => {
                setNome(value);
                cleanErrors();
              }}
              label="Nome"
              error={errorNome}
              errorMessage={errorMessageNome}
              returnKeyType="next"
              onSubmitEditing={() => telRef.current.focus()}
              blurOnSubmit={false}
              style={/* isKeyboardVisible &&  */ {paddingVertical: 4}}
            />
            <Input
              editable={true}
              value={tel.toString()}
              placeholder="(99)99876-5432"
              onChange={value => {
                // setTel(value.toLowerCase());
                handlePhoneChange(value);
                cleanErrors();

                if (tel.length < 14 || value.length < 15) {
                  setErrorTel(true);
                  setErrorMessageTel('Formato de telefone errado!');
                }
              }}
              label="Telefone"
              keyboardType="phone-pad"
              error={errorTel}
              errorMessage={errorMessageTel}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current.focus()}
              blurOnSubmit={false}
              innerRef={telRef}
              style={/* isKeyboardVisible &&  */ {paddingVertical: 4}}
            />
          </>
        )}

        <Input
          editable={true}
          value={email.toString()}
          placeholder="ale@gmail"
          onChange={value => {
            setEmail(value.toLowerCase());
            cleanErrors();
          }}
          label="Email"
          error={errorEmail}
          errorMessage={errorMessageEmail}
          returnKeyType="next"
          onSubmitEditing={() => senhaRef.current.focus()}
          blurOnSubmit={false}
          innerRef={emailRef}
          style={/* isKeyboardVisible &&  */ {paddingVertical: 4}}
        />
        <Input
          value={senha.toString()}
          placeholder=""
          onChange={value => {
            setSenha(value);
            cleanErrors();
          }}
          label="Senha"
          itsPassword
          error={errorSenha}
          errorMessage={errorMessageSenha}
          returnKeyType="next"
          onSubmitEditing={() => {
            if (!isLogin) {
              return setIsModalVisible(!isModalVisible);
            } else {
              return;
            }
          }}
          blurOnSubmit={false}
          innerRef={senhaRef}
          style={/* isKeyboardVisible &&  */ {paddingVertical: 4}}
        />
        <Modal
          animationType="slide"
          transparent
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(!isModalVisible);
          }}>
          <ModalPicker
            changeModalVisibility={() => setIsModalVisible(!isModalVisible)}
            setData={setData}
            data={[
              {nome: 'Cliente', id: 'user'},
              {nome: 'Prestador', id: 'admin'},
            ]}
          />
        </Modal>
        {!isLogin && (
          <Select
            changeModalVisibility={() => setIsModalVisible(!isModalVisible)}
            selected={tipo.name}
            error={errorTipo}
            errorMessage={errorMessageTipo}
            label="Você está aqui como?"
          />
        )}

        <BtnPrimary
          onPress={createUser}
          text={isLogin ? 'Fazer login' : 'Criar conta'}
          style={[/* {marginTop: 21}, isKeyboardVisible &&  */ {marginTop: 13}]}
        />
        <BtnSecondary
          onPress={() => setIsLogin(!isLogin)}
          style={[
            /* {marginTop: 21, alignSelf: 'center'},
            isKeyboardVisible &&  */ {marginTop: 4},
          ]}
          text={isLogin ? 'Registrar' : 'Fazer login'}
          small
        />
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={isModalWarningVisible}
        onRequestClose={() => {
          setIsModalWarningVisible(!isModalWarningVisible);
        }}>
        <ModalWarnings
          changeModalVisibility={() =>
            setIsModalWarningVisible(!isModalWarningVisible)
          }
          text={warningText}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  main2: {
    flex: 7,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'black',
  },
});
