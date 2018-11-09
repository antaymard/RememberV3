import React, { Component } from 'react';

import landingpageImage from '../siteSrc/landingpageImage.jpg';
import appImage from '../siteSrc/App.jpg';
import logo from '../siteSrc/whitelogo.png'

const style = {
  header : {
    width : "100%",
    height : "100vh",
    background: 'url(' + landingpageImage + ') no-repeat center center fixed',
    display : 'flex',
    flexDirection : "row",
    justifyContent : "center",
    alignItems : 'center'
  },
  container : {
    backgroundColor : "rgba(108, 144, 199, 0.8)",
    borderRadius : '20px',
    height : "50%",
    width : "50vw",
    display : 'flex',
    flexDirection : "column",
    color: 'white',
    // justifyContent : "center",
    alignItems : 'center'
  },
  logo : {
    height : '30vh'
  },
  rememberTitle : {
    fontSize : "7vh"
  },
  content : {
    backgroundColor : 'white',
    display : 'flex',
    flexDirection : "column",
    alignItems : 'center',
    height : '200px'
  },
  section : {
    display : 'flex',
    flexDirection : "row",
    alignItems : 'center'
  },
  imageSection : {

  },
  textSection : {
    display : 'flex',
    flexDirection : "column"
  },
  fullFrameImage : {
    width : "100%",
    height : "100vh",
    objectFit : "cover"
  }
}

export default class LandingPage extends Component {

  render() {
    return (
      <div>
        <div style={style.header}>
          <div style={style.container}>
            <img style={style.logo} src={logo}/>
            <p style={style.rememberTitle}>Remember</p>
            <p>Live your life, relive your memories  </p>
          </div>
        </div>
        <div style={style.content}>
            <img src={appImage} style={style.fullFrameImage}/>
        </div>
      </div>
    )
  }
}
