import React from 'react';
import {StyleSheet, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const AdaptativeSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={styles.avatar} />
        <View style={styles.infoContainer}>
          <View style={styles.line} />
          <View style={[styles.line, {width: '60%'}]} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    marginLeft: 12,
  },
  line: {
    width: 120,
    height: 20,
    borderRadius: 4,
    marginBottom: 6,
  },
});

export default AdaptativeSkeleton;
