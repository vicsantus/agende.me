import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '../../utils/pixelScaling';

export default function BtnPrimary({
  onPress,
  text,
  style,
  isBtnDisabled,
  textStyle,
}) {
  return (
    <>
      {!isBtnDisabled ? (
        <TouchableOpacity style={[styles.btnPrimary, style]} onPress={onPress}>
          <LinearGradient
            style={styles.button}
            locations={[0.2, 0.8]}
            colors={['rgba(15, 120, 87, 0.00)', '#0F7857']}
            start={{x: 0.1, y: 0.2}}
            end={{x: 1, y: 8}}
            disabled={isBtnDisabled}>
            <Text style={[styles.textButton, textStyle && textStyle]}>
              {text}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.btnDisabled, style]} onPress={onPress}>
          <LinearGradient
            style={styles.button}
            locations={[0.2, 0.8]}
            colors={['#D3D5D5', 'red']}
            start={{x: 0.1, y: 0.2}}
            end={{x: 1, y: 8}}
            disabled={isBtnDisabled}>
            {/* {text !== 'Listo!' && (
              <Image
                source={require('../../../assets/img/objective/Group.png')}
                style={{width: 19, height: 19, resizeMode: 'contain'}}
              />
            )} */}
            <Text style={[styles.textButton, textStyle && textStyle]}>
              {text}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  btnPrimary: {
    flexDirection: 'row',
    width: actuatedNormalize(326),
    height: actuatedNormalizeVertical(52),
    borderRadius: 1000,
    backgroundColor: '#1ACC4C',
    shadowColor: 'rgb(27, 86, 44)',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.29,
    shadowRadius: 32,
    elevation: 15,
  },
  btnDisabled: {
    flexDirection: 'row',
    width: actuatedNormalize(326),
    height: actuatedNormalizeVertical(52),
    borderRadius: 1000,
    backgroundColor: '#D3D5D5',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
    flexDirection: 'row',
    gap: 4,
  },
  textButton: {
    textAlign: 'center',
    // alignSelf: "stretch",
    flex: 1,
    fontFamily: 'NunitoSans-Black',
    fontSize: actuatedNormalizeVertical(20),
    fontStyle: 'normal',
    lineHeight: actuatedNormalizeVertical(24),
    color: '#FFFFFF',
  },
});
