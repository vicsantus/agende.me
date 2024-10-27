import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Modal, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import BtnPrimary from '../components/atoms/BtnPrimary';
import BtnSecondary from '../components/atoms/BtnSecondary';
import Input from '../components/atoms/Input';
import ModalPicker from '../components/atoms/ModalPicker';
import ModalWarnings from '../components/atoms/ModalWarnings';
import Select from '../components/atoms/Select';
import {useGeneralContext} from '../context/UserContext';
import {criarUser, loginUser} from '../utils/fetchApi';

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
  const {setLoading} = useGeneralContext();
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

  async function createUser() {
    console.log('Criando!');
    setLoading(true);
    if (isLogin) {
      const user = await loginUser(email, senha);
    } else {
      const user = await criarUser(
        email,
        senha,
        nome.split(' ')[0],
        nome.split(' ').at(-1),
        tipo.id,
      );
    }
    setLoading(false);
    navigation.navigate('Agenda');
  }

  const handlePhoneChange = input => {
    // Remover caracteres não numéricos
    let formattedPhone = input.replace(/\D/g, '');

    // Aplicar a formatação para (XX) XXXXX-XXXX
    if (formattedPhone.length <= 11) {
      formattedPhone = formattedPhone.replace(/^(\d{2})(\d)/g, '($1) $2');
      formattedPhone = formattedPhone.replace(/(\d{5})(\d)/, '$1-$2');
    }

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
