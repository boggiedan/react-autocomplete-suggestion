import {
  withStyles,
  Paper,
  TextField,
  Typography,
  Chip
} from "@material-ui/core";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import { validKeys, TAB } from "./contants";

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const styles = theme => ({
  container: {
    position: "relative"
  },

  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    left: 0,
    right: 0
  },

  suggestion: {
    display: "block",
    padding: 10,
    textAlign: "left",
    cursor: "pointer"
  },

  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },

  suggestionHighlighted: {
    transition: "all 300ms ease-in-out",
    backgroundColor: "#EBEBEB"
  },

  highlight: {
    fontWeight: "bold"
  },

  chipInputContainer: {
    position: "relative",
    display: "inline-flex",
    width: "100%",
    minHeight: 40,
    cursor: "text",

    "&:before": {
      left: 0,
      right: 0,
      bottom: 0,
      height: 1,
      content: '""',
      position: "absolute",
      pointerEvents: "none",
      backgroundColor: "rgba(0, 0, 0, 0.42)"
    },

    "&:after": {
      left: 0,
      right: 0,
      bottom: 0,
      height: 2,
      content: '""',
      position: "absolute",
      transform: "scaleX(0)",
      transition: "transform 200ms cubic-bezier(0.4, 0, 1, 1) 0ms",
      pointerEvents: "none",
      backgroundColor: "#303f9f"
    },

    "&:focus-within:after": {
      transform: "scaleX(1)"
    }
  }
});

