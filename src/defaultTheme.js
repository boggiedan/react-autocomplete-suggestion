export const defaultTheme = {
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
};

export const mergeThemes = (defaultTheme, customTheme = {}) => {
  let mergedThemes = {
    ...defaultTheme,
    ...customTheme
  };

  Object.keys(defaultTheme).forEach(key => {
    mergedThemes = {
      ...mergedThemes,
      [key]: {
        ...defaultTheme[key],
        ...customTheme[key]
      }
    };
  });

  return mergedThemes;
};
