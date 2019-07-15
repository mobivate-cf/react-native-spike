import React from 'react';
import { Button, KeyboardAvoidingView, Text, TextInput } from 'react-native';
import { Linking } from 'expo';
import * as WebBrowser from 'expo-web-browser';
import * as Font from 'expo-font';

import styles from './styles';
import If from './components/if/if';
import AppHeader from './components/app-header/app-header';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.isLoggedIn = false;
    this.state.text = '';
    this.state.redirectData = 'test';
  }

  componentDidMount() {
    Font.loadAsync({
      Montserrat: require('./assets/fonts/Montserrat.ttf'),
    });
  }

  _handleRedirect = (event) => {
    WebBrowser.dismissBrowser();
    let data = Linking.parse(event.url);
    this.setState({
      redirectData: data.queryParams.authToken,
    });
  };

  login = async () => {
    try {
      this.setState({
        text: Linking.makeUrl().split('exp://')[1],
      });
      Linking.addEventListener('url', this._handleRedirect);

      let result = await WebBrowser.openBrowserAsync(`https://mob-backend.herokuapp.com/login/twitter`);

      Linking.removeEventListener('url', this._handleRedirect);
    } catch (error) {
      alert(error);
      console.error(error);
    }
  };

  logout = () => {
    if (this.state.isLoggedIn) {
      this.setState({
        isLoggedIn: false,
        text: '',
      });
    }
  };

  render() {
    return (
      <>
        <AppHeader />
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
          <If condition={!this.state.isLoggedIn}>
            <Button onPress={this.login} title="Login with Twitter" />
            <Text>{this.state.text}</Text>
            <Text>{this.state.redirectData}</Text>
          </If>

          <If condition={this.state.isLoggedIn}>
            <Text style={{ fontFamily: 'Montserrat' }}>Logged In!</Text>
            <TextInput
              style={{ height: 40, width: 90, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
            />
            <Button onPress={this.logout} title="Logout" />
            <Text>{this.state.text}</Text>
          </If>
        </KeyboardAvoidingView>
      </>
    );
  }
}
