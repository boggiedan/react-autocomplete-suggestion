import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles, Typography } from "@material-ui/core";

const style = theme => ({
  autocompleteContainer: theme.container.autocomplete
});

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

    React.cloneElement(props.autocompleteComponent, {
      onFetchSuggestions: this.onFetchItems,
      onSuggestionsClearRequested: this.onSuggestionsClearRequested,
      onSuggestionSelected: this.onSuggestionSelected,
      onSuggestionDeleted: this.onSuggestionDeleted,
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      onExactMatchFound: this.onExactMatchFound
    });

    this.state = {
      suggestions: [],
      selectedSuggestions: [],
      value: ""
    };
  }

  onExactMatchFound = exactMatchSuggestion => {
    this.props.onNewLog(
      `on exact match event called with suggestion label: ${
        exactMatchSuggestion.label
      } and key: ${exactMatchSuggestion.key}`
    );
  };

  onFetchItems = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    this.setState({
      suggestions:
        inputLength === 0
          ? []
          : initialSuggestions.filter(
              country =>
                country.label.toLowerCase().slice(0, inputLength) === inputValue
            )
    });
    this.props.onNewLog(
      `on fetch suggestions event called with value: ${value}`
    );
  };

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
    this.props.onNewLog(`on suggestion clear event called`);
  };

  onChange = (event, value) => {
    this.setState({ value: value });
    this.props.onNewLog(`on change event called with value: ${value}`);
  };

  onSuggestionSelected = (selectedSuggestion, selectedSuggestions) => {
    let newState = { ...this.state };

    if (selectedSuggestions) {
      newState = {
        ...newState,
        selectedSuggestions: selectedSuggestions
      };
    }

    newState = {
      ...newState,
      selectedSuggestion: selectedSuggestion
    };

    this.setState({ ...newState });
    this.props.onNewLog(
      `on suggestion selected event called with new suggestion label: ${
        selectedSuggestion.label
      } and key: ${selectedSuggestion.key}`
    );
  };

  onSuggestionDeleted = (deletedSuggestion, selectedSuggestions) => {
    this.setState({ selectedSuggestions: selectedSuggestions });
    this.props.onNewLog(
      `on suggestion deleted event called with deleted suggestion label: ${
        deletedSuggestion.label
      } and key: ${deletedSuggestion.key}`
    );
  };

  onBlur = event => {
    this.props.onNewLog(`on blur event called`);
  };

  onFocus = event => {
    this.props.onNewLog(`on focus event called`);
  };

  render() {
    const { classes, autocompleteComponent } = this.props;

    return (
      <div className={classes.autocompleteContainer}>
        <Typography variant="title">{autocompleteComponent.title}</Typography>
        {autocompleteComponent.component}
      </div>
    );
  }
}

AutocompleteExample.propTypes = {
  classes: PropTypes.object.isRequired,

  title: PropTypes.string.isRequired,

  autocompleteComponent: PropTypes.object.isRequired,

  onNewLog: PropTypes.func.isRequired
};

export default withStyles(style)(AutocompleteExample);
