import React, { Component } from 'react';

export default class DateFrom extends Component {

  componentDidMount() {
  }

  renderDateFrom = () => {
    if (this.props.date) {
      var date = new Date(this.props.date);
      var now= new Date();

      var result = (now-date)/1000; // en sec

      if (result <= 60) {
        return Math.floor(result) + "s";
      } else {
        result = result/60;  // en min
        if (result <= 60) {
          return Math.floor(result) + "min";
        } else {
          result = result/60; // en heures
          if (result < 24) {
            return Math.floor(result) + 'h';
          } else {
            result = result/24; // en jours
            if (result <= 30) {
              return Math.floor(result) + 'j';
            } else {
              result = result/30; // en mois
              if (result <= 12) {
                return Math.floor(result) + "m";
              } else {
                result = result/12; // en années
                return Math.floor(result) + "an"
              }
            }
          }
        }
      }
      // if (result <= 30 && result >= 1) {
      //   result = result + "j";
      // }
      // if (result > 30 && result <= 365) {
      //   result = Math.floor(result/30) + 'm';
      // }
      // if (result > 365) {
      //   result = Math.floor(result/30/365) + 'y'
      // }
    }
  }

  render() {
    return (
      <div style={{fontSize : this.props.fontSize}}>
        {this.renderDateFrom()}
      </div>
    )
  }
}
