/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {SafeAreaView,StyleSheet,ScrollView,View,Text,StatusBar,} from 'react-native';
import Appnavigation from './Appnavigation';

const App = () => {
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex:1}}>
        <Appnavigation />
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
 
});

export default App;
