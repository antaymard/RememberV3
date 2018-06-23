import React, { Component } from 'react';
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";


const MyMapComponent = compose(
  withProps({
    /**
     * Note: create and replace your own key in the Google console.
     * https://console.developers.google.com/apis/dashboard
     * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
     */
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCIZJxUd_-Nr_QzFw3AEuc2OOuYECk0Nnk&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `150px` }} />,
      mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap
)
(props => (
  <GoogleMap defaultZoom={15} defaultCenter={{ lat: props.lieu.latLng.lat, lng: props.lieu.latLng.lng }}>
    {props.isMarkerShown && (
      <Marker position={{ lat: props.lieu.latLng.lat, lng: props.lieu.latLng.lng }} />
    )}
  </GoogleMap>
));


export default class Maps extends Component {

  componentDidMount() {
    console.log('rendering maps');
  }

  render() {
    if (this.props.lieu && this.props.lieu.placeName && this.props.lieu.latLng) {
      return (
        <MyMapComponent
          isMarkerShown
          lieu = {this.props.lieu}
        />
      )
    } else {
      return <p>No place</p>
    }

  }
}
