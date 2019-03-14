# react-autocomplete-suggestion

> React autocomplete component providing some default behaviors based on react-autosuggest.

[![NPM](https://img.shields.io/npm/v/react-autocomplete-suggestion.svg)](https://www.npmjs.com/package/react-autocomplete-suggestion) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Behavior

* The component can notify when an exact match has been found even if the user did not select a suggestion

* The exact match search for suggestion can be done in case sensitive or not

* The component can keep the entered value even if no suggestion has been selected or clear it if free text functionality is disabled

* The component does not filter the suggestion, it is developer's responsibility to implement the way it has to be filtered

* A timer of default 200ms is set on fetch of new suggestions to avoid making the request on type of each letter (useful when the filtering of the suggestions is made in the backend)
 
* In error property can be set to put the input component in red

* A helper text can be set (useful to display error messages) 

* A custom theme can be set

* A suggestion can be selected by click, enter or tab key

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
      <Autocomplete
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

## Props

| Prop | Type | Required | Default value | Description |
| :--- | :--- | :--- | :---: | :--- |
| theme | Object | | [default theme](#default-theme) | Prop to add or override the default theme |
| placeholder | String | | | Add a placeholder to the input component |
| label | String | | | Add a label to the input component |
| value | String | | | Value to be displayed in the input component (useful when an autocomplete has already a value on page load for example) |
| freeTextEnabled | Bool | | false | Avoid clearing the value of the input component if the user does not select a suggestion otherwise the value will be cleared |

<a name="default-theme"></a>
### Default theme

```jsx
container: {
    position: 'relative'
  },

  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: 0,
    left: 0,
    right: 0
  },

  suggestion: {
    display: 'block',
    padding: 10,
    textAlign: 'left',
    cursor: 'pointer'
  },

  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },

  suggestionHighlighted: {
    transition: 'all 300ms ease-in-out',
    backgroundColor: '#EBEBEB'
  },

  highlight: {
    fontWeight: 'bold'
  }
```

## License

MIT © [Sukmanov Bogdan](https://github.com/boggiedan)
