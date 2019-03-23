import {
  Button,
  Chip,
  FormControl,
  Input,
  InputLabel,
  Paper,
  Typography,
  withStyles,
  TextField
} from "@material-ui/core";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import Autocomplete from "react-autocomplete-suggestion";

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

const styles = () => ({
  header: {
    height: "auto",
    textAlign: "center",
    backgroundColor: "#37C0C8",
    padding: 20,
    marginBottom: 20
  },

  headerText: {
    color: "#FFFFFF"
  },

  container: {
    display: "flex",
    padding: 10
  },

  contentContainer: {
    width: "65%",
    height: 780,
    padding: 10,
    marginRight: 5
  },

  autocomplete: {
    width: "70%",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 5,
    textAlign: "center"
  },

  logsContainer: {
    width: "35%",
    height: 780,
    padding: 10,
    marginLeft: 5
  },

  logsTitle: {
    textAlign: "center"
  },

  logs: {
    width: "100%",
    height: 720,
    maxHeight: 720,
    overflow: "auto"
  },

  buttonContainer: {
    marginTop: 5
  },

  logsButton: {
    display: "block",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto"
  },

  inputContainer: {
    position: "relative",
    width: "100%"
  }
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
      value: "",
      logKey: 0,
      logEntries: ""
    };
    this.scrollBottom = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.scrollLogsToBottom();
  }

  scrollLogsToBottom = () => {
    this.scrollBottom.current.scrollIntoView({
      block: "end",
      inline: "nearest",
      behavior: "smooth"
    });
  };

  fetchItems = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const newLogKey = this.state.logKey + 1;

    this.setState(state => ({
      suggestions:
        inputLength === 0
          ? []
          : initialSuggestions.filter(
              country =>
                country.label.toLowerCase().slice(0, inputLength) === inputValue
            ),
      logKey: newLogKey,
      logEntries: [
        ...state.logEntries,
        <p key={newLogKey}>
          > On fetch suggestions event called with value: {value}
        </p>
      ]
    }));
  };

  onChange = (event, value) => {
    const newLogKey = this.state.logKey + 1;

    this.setState(state => ({
      value: value,
      logKey: newLogKey,
      logEntries: [
        ...state.logEntries,
        <p key={newLogKey}> > On change event called with value: {value}</p>
      ]
    }));
  };

  onSuggestionSelected = suggestion => {
    const newLogKey = this.state.logKey + 1;

    this.setState(state => ({
      logKey: newLogKey,
      logEntries: [
        ...state.logEntries,
        <p key={newLogKey}>
          {" "}
          > On suggestion selected event called with label: {
            suggestion.label
          }{" "}
          and key: {suggestion.key}
        </p>
      ]
    }));
  };

  onExactMatchFound = exactMatchSuggestion => {
    const newLogKey = this.state.logKey + 1;

    this.setState(state => ({
      logKey: newLogKey,
      logEntries: [
        ...state.logEntries,
        <p key={newLogKey}>
          {" "}
          > On exact match event called with label: {
            exactMatchSuggestion.label
          }{" "}
          and key: {exactMatchSuggestion.key}
        </p>
      ]
    }));
  };

  onBlur = event => {
    const newLogKey = this.state.logKey + 1;

    this.setState(state => ({
      logKey: newLogKey,
      logEntries: [
        ...state.logEntries,
        <p key={newLogKey}> > On blur event called</p>
      ]
    }));
  };

  onFocus = event => {
    const newLogKey = this.state.logKey + 1;

    this.setState(state => ({
      logKey: newLogKey,
      logEntries: [
        ...state.logEntries,
        <p key={newLogKey}> > On focus event called</p>
      ]
    }));
  };

  onClearLogsClick = event => {
    this.setState({
      logKey: 0,
      logEntries: ""
    });
  };

  render() {
    const { classes } = this.props;
    const { suggestions, value, logEntries } = this.state;

    return (
      <Fragment>
        <div className={classes.header}>
          <Typography className={classes.headerText} variant="h1">
            react-autocomplete-suggestion example
          </Typography>
        </div>
        <div className={classes.container}>
          <Paper className={classes.contentContainer}>
            <div className={classes.autocomplete}>
              <Typography variant="title">
                Autocomplete with multi selecttion
              </Typography>
              <Autocomplete
                placeholder="Type 'a' or 'b'"
                label="country"
                suggestions={suggestions}
                value={value}
                onFetchSuggestions={this.fetchItems}
                onChange={this.onChange}
                onSuggestionSelected={this.onSuggestionSelected}
                onExactMatchFound={this.onExactMatchFound}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                multiSelect
              />
            </div>

            <div className={classes.autocomplete}>
              <Typography variant="title">
                Autocomplete with custom theme
              </Typography>
              <Autocomplete
                placeholder="Type 'a' or 'b'"
                label="country"
                suggestions={suggestions}
                value={value}
                onFetchSuggestions={this.fetchItems}
                onChange={this.onChange}
                onSuggestionSelected={this.onSuggestionSelected}
                onExactMatchFound={this.onExactMatchFound}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                theme={{
                  suggestionHighlighted: {
                    backgroundColor: "yellow"
                  },

                  highlight: {
                    fontWeight: "none",
                    color: "red"
                  }
                }}
              />
            </div>
            <div className={classes.autocomplete}>
              <Typography variant="title">Autocomplete in error</Typography>
              <Autocomplete
                placeholder="Type 'a' or 'b'"
                label="country"
                suggestions={suggestions}
                value={value}
                onFetchSuggestions={this.fetchItems}
                onChange={this.onChange}
                onSuggestionSelected={this.onSuggestionSelected}
                onExactMatchFound={this.onExactMatchFound}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                isInError
                helperText="An error occurred"
              />
            </div>
            <div className={classes.autocomplete}>
              <Typography variant="title">
                Free text disabled and ignore case enabled
              </Typography>
              <Typography>
                The value will be cleared if the user does not select it by
                click, enter or tab.
              </Typography>
              <Typography>
                An exact match can be found with <b>case insensitive</b>{" "}
                matching.
              </Typography>
              <Autocomplete
                placeholder="Type 'a' or 'b'"
                label="country"
                suggestions={suggestions}
                value={value}
                onFetchSuggestions={this.fetchItems}
                onChange={this.onChange}
                onSuggestionSelected={this.onSuggestionSelected}
                onExactMatchFound={this.onExactMatchFound}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
              />
            </div>
            <div className={classes.autocomplete}>
              <Typography variant="title">
                Free text disabled and ignore case disabled
              </Typography>
              <Typography>
                The value will be cleared if the user does not select it by
                click, enter or tab.
              </Typography>
              <Typography>
                An exact match can be found with <b>case sensitive</b> matching.
              </Typography>
              <Autocomplete
                placeholder="Type 'a' or 'b'"
                label="country"
                ignoreCase={false}
                suggestions={suggestions}
                value={value}
                onFetchSuggestions={this.fetchItems}
                onChange={this.onChange}
                onSuggestionSelected={this.onSuggestionSelected}
                onExactMatchFound={this.onExactMatchFound}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
              />
            </div>
            <div className={classes.autocomplete}>
              <Typography variant="title">
                Free text enabled and ignore case enabled
              </Typography>
              <Typography>
                The value won't be cleared if the user does not select it by
                click, enter or tab.
              </Typography>
              <Typography>
                An exact match can be found with <b>case insensitive</b>{" "}
                matching.
              </Typography>
              <Autocomplete
                placeholder="Type 'a' or 'b'"
                label="country"
                freeTextEnabled
                suggestions={suggestions}
                value={value}
                onFetchSuggestions={this.fetchItems}
                onChange={this.onChange}
                onSuggestionSelected={this.onSuggestionSelected}
                onExactMatchFound={this.onExactMatchFound}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
              />
            </div>
            <div className={classes.autocomplete}>
              <Typography variant="title">
                Free text enabled and ignore case disabled
              </Typography>
              <Typography>
                The value won't be cleared if the user does not select it by
                click, enter or tab.
              </Typography>
              <Typography>
                An exact match can be found with <b>case sensitive</b> matching.
              </Typography>
              <Autocomplete
                placeholder="Type 'a' or 'b'"
                label="country"
                freeTextEnabled
                ignoreCase={false}
                suggestions={suggestions}
                value={value}
                onFetchSuggestions={this.fetchItems}
                onChange={this.onChange}
                onSuggestionSelected={this.onSuggestionSelected}
                onExactMatchFound={this.onExactMatchFound}
                onBlur={this.onBlur}
                onFocus={this.onFocus}
              />
            </div>
          </Paper>
          <Paper className={classes.logsContainer}>
            <Typography className={classes.logsTitle} variant="title">
              Logs
            </Typography>
            <div className={classes.logs}>
              {logEntries}
              <div ref={this.scrollBottom} />
            </div>
            <div className={classes.buttonContainer}>
              <Button
                variant="outlined"
                className={classes.logsButton}
                onClick={this.onClearLogsClick}
              >
                Clear logs
              </Button>
            </div>
          </Paper>
        </div>
      </Fragment>
    );
  }
}

Autocomplete.PropTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
