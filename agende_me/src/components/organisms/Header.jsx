// import * as Sentry from "@sentry/react-native";
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useGeneralContext} from '../../context/UserContext';
import {getDataInsInStorage} from '../../utils/localStorage';
import BtnPrimary from '../atoms/BtnPrimary';
import AdaptativeSkeleton from '../templates/AdaptativeSkeleton';

// import ActionModal from './ActionModal';

export default function Header() {
  const {user, setUser, setLoading, islogged} = useGeneralContext();
  const [fullname, setFullname] = useState(false);
  const navigation = useNavigation();
  // const { resultHotspot } = useBackgroundFetch();

  // const [userData, setUserData] = useState("");
  // const {} = useAppContext();
  // const { user } = useUser();

  // const {distanceActivity} = useBackgroundHealth();
  // // const { getDistanceFromGoogleFit } = useHealthData(new Date(), new Date());
  // const {isActionModalVisible, setIsActionModalVisible} = useAppContext();
  // const [executedHotSpot, setExecutedHotSpot] = useState(false);
  // // const [previousTime, setPreviousTime] = useState(0);
  useEffect(() => {
    setLoading(true);
    if (!user) {
      getDataInsInStorage('user')
        .then(e => {
          if (e?.user?.role) {
            const role = e?.user?.role;
            setUser(e);
            setFullname(`${e.user.firstName} ${e.user.lastName}`);
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
    }
    // console.log(user, 'user');
    setFullname(`${user?.user?.firstName} ${user?.user?.lastName}`);

    setLoading(false);
    // console.log(fullname);
  }, []);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.main}>
        {/* <View style={styles.secondary}>
          <View style={styles.userStatus}> */}
        {fullname ? (
          <>
            <Text style={{...styles.activityBtnText, textTransform: 'none'}}>
              Bem vindo(a){' '}
              <Text style={styles.activityBtnText}>{fullname}!</Text>
            </Text>
            <BtnPrimary
              text="Sair"
              textStyle={{fontSize: 13}}
              style={{
                backgroundColor: 'red',
                width: 60,
                height: 30,
              }}
            />
          </>
        ) : (
          AdaptativeSkeleton(/* {width: 80, height: 25} */)
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 70,
    justifyContent: 'flex-end',
    // marginBottom: 12, //remove case objective card return to app
    borderBottomEndRadius: 24,
    borderBottomStartRadius: 24,
    backgroundColor: '#fff',
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  main: {
    height: 60,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 12,
    // alignItems: "center",
    justifyContent: 'space-evenly',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 1617,
    backgroundColor: 'lightgray',
    // marginRight: 16,
  },
  secondary: {
    justifyContent: 'center',
    height: 50,
    // width: 270,
  },
  userStatus: {
    flexDirection: 'row',
    // borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    width: 'auto',
    // justifyContent: "space-between",
    // alignSelf: "stretch",
    gap: 8,
  },
  userLevel: {
    flexDirection: 'row',
    // height: 24,
    alignItems: 'center',
    gap: 3,
  },
  activityBtn: {
    borderWidth: 2,
    borderRadius: 50,
    paddingVertical: 3,
    paddingHorizontal: 5,
    alignItems: 'center',
    borderColor: '#1ACC4C',
    // marginRight: 10,
  },
  activityBtnText: {
    color: '#1ACC4C',
    fontFamily: 'NunitoSans-Black',
    fontSize: 14,
    textTransform: 'capitalize',
    // height: Platform.OS !== "ios" ? 15 : 18,
    // fontStyle: "normal",
    // lineHeight: Platform.OS !== "ios" ? 16 : 18,
  },
  points: {
    color: '#04123E',
    fontFamily: 'NunitoSans-SemiBold',
    fontSize: 13,
    lineHeight: 16,
  },
});
