import React, { Component } from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';

import { BrowserRouter, Route } from 'react-router-dom';

import './App.css';

import MobileView from './components/mobile/MobileView.js';
import FocusSouvenir from './components/mobile/focus/FocusSouvenir.js';
import Edit from './components/mobile/edit/Edit.js';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#6c90c7',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contast with palette.primary.main
    },
    secondary: {
      // light: '#0066ff',
      main: '#80deea',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#FFFFFF',
    },
    // error: will use the default color
  },
});


class App extends Component {

  state = {
    displayType : ""
  }

  componentDidMount() {
    this.detectDisplaySize();
  }

  detectDisplaySize = () => {
    if ( window.innerWidth <= 800 && window.innerHeight <= 850 ) {
      this.setState({ displayType : "mobile"});
    } else {
      this.setState({ displayType : "desktop"});
    }
  }


  render() {

    if (this.state.displayType === "mobile") {
      return (
        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
            <div>
              <Route exact path="/" component={MobileView} />
              <Route path="/svnr/:id" render={(id) => <FocusSouvenir id={id.match}/>} />
              <Route path='/create' component={Edit}/>
            </div>
          </BrowserRouter>
        </MuiThemeProvider>
      );
    } else {
      return (
        <MuiThemeProvider theme={theme}>
          AUTRE
        </MuiThemeProvider>
      );
    }
  }
}

export default App;
