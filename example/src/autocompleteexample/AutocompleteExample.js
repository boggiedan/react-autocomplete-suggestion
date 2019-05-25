import React, { Component } from "react";
import PropTypes from "prop-types";

const initialSuggestions = [
  { key: 0, label: "Afghanistan" },
  { key: 2, label: "Aland Islands" },
  { key: 3, label: "Albania" },
  { key: 4, label: "Algeria" },
  { key: 5, label: "American Samoa" },
  { key: 6, label: "Andorra" },
  { key: 7, label: "Angola" },
  { key: 8, label: "Anguilla" },
  { key: 9, label: "Antarctica" },
  { key: 10, label: "Antigua and Barbuda" },
  { key: 11, label: "Argentina" },
  { key: 12, label: "Armenia" },
  { key: 13, label: "Aruba" },
  { key: 14, label: "Australia" },
  { key: 15, label: "Austria" },
  { key: 16, label: "Azerbaijan" },
  { key: 17, label: "Bahamas" },
  { key: 18, label: "Bahrain" },
  { key: 19, label: "Bangladesh" },
  { key: 20, label: "Barbados" },
  { key: 21, label: "Belarus" },
  { key: 22, label: "Belgium" },
  { key: 23, label: "Belize" },
  { key: 24, label: "Benin" },
  { key: 25, label: "Bermuda" },
  { key: 26, label: "Bhutan" },
  { key: 27, label: "Bolivia, Plurinational State of" },
  { key: 28, label: "Bonaire, Sint Eustatius and Saba" },
  { key: 29, label: "Bosnia and Herzegovina" },
  { key: 30, label: "Botswana" },
  { key: 31, label: "Bouvet Island" },
  { key: 32, label: "Brazil" },
  { key: 33, label: "British Indian Ocean Territory" },
  { key: 34, label: "Brunei Darussalam" }
];

class AutocompleteExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSuggestions: [],
      suggestions: [],
      value: ""
    };
  }

  fetchItems = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    this.setState(state => ({
      suggestions:
        inputLength === 0
          ? []
          : initialSuggestions.filter(
              country =>
                country.label.toLowerCase().slice(0, inputLength) === inputValue
            )
    }));
  };

  onChangeHandler = (event, value) => {};

  onSuggestionSelectedHandler = (selectedSuggestion, selectedSuggestions) => {};

  onSuggestionDeletedHandler = (deletedSuggestion, selectedSuggestions) => {};

  onExactMatchFoundHandler = exactMatchSuggestion => {};

  onBlurHandler = event => {};

  onFocusHandler = event => {};

  render() {
    return <div />;
  }
}

AutocompleteExample.propropTypes = {
  AutocompleteComponent: PropTypes.node.isRequired,

  newLogAction: PropTypes.func.isRequired
};

export default AutocompleteExample;
