import { isEventName, addEventHandler, removeEventHandler } from "./event";
import {
    isNotNullOrUndefined,
    isFunction,
    isBoolean,
    isSymbol,
    isNumber,
    isPlainObj
} from "./utils";
import { textareaSpec } from "./specific";
import { cssPropsWithSize } from "./constant";

const booleanAttrs = ["disabled"];
const allowBoobeanAttrs = ["spellCheck"];
const excludeAttrs = ["children", "ref", "owner"];

function customizePropName(propName) {
    const interalAttrs = [
        "tabindex",
        "spellcheck",
        "dropzone",
        "contextmenu",
        "contenteditable",
        "accesskey",
        "size",
        "defaultvalue",
        "autofocus"
    ];
    if (interalAttrs.includes(propName.toLocaleLowerCase())) {
        return propName;
    }
    return calmalName(propName);
}

function calmalName(name) {
    return name.replace(/[A-Z]/g, val => "-" + val.toLocaleLowerCase());
}

function autoAppendPx(name, val) {
    if (isNumber(val) && val > 0) {
        return cssPropsWithSize.includes(name) ? val + "px" : val;
    }
    return String(val).trim();
}

function venderPrefixed(styleName) {
    return styleName.replace(/^(Moz|ms)[A-Z]/, val => {
        const index = val.length === 4 ? 3 : 2;
        return (
            "-" +
            val.slice(0, index).toLocaleLowerCase() +
            "-" +
            val.slice(index).toLocaleLowerCase()
        );
    });
}

function processStyle(style, styleName, val) {
    style[venderPrefixed(styleName)] = autoAppendPx(styleName, val);
}

const styleOps = {
    attach: (node, styles) => {
        const { style } = node;
        for (let styleName in styles) {
            processStyle(style, styleName, styles[styleName]);
        }
    },
    update: (node, nextStyles, preStyles) => {
        const { style } = node;
        for (let styleName in nextStyles) {
            processStyle(style, styleName, styles[styleName]);
        }
        for (let styleName in preStyles) {
            if (!nextStyles.hasOwnProperty(styleName)) {
                style[venderPrefixed(styleName)] = "";
            }
        }
    },
    remove: (node, styles) => {
        const { style } = node;
        for (let styleName in styles) {
            style[styleName] = "";
        }
    }
};

export function attachAttributes(node, props) {
    Object.keys(props).forEach(propName => {
        updateAttr(node, propName, props[propName], null, false);
    });
}

export function removeAttr(node, propName) {
    node.removeAttribute(propName);
}

export function updateAttr(node, name, value, preValue, isUpdate = true) {
    if (excludeAttrs.includes(name)) {
        return;
    } else if (name === "style") {
        return isUpdate
            ? styleOps.update(node, value, preValue)
            : styleOps.attach(node, value);
    } else if (name === "className" || name.toLocaleLowerCase() === "class") {
        return classOps.attach(node, value);
    } else if (isEventName(name)) {
        if (value === preValue) {
            return;
        } else if (isUpdate) {
            removeEventHandler(node, name);
        }
        return addEventHandler(node, name, value);
    } else if (isFunction(value) && !isUpdate) {
        return void 0;
    } else if (
        node.tagName === "TEXTAREA" &&
        (name === "value" || "defaultValue")
    ) {
        return textareaSpec.attachAttr(node, name, value);
    } else if (booleanAttrs.includes(name.toLocaleLowerCase())) {
        return value ? node.setAttribute(name, "") : node.removeAttribute(name);
    } else if (
        isFunction(value) ||
        !isNotNullOrUndefined(value) ||
        isSymbol(value)
    ) {
        return node.removeAttribute(name);
    } else if (isBoolean(value)) {
        return !value || isUpdate
            ? node.removeAttribute(name)
            : node.setAttribute(name, value);
    }
    node.setAttribute(customizePropName(name), value);
}

const classOps = {
    attach: function(node, value) {
        if (isNotNullOrUndefined(value)) {
            node.setAttribute("class", value);
        } else {
            removeAttr(node, "class");
        }
    }
};
