import React, { Component } from 'react';

import './LandingPage.css';

import appImage from '../siteSrc/App.jpg';
import logo from '../siteSrc/bluelogo.png';
import firstImage from '../siteSrc/frontmain2.jpg';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const style = {
  headerLogo : {
    height : "40px",
    marginRight : '10px'
  },
}

export default class LandingPage extends Component {

  state = {
    numberOfMem : 300
  }

  componentDidMount() {
    fetch('/getNumberOfUploadedMemories')
    .then(res => res.json())
    .then((res) => {
      this.setState({ numberOfMem : res
      })
    })
  }

  render() {
    return (
      <div>
        <div style={{backgroundColor:"rgb(255,255,255)"}}>
          <div className="mainContainer">
            <div className="landingPageDesktopHeader">
              <div className="headerLogoDiv">
                <img style={style.headerLogo} src={logo}/>
                <h1>Remember</h1>
              </div>
              <div className="headerRightDiv">
                <a className="headerRightLinks" href='#'>Features</a>
                <a className="headerRightLinks" href='#'>Apps & WebApp</a>
                <a className="headerRightLinks" href='#'>Log in</a>
                <button className="signUpBtn" href='#'>Sign up</button>
              </div>
            </div>

            {/* Premier container avec info et image */}
            <div className="rowFlex firstMarketingDiv">
              <div className="colFlex leftFMD">
                <h1>More than pictures: Memories.</h1>
                <h2>Remember is your private space to keep your memories.</h2>
                <h2>People, sentimental objects, places, moments... Save them to remember them.</h2>
                <div style={{marginBottom : "20px"}}>
                  <TextField
                    id="email-input"
                    label="Email"
                    type="text"
                    margin="normal"
                    style={{marginRight:'20px'}}
                  />
                  <TextField
                    id="password-input"
                    label="Password"
                    type="password"
                    margin="normal"
                  />
                </div>
                <button className='signUpBtn' style={{width:"220px"}}>Sign up for free</button>
              </div>
              <div className="colFlex rightFMD">
                <img src={firstImage}/>
              </div>
            </div>
          </div>
        </div>

        <div className="mainContainer">
          <div className='colFlex secondMarketingDiv'>
            <h2>Creating a memory is free and easy.</h2>
            <div className='rowFlex'>
              <div className="bubbleDiv">
                <h3>1</h3>
                <p>Add up to 3 photos</p>
              </div>
              <div className="betweenBubbleLine"></div>
              <div className="bubbleDiv">
                <h3>2</h3>
                <p>Add place and date</p>
              </div>
              <div className="betweenBubbleLine"></div>
              <div className="bubbleDiv">
                <h3>3</h3>
                <p>Add the people who were with you</p>
              </div>
              <div className="betweenBubbleLine"></div>
              <div className="bubbleDiv">
                <h3>✔</h3>
                <p>Your memory is with you forever</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{background: "rgba(255,255,255)"}}>
          <div className="colFlex mainContainer thirdMarketingDiv">
            <div className="rowFlex featureSection">
              <div className="pictureDiv">
                (PICTURE HERE)
              </div>
              <div className="captionDiv">
                <h3>Taking too many pictures?</h3>
                <h4>Leave your phone, enjoy the moment</h4>
                <p>Remember allows you to add 3 photos for each memory.</p>
                <p>Don't waste your time taking the perfect shot. The photos are here to recall a memory in <b style={{color:"#6c90c7", borderBottom:"1px solid #6c90c7"}}>your</b> mind, not to get as many likes as possible.</p>
              </div>
            </div>
            <div className="rowFlex featureSection">
              <div className="captionDiv">
                <h3>Things you'd like to always remember?</h3>
                <h4>Memories are not only moment</h4>
                <p>Remember allows you to add many types of memories.</p>
                <p>Never forget the teacher that changed your life, the house you grew up in, your childhood dog, your favorite teenage song, a sentance your lover always says...</p>
              </div>
              <div>(PICTURE HERE)</div>
            </div>
            <div className="rowFlex featureSection">
              <div>(PICTURE HERE)</div>
              <div className="captionDiv">
                <h3>Can't tell where this photo was taken?</h3>
                <h4>Memories are so much more than just pictures</h4>
                <p>Besides the photos, Remember keep many other dimensions of your memories:</p>
                <ul>
                  <li>the date and place</li>
                  <li>the weather</li>
                  <li>the people that were with you</li>
                  <li>the situation of every people involved</li>
                  <li>a free space to add more details</li>
                </ul>
              </div>
            </div>
            <div className="rowFlex">
              <div>Focus sur le contexte</div>
              <div>(PICTURE HERE)</div>
            </div>
            <div className="rowFlex">
              <div>(PICTURE HERE)</div>
              <div>Search (by friend, map)</div>
            </div>
            <div className="rowFlex">
              <div>Focus sur le random</div>
              <div>(PICTURE HERE)</div>
            </div>
          </div>
        </div>

        <div className="mainContainer countingDiv">
          <span style={{color:"#6c90c7"}}>{this.state.numberOfMem}</span> memories uploaded and counting...
        </div>

      </div>
    )
  }
}
