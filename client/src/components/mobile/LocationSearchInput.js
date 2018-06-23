import React, { Component } from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import TextField from '@material-ui/core/TextField';

const style = {
  locationSearchInput : {
    width : '100%',
    position : 'relative',
  },
  suggestionsContainer : {
    backgroundColor : "white",
    position : "absolute",
    width : '90%',
    borderRadius : '2px',
    zIndex : '99',
    boxShadow : '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    // border : '1px solid black'
  },
  suggestionsItem : {
    padding : '8px 5px',
    fontSize : '15px',
    borderBottom : '1px solid #CFD8DC',
  },
  // suggestionsItemActive : {
  //   backgroundColor : 'red',
  //   paddingLeft : '10px',
  // }
}

export default class LocationSearchInput extends Component {
  state = {
    placeName: this.props.placeName
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.placeName != this.props.placeName) {
      this.setState({ placeName : nextProps.placeName })
    }
  }

  handleChange = (placeName) => {
    this.setState({ placeName })
  }

  handleSelect = (placeName) => {
    this.setState({ placeName });
    geocodeByAddress(placeName)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        // console.log(latLng)
        this.props.sendAddressToParent({
          latLng : latLng,
          placeName : placeName
        })
      })
      .catch(error => console.error('Error', error))
  }

  render() {
    console.log(this.state);
    return (
      <PlacesAutocomplete
        value={this.state.placeName}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div>
            <TextField
              style={style.locationSearchInput}
              label="Lieu"
              type="text"
              {...getInputProps({
                // placeholder: this.props.placeName,
                // className ??
              })}
            />
            <div style={style.suggestionsContainer}>

              {suggestions.map(suggestion => {
                // const style2 = suggestion.active ? style.suggestionsItemActive : style.suggestionsItem;
                // inline style for demonstration purpose
                // const style = suggestion.active
                //             ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                //             : { backgroundColor: '#ffffff', cursor: 'pointer' };
                // console.log(suggestion)
                return (
                  <div {...getSuggestionItemProps(suggestion, { })} style={style.suggestionsItem}>
                    <span style={style.suggestionsItem}>{suggestion.description}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}
