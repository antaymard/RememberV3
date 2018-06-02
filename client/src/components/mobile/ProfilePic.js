import React, { Component } from 'react';

const style = {
  height : "40px",
  width : "40px",
  borderRadius : '50%',
  objectFit : 'cover',
  border : "1px solid white"
}

export default class ProfilePic extends Component {

  componentDidMount() {
  }

  render() {
    if (this.props.imgAddress) {
      return (
        <img alt='profile pic' src={this.props.imgAddress} style={style}/>
      )
    }
    else {
      return (
        <div style={{
          height : "40px",
          width : "40px",
          borderRadius : '50%',
          border : "1px solid white",
          backgroundColor : "#CFD8DC"
        }}/>
      )
    }
  }
}
