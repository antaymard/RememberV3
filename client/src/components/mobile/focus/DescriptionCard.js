import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';

import AddIcon from '@material-ui/icons/Add';

import CollapsedPic from '../CollapsedPic.js';
import FriendsDialog from '../FriendsDialog.js';

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
}


export default class DescriptionCard extends Component {

  state = {
    dialogIsOpen : false
  }

  componentDidMount() {
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

  // FRIENDSDIALOG FUNCTIONS
  handleDialogOpen = () => {
    console.log("cliekd")
    this.setState({ dialogIsOpen : true });
    console.log(this.state)
  }
  onCloseFunction = (a) => {
    this.setState({ dialogIsOpen : false })
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
        <FriendsDialog
          type='ADD_SHARED_FRIENDS'
          isOpen={this.state.dialogIsOpen}
          onCloseFunction={this.onCloseFunction}
          idSvnr={this.props.idSvnr}
        />
      </Paper>
    )
  }
}
