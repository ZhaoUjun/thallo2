import { isEventName, addEventHandler, removeEventHandler } from "./event";
import { isNotNullOrUndefined, isFunction, isBoolean, isSymbol, isNumber } from "./utils";
import { textareaSpec } from "./specific";
import {cssPropsWithSize} from './constant'

function customizePropName(propName) {
    const interalAtrr = [
        "tabindex",
        "spellcheck",
        "dropzone",
        "contextmenu",
        "contenteditable",
        "accesskey",
        "size"
    ];
    if (interalAtrr.includes(propName.toLocaleLowerCase())) {
        return propName;
    }
    return calmalName(propName);
}

function processStyleName(name){
    const exclude=[
        'translateX','translateY','translateZ'
    ];
    if (interalAtrr.includes(name)) {
        return name;
    }
    return calmalName(name)

}

function calmalName(name){
    return name.replace(/[A-Z]/g, val => "-" + val.toLocaleLowerCase());
}

function autoAppendPx(name,val){
    if(isNumber(val)&&val>0){
        return cssPropsWithSize.includes(name)? val+'px':val
    }
    return String(val).trim()
}

function venderPrefixed(styleName){
    return styleName.replace(/^(Moz|ms)[A-Z]/,val=>{
        const index=val.length===4?3:2
        return '-'+val.slice(0,index).toLocaleLowerCase()+'-'+val.slice(index).toLocaleLowerCase()
    })
}

function processStyle(style,styleName,val){
    style[venderPrefixed(styleName)] = autoAppendPx(styleName,val)
}



const styleOps = {
    attach: (node, styles) => {
        const { style } = node;
        for (let styleName in styles) {
            processStyle(style,styleName,styles[styleName])
        }
    },
    update: (node, nextStyles, preStyles) => {
        const { style } = node;
        for (let styleName in nextStyles) {
            processStyle(style,styleName,styles[styleName])
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

function parseStyle(styleObj) {
    return Object.keys(styleObj).reduce((acc, key) => {
        return acc + key + ":" + styleObj[key] + ";";
    }, "");
}

export function attachAttributes(node, props) {
    Object.keys(props).forEach(propName => {
        if (propName === "children") {
            return;
        } else if (
            propName === "className" ||
            propName.toLocaleLowerCase() === "class"
        ) {
            return classOps.attach(node, props[propName]);
        } else if (propName === "style") {
            return styleOps.attach(node, props[propName]);
        } else if (isEventName(propName)) {
            return addEventHandler(node, propName, props[propName]);
        } else if (
            node.tagName === "TEXTAREA" &&
            (node[propName] === "value" || "defaultValue")
        ) {
            return textareaSpec.attachAttr(node, propName, props[propName]);
        } else if (isFunction(props[propName])) {
            return;
        }
        node.setAttribute(customizePropName(propName), props[propName]);
    });
}

export function removeAttr(node, propName) {
    node.removeAttribute(propName);
}

export function updateAttr(node, name, value, preValue) {
    if (name === "children") {
        return;
    } else if (name === "style") {
        return styleOps.update(node, value, preValue);
    } else if (name === "className" || name.toLocaleLowerCase() === "class") {
        return classOps.attach(node, value);
    } else if (isEventName(name)) {
        removeEventHandler(node, name);
        return addEventHandler(node, name, value);
    } else if (
        node.tagName === "TEXTAREA" &&
        (node[propName] === "value" || "defaultValue")
    ) {
        return textareaSpec.attachAttr(node, name, props.value);
    } else if (
        isFunction(value) ||
        !isNotNullOrUndefined(value) ||
        isBoolean(value) ||
        isSymbol(value)
    ) {
        return node.removeAttribute(name);
    }
    node.setAttribute(customizePropName(name), value);
}

const classOps = {
    attach: function(node, value) {
        return node.setAttribute(
            "class",
            isNotNullOrUndefined(value) ? value : ""
        );
    }
};
