export const customSelectStyles = {
  option: (styles) => ({
    ...styles,
    background: "white",
    borderBottom: "1px",
    color: "black",
    padding: 15,
  }),
  control: (base) => ({
    ...base,
    height: 55,
    maxHeight: 60,
  }),
  menu: (styles) => ({ ...styles, zIndex: 999 }),
};
