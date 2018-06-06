import React, { Component } from 'react';
import { Link } from "react-router-dom";

import ProfilePic from './ProfilePic.js';
import MyCarousel from './MyCarousel.js';
import DisplayDate from './DisplayDate.js';
import DateFrom from './DateFrom.js';

import LocationIcon from '@material-ui/icons/LocationOn';
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';

var Cookies = require('js-cookie');

var style = {
  fabBtn : {
    position : "fixed",
    bottom : "15px",
    right : "10px"
  },
  souvenirCard : {
    width : "100%",
    height : "auto",
    marginBottom : "10px",
  },
  locationDiv : {
    marginTop : "7px",
    display : 'flex',
    flexDirection : 'row',
    alignItems : 'center'
  }
}

export default class SouvenirWall extends Component {

  state = {
    success : "loading",
    skip : 0
  }

  componentDidMount() {
    this.getSouvenirList();
    // Cookies.remove('token', { path: '' }); // removed!
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.skip !== nextState.skip) {
      console.log(this.state.skip)
      this.getSouvenirList();
    }
  }

  getSouvenirList = () => {
    fetch('/api/recall_souvenir_wall?skip=' + this.state.skip, {
      method : 'GET',
      headers : {
        Accept : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : Cookies.get('token')
      }
    })
    .then(res => res.json())
    .then((res) => {
      this.setState({ success : res.success, souvenirList : res.souvenirList, message : res.message })
      if (res.success === false && res.message === 'Failed to authenticate token.') {
        Cookies.remove('token', { path: '' }); // remove cookies
        window.location.reload();
      }
    })
  }

  renderSouvenirCards = () => {
    return this.state.souvenirList.map(a => (
        <Card style={style.souvenirCard} className='cardPadding' key={a._id}>
          <div className='rowFlex'>
            <div className='rowFlex'>
              <ProfilePic imgAddress={a.createdBy[0].photo_address}/>
              <div className='colFlex' style={{marginLeft : "10px"}}>
                <p><span style={{color:'#6c90c7'}}>{a.createdBy[0].prenom} </span>
                 a ajouté un souvenir</p>
              </div>
            </div>
            <DateFrom date={a.creation_date}/>
          </div>
          <div className='colFlex' style={{marginTop : "10px"}}>
            <Link to={"/svnr/" + a._id}>
              <MyCarousel images={a.file_addresses} clickable={false}/>
            </Link>
          </div>
          <div className='rowFlex' style={{marginTop : "7px"}}>
            <div className="colFlex">
              <p>{a.titre}</p>
              <DisplayDate date={a.svnr_date}/>
            </div>
          </div>
          <div style={style.locationDiv}>
            <LocationIcon style={{height : "15px", color : '#6c90c7'}}/>
            {a.lieu ? (a.lieu.placeName ? a.lieu.placeName : a.lieu) : "Pas de lieu"}
          </div>
        </Card>
    ))
  }

  renderEmptyCards = () => {
    var empty = [1];
    return empty.map(a => (
      <Card className="cardPadding" style={style.souvenirCard} key={a} style={{opacity : 0.7}}>
        <div className='rowFlex' style={{ width : '100%'}}>
          <div className='rowFlex' style={{ width : '100%'}}>
            <ProfilePic/>
            <div className='colFlex' style={{marginLeft : "10px", height : "20px", width : '90%', backgroundColor : "#CFD8DC"}}>
              <div style={{}}></div>
            </div>
          </div>
        </div>
        <div className='colFlex' style={{marginTop : "10px"}}>
          <div style={{height : '400px', width : '100%', backgroundColor : "#CFD8DC"}}></div>
        </div>
        <div className='rowFlex' style={{marginTop : "7px"}}>
          <div className="colFlex" style={{height : '40px', width : '100%', backgroundColor : "#CFD8DC"}}>
            <div ></div>
          </div>
        </div>
        <div className='' style={{marginTop : "7px"}}>
          <div style={{height : '18px', width : '100%', backgroundColor : "#CFD8DC"}}></div>
        </div>
      </Card>
    ))
  }

  loadMoreLess = (action) => {
    if (action === "MORE") {
      var _i = this.state.skip+1;
      this.setState(prevState => ({ skip : prevState.skip+1}));
    } else if (action === "LESS") {
      this.setState(prevState => ({ skip : prevState.skip-1}));
    }
    console.log(this.state.skip)
  }

  render() {
    if (this.state.success === true) {
      return (
        <div>
          <div className="colFlex underHeaderDiv" style={{justifyContent : 'center'}}>
            {this.state.skip > 0 ? <Card style={style.souvenirCard}
              onClick={() => this.loadMoreLess("LESS")}
              className='cardPadding'>
              DISPLAY LESS
            </Card> : null}
            {this.renderSouvenirCards()}
            <Card style={style.souvenirCard}
              onClick={() => this.loadMoreLess("MORE")}
              className='cardPadding'>
              DISPLAY MORE
            </Card>
          </div>
            <Link to='/create'>
              <Button variant="fab" style={style.fabBtn} color="secondary">
                  <AddIcon/>
              </Button>
            </Link>
        </div>
      )
    } else if (!this.state.success) {
      return (
        <div className='colFlex underHeaderDiv'>
          <p>Authentification pb</p>
        </div>
      )
    } else if (this.state.success == "loading"){
      return (
        <div>
          <div className="colFlex underHeaderDiv" style={{justifyContent : 'center'}}>
            {this.renderEmptyCards()}
          </div>
        </div>
      )
    }
  }
}
