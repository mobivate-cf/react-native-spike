import React from 'react';
import { Text, KeyboardAvoidingView, Button, TextInput } from 'react-native';
import { AuthSession, WebBrowser, Linking } from 'expo';

import styles from './styles';
import If from './components/if/if';
import AppHeader from './components/app-header/app-header'

import * as Font from 'expo-font';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.isLoggedIn = false;
    this.state.text = '';
  }

  componentDidMount() {
    Font.loadAsync({
      'Montserrat': require('./assets/fonts/Montserrat.ttf'),
    });
  }

  handleRedirect = async event => {
    WebBrowser.dismissBrowser()
  }

  handleOAuthLogin = async () => {
    // gets the app's deep link
    let redirectUrl = await Linking.getInitialURL()
    // this should change depending on where the server is running
    let authUrl = 'https://mobivate-server.herokuapp.com/login/twitter';
    this.addLinkingListener();
    try {
      let authResult = await WebBrowser.openAuthSessionAsync('https://mobivate-server.herokuapp.com/login/twitter', redirectUrl)
      await this.setState({ authResult });
      console.log({authResult})
      if(authResult.type !== 'cancel') {
        this.setState({isLoggedIn: true})
      }
    } catch (err) {
      console.log('ERROR:', err)
    }
  this.removeLinkingListener()
  }

  addLinkingListener = () => {
    Linking.addEventListener('url', this.handleRedirect)
  }

  removeLinkingListener = () => {
    Linking.removeEventListener('url', this.handleRedirect)
  }

  logout = () => {
    if(this.state.isLoggedIn) {
      this.setState({
        isLoggedIn: false,
        text: '',
      });
    }
  }

  render() {
    return (
      <>
      <AppHeader />
      <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
        <If condition={!this.state.isLoggedIn}>
          <Button onPress={this.handleOAuthLogin} title='Login with Twitter' />
        </If>
        <If condition={this.state.isLoggedIn}>
          <Text style={{ fontFamily: 'Montserrat' }}>Logged In!</Text>
          {/* <Text>{}</Text> */}
          <TextInput
            style={{height: 40, width: 90, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
          <Button onPress={this.logout} title='Logout'></Button>
          <Text>{this.state.text}</Text>
        </If>
      </KeyboardAvoidingView>
      </>
    );
  }

}
