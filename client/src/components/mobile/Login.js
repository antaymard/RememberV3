import React, { Component } from 'react';
import './Login.css';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MoreIcon from '@material-ui/icons/KeyboardArrowDown';

var Cookies = require('js-cookie');

export default class Login extends Component {

  state = {
    username : "",
    password : "",
    snackbarIsOpen : false,
    connectionFeedback : ""
  }

  componentDidMount() {
  }

  checkCredentials = (e) => {
    e.preventDefault();
    if (this.state.username === "" || this.state.password === "") {
      this.setState({ snackbarIsOpen : true });
      this.setState({ connectionFeedback : "Veuillez renseignez un nom d'utilisateur et un mot de passe" });
      return false
    }
    // post CREDENTIALS => response will be token
    fetch('/api/authenticate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username.toUpperCase(),
        password: this.state.password
      })
    })
    .then(res =>res.json())
    .then((res) => {
      this.setState({ snackbarIsOpen : true });
      this.setState({ connectionFeedback : res.message });
      // console.log(res)

      if (res.success === true) {
        Cookies.set('token', res.token, { expires: 7 });
        // changer le state du parent
        this.props.loginConfirmed();
      }
    })
  }

  handleUsernameInput = (e) => {
    this.setState({ username : e.target.value })
  }
  handlePasswordInput = (e) => {
    this.setState({ password : e.target.value })
  }
  handleSnackbarClose = () => {
    this.setState({ snackbarIsOpen : false });
  };

  render() {
    return (
      <div>
        <div className="loginMain">
          <Card className='inputCard'>
            <form className='inputForm' autoComplete="off" onSubmit={(e) => this.checkCredentials(e)}>
              <TextField
                id="username-input"
                label="Nom d'utilisateur"
                type="text"
                margin="normal"
                onChange={this.handleUsernameInput}
                value={this.state.username}
              />
              <TextField
                id="password-input"
                label="Mot de passe"
                type="password"
                autoComplete="current-password"
                margin="normal"
                onChange={this.handlePasswordInput}
                value={this.state.password}
              />
              <div className="rowFlex" style={{marginTop : "35px"}}>
                <Button variant="outlined" color="secondary">
                  inscription
                </Button>
                <Button variant="raised" color="primary" type="submit">
                  connexion
                </Button>
              </div>
            </form>
          </Card>
          <div style={{ position : "absolute", bottom : "5px"}} className="moreIcon">
            <MoreIcon/>
          </div>
        </div>
        <div className="loginMain" style={{backgroundColor : "white"}}>
        </div>
        <Snackbar
            open={this.state.snackbarIsOpen}
            autoHideDuration={2000}
            onClose={this.handleSnackbarClose}
            // ContentProps={{
            //   'aria-describedby': 'snackbar-fab-message-id',
            //   className: classes.snackbarContent,
            // }}
            message={<span>{this.state.connectionFeedback}</span>}
            // action={
            //   <Button color="inherit" size="small" onClick={this.handleSnackbarClose}>
            //     Undo
            //   </Button>
            // }
            // className={classes.snackbar}
          />
      </div>
    );
  }
}
