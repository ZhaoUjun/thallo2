export const GLOBAL = window;

export const EMPTY_OBJ = {};

export const NODE_TAG = {
    NORMAL_COMPONENT: 1,
    STATELESS: 2,
    NODE: 4,
    TEXT: 8,
    PORTAL: 16
};

export const HTMLNodeType = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_FRAGMENT_NODE: 11
};

export const REACT_ELEMENT_TYPE =
    (typeof Symbol === "function" &&
        Symbol.for &&
        Symbol.for("react.element")) ||
    0xeac7;

export const cssPropsWithSize=[
    'left','right','top','bottom',
    'padding','paddingLeft','paddingRight','paddingTop','paddingBottom',
    'margin','marginLeft','marginRight','marginTop','marginBottom',
    'fontSize','textIndent',
    'translate','translateX','translateY','translateZ',
]