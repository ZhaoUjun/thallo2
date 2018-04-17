function parseStyle(styleObj) {
    return Object.keys(styleObj).reduce((acc, key) => {
        return acc + key + ":" + styleObj[key] + ";";
    }, "");
}
function setNodeStyle(node, styles) {
    const { style } = node;
    for (let styleName in styles) {
        style[styleName] = styles[styleName];
    }
}
export function attachAttributes(node, props) {
    Object.keys(props).forEach(propName => {
        if (propName === "children") {
            return;
        } else if (propName === "className") {
            node.setAttribute("class", props[propName]);
            return;
        } else if (propName === "style") {
            setNodeStyle(node, props[propName]);
            return;
        }
        node.setAttribute(propName, props[propName]);
    });
}
