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
};

export const constructCustomTheme = customTheme => {
  if (!customTheme) return defaultTheme;

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
