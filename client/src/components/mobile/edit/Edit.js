import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import DoneIcon from '@material-ui/icons/Done';


import MapContainer from '../MapContainer.js';


import Header from '../Header.js';

const style = {
  card : {
    marginBottom : '15px'
  },
  title : {
    borderBottom : '1px solid #E0E0E0',
    paddingBottom : '10px',
    fontWeight : '900'
  },
  content : {
    marginTop : '15px'
  },
  input : {
    width : "100%"
  },
  previewDiv :{
    marginTop : '15px',
    justifyContent : 'space-around'
  },
  images : {
    width : '100px',
    height : '100px',
    objectFit : 'cover',
    borderRadius : '2px',
    border : '1px solid #CFD8DC'
  },
  mapDiv : {
    width: "100px",
    height : '150px'
  },
  fabBtn : {
    position : "fixed",
    bottom : "15px",
    right : "10px",
    transition : "all 0.2s ease-out"
  },
  fabBtnUp : {
    position : "fixed",
    bottom : "61px",
    right : "10px",
    transition : "all 0.2s ease-out"
  },
}

const configFile = require('../config.js');
var Cookies = require('js-cookie');

// AMAZON S3 SHIT
const AWS = window.AWS;
var albumBucketName = 'rememberbucket';
var bucketRegion = 'eu-west-1';
var IdentityPoolId = configFile.IdentityPoolId;
AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
});


export default class Edit extends Component {

  state = {
    // header
    pageType : '', // EDITER ou CREER
    // snackbar
    snackbarIsOpen : false,
    snackbarMessage : "",
    // images
    images : [],
    uploadStatus : 0,
    uploadSuccess : 0,
    // inputs
    description : "",
    titre : "",
    date : null,
    lieu : {
      placeName : '',
      latLng : {}
    },
    presentFriends : [],
  }

  componentDidMount() {
    this.setHeaderTitle();
  }

  // CREER ou EDITER dans le header
  setHeaderTitle = () => {
    if (this.props.match.url === '/create') {
      return this.setState({ pageType : 'CREER'});
    } else {
      return this.setState({ pageType : 'EDITER'})
    }
  }

