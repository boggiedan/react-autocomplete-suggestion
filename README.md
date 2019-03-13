# react-autocomplete-suggestion

> React autocomplete component providing some default behaviors based on react-autosuggest.

[![NPM](https://img.shields.io/npm/v/react-autocomplete-suggestion.svg)](https://www.npmjs.com/package/react-autocomplete-suggestion) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-autocomplete-suggestion
```

## Usage

```jsx
import React, { Component } from 'react'

import Autocomplete from 'react-autocomplete-suggestion'

class Autocomplete extends Component {
  render () {
    return (
      <MyComponent
        placeholder="Search for a country"
        label="country"
        freeTextEnabled
        ignoreCase={false}
        suggestions={suggestions}
        value={value}
        onFetchSuggestions={this.onFetchSuggestions}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onChange={this.onChange}
        onSuggestionSelected={this.onSuggestionSelected}
        onExactMatchFound={this.onExactMatchFound}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        isInError
        helperText="An error occured during the fetch of the countries"
        fetchTimeoutTimer={300}
        theme={{
          suggestionHighlighted: {
              transition: "all 300ms ease-in-out",
              backgroundColor: "#EBEBEB"
          }
        }}
       />
    )
  }
}
```

## License

MIT © [Sukmanov Bogdan](https://github.com/boggiedan)
