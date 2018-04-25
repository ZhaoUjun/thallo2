const styleOps = {
    attach: (node, styles) => {
        const { style } = node;
        for (let styleName in styles) {
            style[styleName] = styles[styleName];
        }
    },
    update: (node, nextStyles,preStyles) => {
        const { style } = node;
        for (let styleName in nextStyles) {
            style[styleName] = nextStyles[styleName];
        }
        for(let styleName in preStyles){
            if (!nextStyles.hasOwnProperty(styleName)){
                style[styleName]=''
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
            node.setAttribute("class", props[propName]);
            return;
        } else if (propName === "style") {
            styleOps.attach(node, props[propName]);
            return;
        }
        node.setAttribute(propName, props[propName]);
    });
}

export function removeAttr(node, propName) {
    node.removeAttribute(propName)
}

export function updateAttr(node, name,value,preValue) {
    if(name==='children'){
        return
    }
    else if (name==='style'){
        return styleOps.update(node,value,preValue)
    }
    else if(name==='className'){
        return node.setAttribute("class", value)
    }
    node.setAttribute(name,value);
}
