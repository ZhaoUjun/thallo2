export const GLOBAL = window;

export const EMPTY_OBJ = {};

export const NODE_TAG = {
    NORMAL_COMPONENT: 1,
    STATELESS: 2,
    NODE: 4,
    TEXT: 8,
    PORTAL: 16
};

export const REACT_ELEMENT_TYPE =
    (typeof Symbol === "function" &&
        Symbol.for &&
        Symbol.for("react.element")) ||
    0xeac7;
