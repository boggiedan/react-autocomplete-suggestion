import Typography from '@material-ui/core/Typography'
import React, { Component } from 'react'

import Autocomplete from 'react-autocomplete-suggestion'

const initialSuggestions = [
  { key: 0, label: 'Afghanistan' },
  { key: 2, label: 'Aland Islands' },
  { key: 3, label: 'Albania' },
  { key: 4, label: 'Algeria' },
  { key: 5, label: 'American Samoa' },
  { key: 6, label: 'Andorra' },
  { key: 7, label: 'Angola' },
  { key: 8, label: 'Anguilla' },
  { key: 9, label: 'Antarctica' },
  { key: 10, label: 'Antigua and Barbuda' },
  { key: 11, label: 'Argentina' },
  { key: 12, label: 'Armenia' },
  { key: 13, label: 'Aruba' },
  { key: 14, label: 'Australia' },
  { key: 15, label: 'Austria' },
  { key: 16, label: 'Azerbaijan' },
  { key: 17, label: 'Bahamas' },
  { key: 18, label: 'Bahrain' },
  { key: 19, label: 'Bangladesh' },
  { key: 20, label: 'Barbados' },
  { key: 21, label: 'Belarus' },
  { key: 22, label: 'Belgium' },
  { key: 23, label: 'Belize' },
  { key: 24, label: 'Benin' },
  { key: 25, label: 'Bermuda' },
  { key: 26, label: 'Bhutan' },
  { key: 27, label: 'Bolivia, Plurinational State of' },
  { key: 28, label: 'Bonaire, Sint Eustatius and Saba' },
  { key: 29, label: 'Bosnia and Herzegovina' },
  { key: 30, label: 'Botswana' },
  { key: 31, label: 'Bouvet Island' },
  { key: 32, label: 'Brazil' },
  { key: 33, label: 'British Indian Ocean Territory' },
  { key: 34, label: 'Brunei Darussalam' }
]

class App extends Component {
  state = {
    suggestions: [],
    value: ''
  }

  fetchItems = value => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    this.setState({
      suggestions: inputLength === 0 ? [] : initialSuggestions.filter(country =>
        country.label.toLowerCase().slice(0, inputLength) === inputValue)
    })
  }

  onChange = (event, value) => {
    this.setState({ value: value })
  }

  onSuggestionSelected = suggestion => {}

  onExactMatchFound = exactMatchSuggestion => {}

  onBlur = event => {}

  onFocus = event => {}

  render() {
    const { suggestions, value, helperText } = this.state

    return (

      <div className="App">
        <Typography variant="h3">Free text disabled and ignore case enabled</Typography>
        <Autocomplete
          placeholder="Search for a country"
          label="country"
          suggestions={suggestions}
          value={value}
          onFetchSuggestions={this.fetchItems}
          onChange={this.onChange}
          onSuggestionSelected={this.onSuggestionSelected}
          onExactMatchFound={this.onExactMatchFound}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          isInError={!!helperText}
          helperText={helperText}
          theme={{
            suggestionHighlighted: {
              backgroundColor: 'yellow'
            },

            highlight: {
              fontWeight: 'none',
              color: 'red'
            }
          }}
        />
        <Typography variant="h3">Free text enabled and ignore case enabled</Typography>
        <Autocomplete
          placeholder="Search for a country"
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
        <Typography variant="h3">Free text enabled and ignore case disabled</Typography>
        <Autocomplete
          placeholder="Search for a country"
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
    );
  }
}

export default App