class Autocomplete extends Component {
  constructor(props) {
    super(props);

    const { value } = props;

    this.state = {
      fetchTimeout: null,
      value: value ? value : "",
      selectedSuggestion: null,
      selectedSuggestions: [],
      exactMatchSuggestion: null,
      lastPressedKey: null
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { onExactMatchFound, suggestions, ignoreCase } = props;
    const { exactMatchSuggestion, value } = state;
    const newExactMatchSuggestion = Autocomplete.getExactMatchSuggestion(
      suggestions,
      value,
      ignoreCase
    );

    if (
      newExactMatchSuggestion &&
      exactMatchSuggestion !== newExactMatchSuggestion
    ) {
      onExactMatchFound && onExactMatchFound(newExactMatchSuggestion);

      return {
        exactMatchSuggestion: newExactMatchSuggestion
      };
    }

    return null;
  }

  static formatValue(value, ignoreCase) {
    return ignoreCase ? value.trim().toLocaleLowerCase() : value.trim();
  }

  static isValueEqualsToSuggestion(suggestion, value, ignoreCase) {
    return (
      Autocomplete.formatValue(suggestion.label, ignoreCase) ===
      Autocomplete.formatValue(value, ignoreCase)
    );
  }

  static getExactMatchSuggestion(suggestions, value, ignoreCase) {
    if (!value || suggestions.length <= 0) return null;

    return suggestions.find(suggestion =>
      Autocomplete.isValueEqualsToSuggestion(suggestion, value, ignoreCase)
    );
  }

  hasExactMatch = () => {
    const { exactMatchSuggestion } = this.state;

    return !!exactMatchSuggestion;
  };

  isValidPressedKey(pressedKey) {
    return validKeys.includes(pressedKey);
  }

  containsSuggestion = (selectedSuggestions, suggestion) => {
    return selectedSuggestions.includes(suggestion);
  };

  shouldValueBeClearedOnKeyDown = pressedKey => {
    const { freeTextEnabled } = this.props;

    return freeTextEnabled
      ? false
      : this.isValidPressedKey(pressedKey) && !this.hasExactMatch();
  };

  shouldValueBeClearedOnBlur = () => {
    const { lastPressedKey } = this.state;
    const { freeTextEnabled } = this.props;

    return !freeTextEnabled && !this.isValidPressedKey(lastPressedKey);
  };

  getSuggestionValue = suggestion => suggestion.label;

  onSuggestionsFetchRequested = ({ value }) => {
    const { onFetchSuggestions, fetchTimeoutTimer } = this.props;

    if (onFetchSuggestions) {
      this.state.fetchTimeoutTimer &&
        clearTimeout(this.state.fetchTimeoutTimer);
      this.setState({
        fetchTimeoutTimer: setTimeout(() => {
          onFetchSuggestions(value);
        }, fetchTimeoutTimer)
      });
    }
  };

  onSuggestionsClearRequested = () => {
    const { onSuggestionsClearRequested } = this.props;

    onSuggestionsClearRequested && onSuggestionsClearRequested();
  };

  onMultiSelectSuggestionSelected = (suggestion, onSuggestionSelected) => {
    const { allowDuplicateSelection } = this.props;
    const { selectedSuggestions } = this.state;
    const newSelectedSuggestions =
      !allowDuplicateSelection &&
      this.containsSuggestion(selectedSuggestions, suggestion)
        ? [...selectedSuggestions]
        : [...selectedSuggestions, suggestion];

    this.setState({
      value: "",
      selectedSuggestion: suggestion,
      selectedSuggestions: newSelectedSuggestions
    });

    onSuggestionSelected &&
      onSuggestionSelected(suggestion, newSelectedSuggestions);
  };

  onSingleSelectSuggestionSelected = (suggestion, onSuggestionSelected) => {
    this.setState({
      value: suggestion.label,
      selectedSuggestion: suggestion
    });

    onSuggestionSelected && onSuggestionSelected(suggestion);
  };

  onSuggestionSelected = (event, { suggestion }) => {
    const { multiSelect, onSuggestionSelected } = this.props;

    multiSelect
      ? this.onMultiSelectSuggestionSelected(suggestion, onSuggestionSelected)
      : this.onSingleSelectSuggestionSelected(suggestion, onSuggestionSelected);
  };

  onChange = (event, { newValue }) => {
    const { onChange } = this.props;

    this.setState({
      value: newValue,
      selectedSuggestion: null,
      exactMatchSuggestion: null,
      lastPressedKey: null
    });
    onChange && onChange(event, newValue);
  };

  onKeyDown = event => {
    this.setState({ lastPressedKey: event.key });

    if (this.shouldValueBeClearedOnKeyDown(event.key)) {
      event.preventDefault();
      this.onChange(event, { newValue: "" });
    } else if (event.key === TAB) {
      const { exactMatchSuggestion } = this.state;

      exactMatchSuggestion &&
        this.onSuggestionSelected(event, { suggestion: exactMatchSuggestion });
    }
  };

  onBlur = event => {
    const { onBlur } = this.props;

    if (this.shouldValueBeClearedOnBlur()) {
      this.onChange(event, { newValue: "" });
    }

    onBlur && onBlur(event);
  };

  onFocus = event => {
    const { onFocus } = this.props;

    onFocus && onFocus(event);
  };

  onChipDelete = event => {
    const { selectedSuggestions } = this.state;

    console.log(event.target.value);
  };

  renderHighlights = (part, index) => {
    const { classes } = this.props;
    const className = part.highlight ? classes.highlight : null;

    return (
      <span className={className} key={index}>
        {part.text}
      </span>
    );
  };

  renderSuggestion = (suggestion, { query }) => {
    const { label } = suggestion;
    const matches = AutosuggestHighlightMatch(label, query);
    const parts = AutosuggestHighlightParse(label, matches);

    return <Typography noWrap>{parts.map(this.renderHighlights)}</Typography>;
  };

  renderSuggestionsContainer = options => {
    return (
      <Paper {...options.containerProps} square>
        {options.children}
      </Paper>
    );
  };

  renderChips = (selectedSuggestion, index) => {
    const { label, key } = selectedSuggestion;
    const { allowDuplicateSelection } = this.props;

    return (
      <Chip
        key={allowDuplicateSelection ? index : key}
        label={label}
        onDelete={this.onChipDelete}
      />
    );
  };

  renderMultiSelectInputComponent = (inputProps, selectedSuggestions) => {
    const { classes } = this.props;

    return (
      <div className={classes.chipInputContainer}>
        {selectedSuggestions.map(this.renderChips)}
        <TextField InputProps={{ disableUnderline: true }} {...inputProps} />
      </div>
    );
  };

  renderSingleSelectInputComponent = inputProps => {
    return <TextField {...inputProps} />;
  };

  renderInputComponent = inputProps => {
    const { multiSelect } = this.props;

    return multiSelect
      ? this.renderMultiSelectInputComponent(
          inputProps,
          this.state.selectedSuggestions
        )
      : this.renderSingleSelectInputComponent(inputProps);
  };

  render() {
    const props = this.props;
    const { value } = this.state;

    const inputProps = {
      placeholder: props.placeholder,
      label: props.label,
      value,
      error: props.isInError,
      fullWidth: true,
      helperText: props.helperText,
      margin: "normal",
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      onKeyDown: this.onKeyDown
    };

    const autosuggestProps = {
      inputProps,
      theme: {
        container: props.classes.container,
        suggestionsContainerOpen: props.classes.suggestionsContainerOpen,
        suggestion: props.classes.suggestion,
        suggestionsList: props.classes.suggestionsList,
        suggestionHighlighted: props.classes.suggestionHighlighted,
        highlight: props.classes.highlight
      },
      renderInputComponent: this.renderInputComponent,
      renderSuggestion: this.renderSuggestion,
      renderSuggestionsContainer: this.renderSuggestionsContainer,
      suggestions: props.suggestions,
      onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.onSuggestionsClearRequested,
      onSuggestionSelected: this.onSuggestionSelected,
      getSuggestionValue: this.getSuggestionValue
    };

    return <Autosuggest {...autosuggestProps} />;
  }
}

Autocomplete.propTypes = {
  classes: PropTypes.object.isRequired,

  theme: PropTypes.object,

  placeholder: PropTypes.string,

  label: PropTypes.string,

  value: PropTypes.string,

  freeTextEnabled: PropTypes.bool,

  ignoreCase: PropTypes.bool,

  multiSelect: PropTypes.bool,

  allowDuplicateSelection: PropTypes.bool,

  isInError: PropTypes.bool,

  helperText: PropTypes.string,

  fetchTimeoutTimer: PropTypes.number,

  onFetchSuggestions: PropTypes.func.isRequired,

  onSuggestionsClearRequested: PropTypes.func,

  onSuggestionSelected: PropTypes.func,

  onChange: PropTypes.func,

  onBlur: PropTypes.func,

  onFocus: PropTypes.func,

  onExactMatchFound: PropTypes.func,

  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired
    })
  )
};

Autocomplete.defaultProps = {
  suggestions: [],

  freeTextEnabled: false,

  ignoreCase: true,

  multiSelect: false,

  allowDuplicateSelection: false,

  isInError: false,

  helperText: "",

  fetchTimeoutTimer: 200
};

export default withStyles(styles)(Autocomplete);
