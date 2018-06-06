import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';

import ProfilePic from './ProfilePic.js';

var Cookies = require('js-cookie');
var token = Cookies.get('token');

const style = {
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
    marginRight : '7px',
    alignItems : 'center',
    padding : '5px',
    minWidth : '80px'
  },
  selectedFriend : {
    backgroundColor : '#6c90c7',
    marginRight : '7px',
    alignItems : 'center',
    padding : '5px',
    color : 'white',
    borderRadius : "2px",
    minWidth : '80px'
  }
}

export default class FriendsDialog extends Component {

  state = {
    titre : '',
    dialogIsOpen : this.props.isOpen,
    friendList : [],
    alreadySelected : this.props.alreadySelected
  }

  componentDidMount() {
    this.getFriendList();
    this.setComponent();
  }

  setComponent = () => {
    switch (this.props.type) {
      case 'ADD_SHARED_FRIENDS' :
        this.setState({ titre : "PARTAGER..." })
        break;
    }
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
    console.log()
    return this.state.friendList.map((a, i) => (
      <div className='colFlex' key={i}
        onClick={() => {
          if (!this.state.working) {
            this.state.alreadySelected.filter(b => b._id == a._id).length > 0 ? this.manageSharedFriend(a, "REMOVE") : this.manageSharedFriend(a, "ADD")
          }
        }}
        style={this.state.alreadySelected.filter(b => b._id == a._id).length > 0 ? style.selectedFriend : style.sharedPicDiv}
      >
        <ProfilePic imgAddress={a.photo_address}/>
        <p style={{paddingTop : '5px'}}>
          {a.username}
        </p>
      </div>
    ))
  }

  // TO BE CUSTOMIZED !!
  manageSharedFriend = (a, action) => {
    this.setState({ working : true })
    fetch('/api/manageSharedFriend', {
      method : 'post',
      headers : {
        Accept : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : token
      },
      body : JSON.stringify({
        action : action,
        sharedFriend : a._id,
        svnrId : this.props.idSvnr
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        this.setState({ working : false })
        if (action === "ADD") {
          // ADD in array
          this.setState(prevState => ({
            alreadySelected: [...prevState.alreadySelected, a]
          }))
        } else if (action === 'REMOVE') {
          var _array = [...this.state.alreadySelected]; // make a separate copy of the array
          var _array = _array.filter(c => c._id !== a._id);
          this.setState({alreadySelected: _array});
        }
      }
      console.log(this.state)
    })
  }

  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={this.props.onCloseFunction}>
        <div style={style.dialogTitle}>{this.state.titre}</div>
        <div className='rowFlex' style={style.dialogContent}>
          {this.renderFriendList()}
        </div>
      </Dialog>
    );
  }
}


// ================ BLUEPRINT ================
//
// this.props.type can be :
//   ADD_SHARED_FRIENDS
//   ADD_PRESENT_FRIENDS
//   ADD_AS_RESEARCH_FRIENDS
//
// this.props.alreadySelected = les amis déjà selectionnés et donnés par le parent
//
// this.props.sendFriendsArray = fait remonter l'array final au parent
//
// Si Shared => la fct d'ajout se fait ici
// Si Present ou Research => on remonte l'array d'amis au parent
