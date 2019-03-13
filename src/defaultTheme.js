export const defaultTheme = {
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
}

export const constructCustomTheme = customTheme => {
  if (!customTheme) return defaultTheme

  let mergedThemes = {
    ...defaultTheme,
    ...customTheme
  }

  Object.keys(defaultTheme).forEach(key => {
    mergedThemes = {
      ...mergedThemes,
      [key]: {
        ...defaultTheme[key],
        ...customTheme[key]
      }
    }
  })

  return mergedThemes
}
