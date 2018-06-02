import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';

import AddIcon from '@material-ui/icons/Add';

import CollapsedPic from '../CollapsedPic.js';
import ProfilePic from '../ProfilePic.js';

var Cookies = require('js-cookie');
var token = Cookies.get('token');

const style = {
  main : {
    color : "black",
    marginBottom : "15px",
    marginTop : '10px'
  },
  title : {
    fontWeight : 900,
    marginBottom : "12px"
  },
  content : {
    marginBottom : '10px',
    whiteSpace : 'pre-wrap',
    textAlign: 'justify',
    lineHeight: 1.2
  },
  sharedTitle : {
    fontSize : "10px",
    marginBottom : '5px',
    fontWeight : 900,
  },
  sharedDiv : {
    paddingTop : '10px',
    borderTop : '1px solid #E0E0E0'
  },
  contentParagraphs : {
    marginBottom : "5px"
  },
  addSharedBtn : {
    backgroundColor : '#ECEFF1',
    height : "40px",
    width : "40px"
  },
  dialogTitle : {
    backgroundColor : '#6c90c7',
    fontSize : '20px',
    color : 'white',
    height : "50px",
    width : '100%',
    padding : '13px',
    position : 'fixed'
  },
  dialogContent : {
    padding : '63px 13px 13px 13px',
  },
  sharedPicDiv : {
    marginRight : '13px',
    alignItems : 'center'
  }
}


export default class DescriptionCard extends Component {

  state = {
    dialogIsOpen : false,
    friendList : []
  }

  componentDidMount() {
    this.getFriendList();
  }

  // met en forme les paragraphs
  renderFormatting = (t) => {
    // Break text into paragraphs
    var e = t.split('\n');
    // Check if one of the breaks is empty
    return e.map(a => (
      <p key={a} style={style.contentParagraphs}>{a}</p>
    ))
  }

  // DIALOG
  handleDialogClose = () => {
    this.setState({ dialogIsOpen : false });
  }

  handleDialogOpen = () => {
    this.setState({ dialogIsOpen : true });
  }

  getFriendList = () => {
    fetch('/api/getFriendsList', {
      method : 'get',
      headers : {
        Accept : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : token
      },
    })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        console.log(res)
        this.setState({ friendList : res.friendList })
      }
    })
  }

  renderFriendList = () => {
    return this.state.friendList.map((a, i) => (
      <div className='colFlex' style={style.sharedPicDiv} key={i}
        onClick={() => this.shareWithFriend(a._id)}>
        <ProfilePic imgAddress={a.photo_address}/>
        <p style={{paddingTop : '5px'}}>{a.username}</p>
      </div>
    ))
  }

  shareWithFriend = (id) => {
    fetch('/api/addSharedFriend', {
      method : 'post',
      headers : {
        Accept : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : token
      },
      body : JSON.stringify({
        sharedFriend : id,
        svnrId : this.props.idSvnr
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        console.log(res)
        console.log(res.message)
      }
    })
  }

  render() {
    return (
      <Paper style={style.main} className='cardPadding'>
        <div style={style.title}>
          Description
        </div>
        <div style={style.content}>
          {this.renderFormatting(this.props.text)}
        </div>
        <div className="colFlex" style={style.sharedDiv}>
          <p style={style.sharedTitle}>Partagé avec</p>
          <div className='rowFlex'>
            <CollapsedPic images={this.props.shared}/>
            <IconButton style={style.addSharedBtn} onClick={this.handleDialogOpen}>
              <AddIcon/>
            </IconButton>
          </div>
        </div>
        <Dialog
          open={this.state.dialogIsOpen}
          onClose={this.handleDialogClose}>
          <div style={style.dialogTitle}>PARTAGER...</div>
          <div className='rowFlex' style={style.dialogContent}>
            {this.renderFriendList()}
          </div>

        </Dialog>
      </Paper>
    )
  }
}
