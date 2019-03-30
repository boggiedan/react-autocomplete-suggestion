import {
  withStyles,
  createStyles,
  Paper,
  TextField,
  Typography,
  Chip
} from "@material-ui/core";
import classNames from "classnames";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import { validKeys, TAB } from "./contants";

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

const styles = createStyles({
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

  inputContainer: {
    textAlign: "left"
  },

  chipInputContainer: {
    position: "relative",
    display: "inline-flex",
    flexFlow: "row wrap",
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
  },

  errorChipInputContainer: {
    "&:before": {
      content: '""',
      height: 1,
      backgroundColor: "#f44336"
    },

    "&:after": {
      content: '""',
      height: 2,
      backgroundColor: "#f44336",
      transform: "scaleX(0)",
      transition: "transform 200ms cubic-bezier(0.4, 0, 1, 1) 0ms"
    }
  },

  chipContainer: {
    marginTop: "auto",
    marginBottom: "auto"
  },

  chip: {
    marginTop: 2,
    marginBottom: 2,
    marginRight: 2
  },

  input: {
    flexGrow: 1,
    // FIXME Necessary if no label is passed
    // marginTop: 16,
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap"
  },

  helperText: {
    minHeight: "1em",
    marginTop: 8,
    lineHeight: "1em",
    fontSize: "0.75rem",
    color: "rgba(0, 0, 0, 0.54)"
  },

  errorMessage: {
    color: "#f44336"
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

    this.input = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let result = { ...prevState };

    if (nextProps.onExactMatchFound) {
      const { onExactMatchFound, suggestions, ignoreCase } = nextProps;
      const { exactMatchSuggestion, value } = prevState;
      const newExactMatchSuggestion = Autocomplete.getExactMatchSuggestion(
        suggestions,
        value,
        ignoreCase
      );

      if (
        newExactMatchSuggestion &&
        exactMatchSuggestion.key !== newExactMatchSuggestion.key
      ) {
        result = {
          ...result,
          exactMatchSuggestion: newExactMatchSuggestion
        };

        onExactMatchFound && onExactMatchFound(newExactMatchSuggestion);
      }
    }

    if (nextProps.errorMessage) {
      result = {
        ...result,
        isInError: true
      };
    }

    return result;
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

  shouldFocusOnInput = () => {
    const { lastPressedKey } = this.state;

    return lastPressedKey !== TAB;
  };

  getSuggestionValue = suggestion => suggestion.label;

  focusOnInput = () => {
    this.input.current.focus();
  };

  constructInputMessage = classes => {
    const { helperText, errorMessage } = this.props;
    const { isInError } = this.state;

    return isInError
      ? {
          classNames: {
            container: classNames(
              classes.chipInputContainer,
              classes.errorChipInputContainer
            ),
            message: classNames(classes.helperText, classes.errorMessage)
          },
          message: errorMessage
        }
      : {
          classNames: {
            container: classes.chipInputContainer,
            message: classes.helperText
          },
          message: helperText
        };
  };

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
        ? selectedSuggestions
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
    this.shouldFocusOnInput() && this.focusOnInput();
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

  onInputContainerFocus = event => {
    this.focusOnInput();
  };

  onChipDelete = label => event => {
    const { onSuggestionDeleted, ignoreCase } = this.props;
    const { selectedSuggestions } = this.state;
    const deletedSuggestion = Autocomplete.getExactMatchSuggestion(
      selectedSuggestions,
      label,
      ignoreCase
    );
    const newSelectedSuggestions = selectedSuggestions.filter(
      s => s.label !== label
    );

    this.setState({ selectedSuggestions: newSelectedSuggestions });
    onSuggestionDeleted &&
      onSuggestionDeleted(deletedSuggestion, newSelectedSuggestions);
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
    const { classes } = this.props;
    const { label } = selectedSuggestion;

    return (
      <div className={classes.chipContainer}>
        <Chip
          className={classes.chip}
          key={index}
          label={label}
          onDelete={this.onChipDelete(label)}
        />
      </div>
    );
  };

  renderInputComponent = inputProps => {
    const { classes, multiSelect } = this.props;
    const { selectedSuggestions } = this.state;
    const inputMessage = this.constructInputMessage(classes);

    return (
      <div className={classes.inputContainer}>
        <div
          className={inputMessage.classNames.container}
          onFocus={this.onInputContainerFocus}
        >
          {multiSelect && selectedSuggestions.map(this.renderChips)}
          <TextField
            inputRef={this.input}
            className={classes.input}
            InputProps={{ disableUnderline: true }}
            {...inputProps}
          />
        </div>
        <span className={inputMessage.classNames.message}>
          {inputMessage.message}
        </span>
      </div>
    );
  };

  render() {
    const props = this.props;
    const { value, isInError } = this.state;

    const inputProps = {
      placeholder: props.placeholder,
      label: props.label,
      value,
      error: isInError,
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

  helperText: PropTypes.string,

  errorMessage: PropTypes.string,

  fetchTimeoutTimer: PropTypes.number,

  onFetchSuggestions: PropTypes.func.isRequired,

  onSuggestionsClearRequested: PropTypes.func,

  onSuggestionSelected: PropTypes.func,

  onSuggestionDeleted: PropTypes.func,

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

  helperText: "",

  errorMessage: "",

  fetchTimeoutTimer: 200
};

export default withStyles(styles)(Autocomplete);
