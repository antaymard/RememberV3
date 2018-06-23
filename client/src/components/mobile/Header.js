import React, { Component } from 'react';
import { Link } from "react-router-dom";

import IconButton from '@material-ui/core/IconButton';

import BackIcon from '@material-ui/icons/ArrowBack';
// import MoreIcon from '@material-ui/icons/MoreHoriz';
import LogOutIcon from '@material-ui/icons/PowerSettingsNew';
import EditIcon from '@material-ui/icons/Edit';

import ProfilePic from './ProfilePic.js';
import whiteLogo from '../siteSrc/whitelogo.png'

var Cookies = require('js-cookie');

const style = {
  headerHome : {
    padding: '10px',
    color: 'white',
    position : 'fixed',
    width : '100%',
    backgroundColor : "#6c90c7",
    height : "60px",
    zIndex : 99,
  },
  headerFocus : {
    padding: '10px',
    color: 'white',
    position : 'fixed',
    width : '100%',
    backgroundColor : "#6c90c7",
    height : "60px",
    zIndex : 99
  },
  backIcon : {
    color : 'white'
  }
}

export default class Header extends Component {
  state = {
    anchorEl : null,
    profilePicUrl : null,
    dialogIsOpen : false
  }

  componentDidMount() {
    if (this.props.type === 'HomeView') {
      this.getProfilePicUrl();
    }
  }

  getProfilePicUrl = () => {
    fetch('/api/getProfilePicUrl?token=' + Cookies.get('token'))
    .then(res => res.json())
    .then(res => {
      this.setState({ profilePicUrl : res })
    })
  }

  // Menu déroulant
  // handleMenuOpen = (e) => {
  //   // console.log(e.currentTarget)
  //   this.setState({ anchorEl: e.currentTarget });
  // }
  // handleMenuClose = () => {
  //   this.setState({ anchorEl: null });
  // }

  // Dialog
  handleDialogOpen = () => {
    console.log(window.location.href)
    this.setState({ dialogIsOpen: true });
  };
  handleDialogClose = () => {
    this.setState({ dialogIsOpen: false });
  };

  render() {

    if (this.props.type === "HomeView") {
      return (
        <div className="rowFlex" style={style.headerHome} >
          <div className="rowFlex">
            <img alt="whitelogo" src={whiteLogo} style={{height : "40px", marginRight : "10px"}}/>
            Remember.
          </div>
          <div>
            <IconButton onClick={this.handleMenuOpen}
              aria-owns={this.state.anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
            >
              <ProfilePic imgAddress={this.state.profilePicUrl}/>
            </IconButton>
            {/* <Menu
              anchorEl={this.state.anchorEl}
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleMenuClose}
            >
              <MenuList>
                <MenuItem>
                  <ListItemIcon>
                    <LogOutIcon/>
                  </ListItemIcon>
                  <ListItemText inset primary="Se déconnecter"/>
                </MenuItem>
              </MenuList>
            </Menu> */}
          </div>
        </div>
      );
    }

    else if (this.props.type === "FocusView") {
      return (
        <div className="rowFlex" style={style.headerFocus}>
          <div className="rowFlex">
            <Link to='/'>
              <IconButton>
                <BackIcon style={style.backIcon}/>
              </IconButton>
            </Link>
          </div>
          <div>
            <Link to={"/edit/" + window.location.href.split('svnr/')[1] }>
            <IconButton style={{ color : 'white'}}>
              <EditIcon/>
            </IconButton>
            </Link>
          </div>
        </div>
      );
    }

    else if (this.props.type === "EditView") {
      return (
        <div className="rowFlex" style={style.headerFocus}>
          <div className="rowFlex">
            <Link to='/'>
              <IconButton>
                <BackIcon style={style.backIcon}/>
              </IconButton>
            </Link>
            {this.props.titre}
          </div>

        </div>
      );
    }
  }
}
