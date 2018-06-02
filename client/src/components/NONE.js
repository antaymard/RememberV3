import React, { Component } from 'react';

export default class MobileView extends Component {

  state = {
    isLoggedIn : true
  }

  componentDidMount() {
  }

  render() {

    if (this.state.isLoggedIn == true) {
      return (
        <div>
          isLoggedIn
        </div>
      );
    } else {
      return (
        <div>
          NOTLOGGED
        </div>
      );
    }
  }
}
