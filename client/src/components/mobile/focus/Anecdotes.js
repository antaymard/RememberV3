import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

import SendIcon from '@material-ui/icons/Send';


import ProfilePic from '../ProfilePic.js';
import DateFrom from '../DateFrom.js';

var Cookies = require('js-cookie');

const style = {
  main : {
    color : "black",
    marginBottom : "7px",
  },
  title : {
    fontWeight : 900,
    marginBottom : "10px",
    marginTop : "7px"
  },
  userSection : {
    marginBottom : "10px"
  },
  content :{
    whiteSpace : 'pre-wrap',
    textAlign: 'justify',
    lineHeight: 1.2
  },
  contentParagraphs : {
    marginBottom : "5px"
  },
  input : {
    width : "100%"
  },
  sendBtn : {
    width : '50px',
    marginLeft : '10px'
  }
}

export default class Anectodes extends Component {

  state = {
    // snackbar
    snackbarIsOpen : false,
    snackbarMessage : "",
    // Comment
    comments : [],
    recieved : false,
    newComment : ""
  }

  componentDidMount() {
    this.getAnecdotes();
  }

  getAnecdotes = () => {
    fetch('/getAnecdotes/' + this.props.idSvnr)
    .then(res => res.json())
    .then(res => {
      console.log(res)
      this.setState({ comments : res, recieved : true })
    })
  }

  // Rend les cartes commentaires
  renderComments = () => {
    var c = this.state.comments;
    return c.map(a => (
      <Paper style={style.main} className='cardPadding' key={a._id}>
        <div className='colFlex'>
          <div className='rowFlex' style={style.userSection}>
            <div className='rowFlex'>
              <ProfilePic imgAddress={a.createdBy[0].photo_address}/>
              <div className="colFlex" style={{marginLeft : "10px"}}>
                <p><span style={{color:'#6c90c7'}}>{a.createdBy[0].prenom} </span>
                 a commenté</p>
                <DateFrom date={a.creationDate} fontSize='12px'/>
              </div>
            </div>
          </div>
          <div style={style.content}>
            {this.renderFormatting(a.content)}
          </div>
        </div>
      </Paper>
    ))
  }

  // met en forme les paragraphes
  renderFormatting = (t) => {
    // Break text into paragraphs
    var e = t.split('\n');
    // Check if one of the breaks is empty
    return e.map(a => (
      <p key={a} style={style.contentParagraphs}>{a}</p>
    ))
  }

  handleInput = name => e => {
    this.setState({ [name] : e.target.value })
  }

  sendNewComment = () => {
    if (this.state.newComment === '') {
      this.setState({ snackbarIsOpen : true });
      return this.setState({ snackbarMessage : "Vous ne pouvez pas envoyer d'anecdote vide"})
    }
    fetch('/api/addNewComment', {
      method : 'POST',
      headers : {
        Accept : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : Cookies.get('token')
      },
      body : JSON.stringify({
        content : this.state.newComment,
        svnrId : this.props.idSvnr
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        this.getAnecdotes();
      } else {
        this.setState({ snackbarIsOpen : true});
        this.setState({ snackbarMessage : res.message })
      }
    })
  }

  handleSnackbarClose = () => {
    this.setState({ snackbarIsOpen : false });
  };

  renderInputNewComment = () => {
    return (
      <Paper style={style.main} className='cardPadding' key="ERF">
        <div className='rowFlex'>
          <TextField style={style.input}
            label = 'Nouvelle anecdote'
            type="text"
            onChange={this.handleInput('newComment')}
            value = {this.state.newComment}
          />
          <IconButton variant="outlined" style={style.sendBtn}
            onClick={this.sendNewComment}
          >
            <SendIcon/>
          </IconButton>
        </div>
      </Paper>
    )
  }

  render() {
    if (this.state.recieved) {
      return (
        <div className='colFlex'>
          <p style={style.title}>Anecdotes</p>
          <div className='colFlex'>
            {this.renderComments()}
            {this.renderInputNewComment()}
          </div>
          <Snackbar
              open={this.state.snackbarIsOpen}
              autoHideDuration={4000}
              onClose={this.handleSnackbarClose}
              message={<span>{this.state.snackbarMessage}</span>}
              action={
                <Button color="inherit" size="small" onClick={this.handleSnackbarClose}>
                  OK
                </Button>
              }
            />
        </div>
      )
    } else {
      return (
        <p>Chargment des anecdotes...</p>
      )
    }
  }
}
