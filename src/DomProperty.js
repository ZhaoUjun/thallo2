import { isEventName, addEventHandler,removeEventHandler } from "./event";
import {isNotNullOrUndefined} from './utils'
import {textareaSpec} from './specific'

const styleOps = {
    attach: (node, styles) => {
        const { style } = node;
        for (let styleName in styles) {
            style[styleName] = styles[styleName];
        }
    },
    update: (node, nextStyles, preStyles) => {
        const { style } = node;
        for (let styleName in nextStyles) {
            style[styleName] = nextStyles[styleName];
        }
        for (let styleName in preStyles) {
            if (!nextStyles.hasOwnProperty(styleName)) {
                style[styleName] = "";
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
        } else if (propName === "className") {
            return classOps.attach(node,props[propName])
        } else if (propName === "style") {
            return styleOps.attach(node, props[propName]);
        } else if (isEventName(propName)) {
            return addEventHandler(node, propName, props[propName]);
        }
        else if(node.tagName==='TEXTAREA'&&node[propName]==='value'||'defaultValue'){
            return textareaSpec.attachAttr(node,propName,props[propName])
        }
        node.setAttribute(propName, props[propName]);
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
    } else if (name === "className") {
        return classOps.attach(node,value)
    } else if (isEventName) {
        removeEventHandler(node,name)
        return addEventHandler(node, name, value);
    }else if(node.tagName==='TEXTAREA'&&node[propName]==='value'||'defaultValue'){
        return textareaSpec.attachAttr(node,name,props.value)
    }
    node.setAttribute(name, value);
}

const classOps={
    attach:function(node,value){
        return node.setAttribute("class", isNotNullOrUndefined(value)?value:'')
    }
}
