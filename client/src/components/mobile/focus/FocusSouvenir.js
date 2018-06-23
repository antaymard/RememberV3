import React, { Component } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import Header from '../Header.js';
import ProfilePic from '../ProfilePic.js';
import DisplayDate from '../DisplayDate.js';
import MyCarousel from '../MyCarousel.js';
import DescriptionCard from './DescriptionCard.js';
import DateFrom from '../DateFrom.js';
import Anecdotes from './Anecdotes.js';
import Maps from '../Maps.js';

var Cookies = require('js-cookie');


export default class FocusSouvenir extends Component {

  state = {
    svnrInfo : null,
    success : true,
    message : null
  }

  componentDidMount() {
    this.getSouvenirInfo(this.props.id.params.id)
  }

  getSouvenirInfo = (id) => {
    fetch('/api/getSvnrInfo?id='+ id + '&token=' + Cookies.get('token'))
    .then(res => res.json())
    .then(res => {
      console.log(res)
      if (res.success) {
        this.setState({ success : true, svnrInfo : res.svnr});
      } else if (res.success === false && res.message === 'Failed to authenticate token.') {
        Cookies.remove('token', { path: '' }); // remove cookies
        window.location = '/';
      }
    })
  }

  render() {
    var s = this.state.svnrInfo;
    if (this.state.svnrInfo) {
      return (
        <div>
          <Header type="FocusView"/>
          <div className='colFlex underHeaderDiv' style={{color : "white"}}>
            <div className='rowFlex'>
              <div className='rowFlex'>
                <ProfilePic imgAddress={s.createdBy[0].photo_address}/>
                <div className='colFlex' style={{marginLeft : '10px'}}>
                  <p>{s.titre}</p>
                  <DisplayDate date={s.svnr_date}/>
                </div>
              </div>
              <DateFrom date={s.creation_date}/>
            </div>
            <div style={{margin : "15px 0px 7px 0px"}}>
              <MyCarousel images={s.file_addresses} clickable={true}/>
            </div>
            <div>
              <Maps lieu={s.lieu}/>
            </div>
            <div className='colFlex'>
              <DescriptionCard text={s.description}
                shared={s.sharedFriends}
                idSvnr={this.props.id.params.id}/>
            </div>
            <div className='colFlex'>
              <Anecdotes idSvnr={this.props.id.params.id}/>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Header type="FocusView"/>
          <div className='colFlex underHeaderDiv'
            style={{
              alignItems : 'center',
              justifyContent : 'center',
              height : '500px'
            }}>
            <CircularProgress
              color="secondary"
              size={70}
              thickness={2}
            />
          </div>
        </div>
      )
    }
  }
}
