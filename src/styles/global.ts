import { globalCss } from ".";

export const globalStyles = globalCss({
  "*": {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },

  body: {
    backgroundColor: "$gray900",
    color: "$gray100",
  },

  "body, input, text-area, button": {
    fontFamily: "Roboto",
    fontWeight: 400,
  },
});
