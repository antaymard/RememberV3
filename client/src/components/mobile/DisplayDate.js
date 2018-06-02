import React, { Component } from 'react';


const style = {
  fontSize : "12px"
}

const jour = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const month = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];


export default class DisplayDate extends Component {

  renderDate = () => {

    if (this.props.date) {
      var date = new Date(this.props.date);
      var _jour = date.getDay();
      var _day = date.getDate();
      var _month = date.getMonth();
      var _year = date.getYear() + 1900;

      return (
        <p style={style}>{jour[_jour] + ' ' + _day + ' ' + month[_month] + ' ' + _year}</p>
      )
    } else {
      return (
        <p style={style}>Pas de date indiquée</p>
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderDate()}
      </div>
    )
  }
}
