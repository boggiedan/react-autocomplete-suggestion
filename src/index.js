import { Paper, TextField, Typography } from '@material-ui/core'
import AutosuggestHighlightMatch from 'autosuggest-highlight/match'
import AutosuggestHighlightParse from 'autosuggest-highlight/parse'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'
import { validKeys } from './contants'
import { constructCustomTheme } from './defaultTheme'

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true

class Autocomplete extends Component {
  constructor(props) {
    super(props)

    const { value, theme } = props

    this.state = {
      fetchTimeout: null,
      value: value || '',
      selectedSuggestion: null,
      exactMatchSuggestion: null,
      lastPressedKey: null,
      theme: constructCustomTheme(theme)
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { onExactMatchFound, suggestions, ignoreCase } = props
    const { exactMatchSuggestion, value } = state
    const newExactMatchSuggestion = Autocomplete.getExactMatchSuggestion(suggestions, value, ignoreCase)

    if (newExactMatchSuggestion && exactMatchSuggestion !== newExactMatchSuggestion) {
      onExactMatchFound && onExactMatchFound(newExactMatchSuggestion)

      return {
        exactMatchSuggestion: newExactMatchSuggestion
      }
    }

    return null
  }

  static formatValue(value, ignoreCase) {
    return ignoreCase ? value.trim().toLocaleLowerCase() : value.trim()
  };

  static isValueEqualsToSuggestion(suggestion, value, ignoreCase) {
    return Autocomplete.formatValue(suggestion.label, ignoreCase) === Autocomplete.formatValue(value, ignoreCase)
  };

  static getExactMatchSuggestion(suggestions, value, ignoreCase) {
    if (!value || suggestions.length <= 0) return null

    return suggestions.find(suggestion => Autocomplete.isValueEqualsToSuggestion(suggestion, value, ignoreCase))
  };

  hasExactMatch = () => {
    const { exactMatchSuggestion } = this.state

    return !!exactMatchSuggestion
  }

  isValidPressedKey(pressedKey) {
    return validKeys.includes(pressedKey)
  }

  shouldValueBeClearedOnKeyDown = pressedKey => {
    const { freeTextEnabled } = this.props

    return freeTextEnabled ? false : this.isValidPressedKey(pressedKey) && !this.hasExactMatch()
  }

  shouldValueBeClearedOnBlur = () => {
    const { lastPressedKey } = this.state
    const { freeTextEnabled } = this.props

    return !freeTextEnabled && !this.isValidPressedKey(lastPressedKey)
  }

  getSuggestionValue = suggestion => suggestion.label

  onSuggestionsFetchRequested = ({ value }) => {
    const { onFetchSuggestions, fetchTimeoutTimer } = this.props

    if (onFetchSuggestions) {
      this.state.fetchTimeoutTimer && clearTimeout(this.state.fetchTimeoutTimer)
      this.setState({
        fetchTimeoutTimer: setTimeout(() => {
          onFetchSuggestions(value)
        }, fetchTimeoutTimer)
      })
    }
  }

  onSuggestionsClearRequested = () => {
    const { onSuggestionsClearRequested } = this.props

    onSuggestionsClearRequested && onSuggestionsClearRequested()
  }

  onSuggestionSelected = (event, { suggestion }) => {
    const { onSuggestionSelected } = this.props
    const { selectedSuggestion } = this.state

    if (suggestion !== selectedSuggestion) {
      this.setState({
        value: suggestion.label,
        selectedSuggestion: suggestion
      })
      onSuggestionSelected && onSuggestionSelected(suggestion)
    }
  }

  onChange = (event, { newValue }) => {
    const { onChange } = this.props

    this.setState({
      value: newValue,
      selectedSuggestion: null,
      exactMatchSuggestion: null,
      lastPressedKey: null
    })
    onChange && onChange(event, newValue)
  }

  onKeyDown = event => {
    this.setState({ lastPressedKey: event.key })

    if (this.shouldValueBeClearedOnKeyDown(event.key)) {
      event.preventDefault()
      this.onChange(event, { newValue: '' })
    } else if (this.isValidPressedKey(event.key)) {
      const { exactMatchSuggestion } = this.state

      exactMatchSuggestion && this.onSuggestionSelected(event, { suggestion: exactMatchSuggestion })
    }
  }

  onBlur = event => {
    const { onBlur } = this.props

    if (this.shouldValueBeClearedOnBlur()) {
      this.onChange(event, { newValue: '' })
    }

    onBlur && onBlur(event)
  }

  onFocus = event => {
    const { onFocus } = this.props

    onFocus && onFocus(event)
  }

  renderHighlights = (part, index) => {
    const { theme } = this.state
    const className = part.highlight ? theme.highlight : null

    return (
      <span key={index} style={{ ...className }}>
        {part.text}
      </span>
    )
  }

  renderSuggestion = (suggestion, { query }) => {
    const { label } = suggestion
    const matches = AutosuggestHighlightMatch(label, query)
    const parts = AutosuggestHighlightParse(label, matches)

    return <Typography noWrap>{parts.map(this.renderHighlights)}</Typography>
  }

  renderSuggestionsContainer = options => {
    return (
      <Paper {...options.containerProps} square>
        {options.children}
      </Paper>
    )
  }

  renderInputComponent = inputProps => {
    return <TextField fullWidth margin="normal" {...inputProps}/>
  };

  render() {
    const props = this.props
    const { value, theme } = this.state

    const inputProps = {
      placeholder: props.placeholder,
      label: props.label,
      value,
      error: props.isInError,
      helperText: props.helperText,
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      onKeyDown: this.onKeyDown
    }

    const autosuggestProps = {
      inputProps,
      theme,
      renderInputComponent: this.renderInputComponent,
      renderSuggestion: this.renderSuggestion,
      renderSuggestionsContainer: this.renderSuggestionsContainer,
      suggestions: props.suggestions,
      onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.onSuggestionsClearRequested,
      onSuggestionSelected: this.onSuggestionSelected,
      getSuggestionValue: this.getSuggestionValue
    }

    return (
      <Autosuggest
        {...autosuggestProps}
      />
    );
  }
}

Autocomplete.propTypes = {
  theme: PropTypes.object,

  placeholder: PropTypes.string,

  label: PropTypes.string,

  value: PropTypes.string,

  freeTextEnabled: PropTypes.bool,

  ignoreCase: PropTypes.bool,

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
  ).isRequired
}

Autocomplete.defaultProps = {
  suggestions: [],

  freeTextEnabled: false,

  ignoreCase: true,

  isInError: false,

  helperText: '',

  fetchTimeoutTimer: 200
}

export default Autocomplete