  generateRandomFileName = (n) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < n; i++)  {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  handleInput = name => e => {
    this.setState({ [name] : e.target.value })
    // console.log(this.state);
  }

  handleSnackbarClose = () => {
    this.setState({ snackbarIsOpen : false });
  };

  handleChangePhoto = (e) => {
    console.log('handleChangePhoto launched');
    var _f = e.target.files;

    if (_f.length <= 3 && _f.length > 0) {
      console.log('if is ok ', _f.length);
      for (var i in _f) {
        if (_f.hasOwnProperty(i)) {
          // console.log(_f[i]);
          this.processImage(_f[i]);
        }

      }

      // for (var i = 0; i < _f.length; _f++) {
      //   if (_f.hasOwnProperty(i)) {
      //     var t = _f[i]; // OK
      //     this.work(t);
      //   }
      // }
    } else {
      console.log("no file selected");
      this.setState({ snackbarIsOpen : true });
      this.setState({ snackbarMessage : "Vous avez selectionné trop d'images !!" });
    }
  }

  processImage = (f) => {
    // console.log(f)
    this.initializePreviewImage(f)
      .then((idImg, file) => {
        console.log(idImg);
        console.log(f);
        this.addPhoto("ImgSvnr", f, idImg);
      })
  }

  initializePreviewImage = (file) => {
    return new Promise((resolve) => {
      console.log(file);

        var reader = new FileReader();
        var idImg = this.generateRandomFileName(3);

        reader.onloadend = () => {
          var newArray = this.state.images.slice();
          newArray.push({
            idImg : idImg,
            file : file,
            imagePreviewUrl : reader.result,
            // key : this.generateRandomFileName(5),
            uploadProgress : 0,   // not used
            locationInBucket : ''   // Attention, ne correspond pas forcément !!
          });
          console.log('OMGOMG ', file.name);
          console.log(newArray)
          this.setState({images : newArray});
          // Lance l'upload de la photo
          // this.addPhoto("ImgSvnr", file, this.state.images[f].idImg);
          console.log(file);
          console.log(idImg);
          resolve(idImg, file);
        }
        //console.log(this.state.images)
        reader.readAsDataURL(file);
    })
  }

  renderPreviewImage = () => {
    return this.state.images.map(a => (
      // console.log(a)
      <div className='colFlex' key={this.generateRandomFileName(2)}>
        <img key={a.idImg} src={a.imagePreviewUrl} style={style.images}/>
      </div>
    ))
  }

  addPhoto = ( albumName, file, idImg ) => {
    // console.log('addPhoto launched ' + idImg);

    var _this = this;

    // console.log('==========================', file);

    var fileName = this.generateRandomFileName(50) + 'png';
    var albumPhotosKey = encodeURIComponent(albumName) + '/';
    var photoKey = albumPhotosKey + fileName;

    s3.upload({
      Key : photoKey,
      Body: file,
      ACL: 'public-read'
    })
    .on('httpUploadProgress',(evt) => {
        // console.log('PROGRESS');
        // var _state = _this.state;
        // for (var h in _state.images) {
        //   // console.log(this.state.images[h].idImg); // 1
        //   // console.log(idImg);                      // 0
        //   console.log('=============')
        //   if (_state.images[h].idImg == idImg) {
        //     console.log("MAAATCH");
        //     console.log(_state.images[h]);
        //     let images = {..._this.state.images[h]};
        //     let r = _state.images[h].uploadProgress;
        //     // _this.setState({ r : (evt.loaded / evt.total)*100});
        //     _this.setState({ images : images });
        //
        //   }
        // }
        _this.setState({ uploadStatus : evt.loaded*100/evt.total });
      })
    .send(function(err, data) {
        if (err) {
          this.setState({ snackbarIsOpen : true });
          this.setState({ snackbarMessage : "Error uploading image ", err });
          return console.log(err);
        }
        //_this.setState(prevState => { uploadSuccess :  prevState.uploadSuccess + 1});
        for (var b in _this.state.images) {
          if (_this.state.images[b].idImg == idImg) {
            // console.log("MATCH");
            // let jasper = Object.assign({}, this.state.jasper);    //creating copy of object
            // jasper.name = 'someothername';                        //updating value
            // this.setState({jasper});
            let image = {..._this.state.images};
            // console.log(image)
            image[b].locationInBucket = data.Location;

            //_this.setState({ images : image });
          }
        }
      });
  }

  getAddressFromChild = (ad) => {
    this.setState( {lieu : {
      placeName : ad.placeName,
      latLng : ad.latLng
    }});
    //console.log(this.state.lieu)
  }

  onDoneBtnPressed = () => {
    var token = Cookies.get('token');
    var s = this.state;
    var imgArray = [];
    for (var t in s.images) {
      imgArray.push(s.images[t].locationInBucket);
    }
    fetch('/api/editOrCreateSvnr', {
      method : 'POST',
      headers : {
        Accept : 'application/json',
        'Content-Type' : 'application/json',
        'x-access-token' : token
      },
      body : JSON.stringify({
        typeOfAction : s.pageType, // CREATE or EDIT
        svnrInfo : {
          idSvnr : "",            // to pass if EDIT
          titre : s.titre,
          description : s.description,
          lieu : s.lieu,
          svnr_date : s.date,
          file_addresses : imgArray,
          presentFriends : s.presentFriends
        }
      })
    }).then(res => res.json())
      .then(res => {
        if (res.success) {
          window.history.back();
        } else if (res.success === false) {
          this.setState({ snackbarIsOpen : true});
          this.setState({ snackbarMessage : res.message});
        }
      })
    // this.setState({ snackbarIsOpen : true})
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <Header type='EditView' titre={this.state.pageType + ' UN SOUVENIR'}/>
        <div className='underHeaderDiv'>
          <Card className='cardPadding' style={style.card}>
            <div style={style.title}>
              AJOUTER DES PHOTOS
            </div>
            <input type='file' onChange={this.handleChangePhoto} multiple style={style.content}/>
            <div className='rowFlex' style={style.previewDiv}>
              {this.renderPreviewImage()}
            </div>
            <LinearProgress
              style={style.content}
              variant='determinate'
              value={this.state.uploadStatus}
            />
          </Card>
          <Card className='cardPadding' style={style.card}>
            <div style={style.title}>
              DATE ET LIEU
            </div>
            <div style={style.content}>
              <TextField style={style.input}
                type="date"
                onChange={this.handleInput('date')}
              />
            </div>
            <div style={style.content}>
              <MapContainer sendAddressToParent={this.getAddressFromChild}/>
            </div>
          </Card>
          <Card className='cardPadding' style={style.card}>
            <div style={style.title}>
              TITRE ET DESCRIPTION
            </div>
            <div>
              <TextField
                label="Titre"
                style={style.input}
                value={this.state.titre}
                onChange={this.handleInput('titre')}
                margin="normal"
              />
            </div>
            <div>
              <TextField
                label="Description"
                multiline
                // rowsMax="5"
                value={this.state.description}
                onChange={this.handleInput('description')}
                style={style.input}
                margin="normal"
              />
            </div>
          </Card>
          <Card className='cardPadding' style={style.card}>
            <div style={style.title}>
              PERSONNES PRESENTES
            </div>
            <div>

            </div>
          </Card>
          <Button variant="fab" style={this.state.snackbarIsOpen ? style.fabBtnUp : style.fabBtn}
                  color="secondary"
                  onClick={this.onDoneBtnPressed}>
              <DoneIcon/>
          </Button>
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
      </div>
    )
  }
}
