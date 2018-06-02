import { combineReducers } from 'redux';

import svnr from './svnrReducer';
import user from ';/userReducer';

export default combineReducers({
  svnr,
  user
})
