import React, { Component } from 'react';

import ProfilePic from './ProfilePic.js';

const style = {
  marginRight : '-10px'
}

export default class CollapsedPic extends Component {

  componentDidMount() {
  }

  renderCollapsedProfilePics = () => {
    return this.props.images.map(a => (
      <ProfilePic key={a.photo_address} imgAddress={a.photo_address} style={style}/>
    ))
  }



  render() {
    return (
      <div className='rowFlex'>
        {this.renderCollapsedProfilePics()}
      </div>
    )
  }
}
