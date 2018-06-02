import React, { Component } from 'react';

import Login from './Login.js';
import HomeView from './HomeView.js';

var Cookies = require('js-cookie');

export default class MobileView extends Component {

  state = {
    isLoggedIn : false
  }

  componentDidMount() {
    this.checkIfCookie();
  }

  checkIfCookie = () => {
    if (Cookies.get('token')){
      this.setState({ isLoggedIn : true });
    } else {
      this.setState({ isLoggedIn : false })
    }
  }

  loginConfirmed = () => {
    this.setState({ isLoggedIn : true })
  }


  render() {
    if (this.state.isLoggedIn === true) {
      return (
        <div>
          <HomeView/>
        </div>
      );
    } else if (this.state.isLoggedIn === false) {
      return (
        <div>
          <Login loginConfirmed = {this.loginConfirmed}/>
        </div>
      );
    } else {
      return (
        <div>
          ERROR
        </div>
      )
    }
  }
}
