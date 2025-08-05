// src/themes/nightOwl.js
const nightOwl = {
  plain: {
    color: "#d6deeb",
    backgroundColor: "#011627",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "#637777",
        fontStyle: "italic",
      },
    },
    {
      types: ["punctuation"],
      style: {
        color: "#c792ea",
      },
    },
    {
      types: ["property", "tag", "boolean", "number", "constant", "symbol"],
      style: {
        color: "#ff6363",
      },
    },
    {
      types: ["selector", "attr-name", "string", "char", "builtin"],
      style: {
        color: "#ecc48d",
      },
    },
    {
      types: ["function", "class-name"],
      style: {
        color: "#82aaff",
      },
    },
  ],
};

export default nightOwl;
