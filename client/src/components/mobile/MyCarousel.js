import React, { Component } from 'react';
import { CarouselProvider, Slider, Slide, Image } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import Dialog from '@material-ui/core/Dialog';

const style = {
  img : {
    height : "100%",
    width : "100%",
    objectFit : 'cover',
    // boxShadow : '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    borderRadius : '2px',
    paddingRight: '1px',
  },
  fullFrameImg : {
    height : 'auto',
    width : '100%',
    borderRadius : '2px',

  }
}

export default class MyCarousel extends Component {

  state = {
    open : false,
    fullFrameUrl : undefined,
    currentSlide : 0
  }

  displayFullFrameImage = (e) => {
    if (this.props.clickable) {
      var index = this.props.images.indexOf(e.target.src);
      this.setState({ fullFrameUrl : e.target.src });
      this.setState({ currentSlide : index })
      this.setState({ open : true });
    }
  }

  handleClose = () => {
    this.setState({ open : false });
    this.setState({ currentSlide : this.state.currentSlide})
  }

  renderImages = () => {
    return this.props.images.map((a, i) => (
      <Slide key={a} index={i}>
        <Image style={style.img} alt="Souvenir"
          src={a} onClick={this.displayFullFrameImage}/>
      </Slide>
    ))
  }


  render() {
    return (
      <div>
        <CarouselProvider
          naturalSlideWidth={50}
          naturalSlideHeight={50}
          totalSlides={this.props.images.length}
          // lockOnWindowScroll = {true}
          currentSlide = {this.state.currentSlide}
          style={{margin : "0 -7px"}}>
          <Slider
            style = {{padding: '0 7px'}}
          >
            {this.renderImages()}
          </Slider>
        </CarouselProvider>
        <Dialog
          // fullScreen
          open={this.state.open}
          onClose={this.handleClose}
          // TransitionComponent={Transition}
        >
          <img alt="Souvenir" style={style.fullFrameImg}
            src={this.state.fullFrameUrl}/>

        </Dialog>
      </div>
    );
  }
}
