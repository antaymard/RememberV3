import React, { Component } from 'react';

import Header from './Header.js';
import SouvenirWall from './SouvenirWall';

export default class HomeView extends Component {

  state = {
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <Header type="HomeView"/>
        <SouvenirWall/>
      </div>
    );
  }
}
