import { NODE_TAG } from "./constant";
import {
    getChildrenfromProps,
    isString,
    isNumber,
    isIterator,
    isArray
} from "./utils";
import { attachAttributes } from "./DomProperty";
import Ref from "./Ref";

export function createDomNode(
    vNode,
    parentContext = {},
    parentComponent,
    isSvg = false
) {
    const tag = vNode && vNode.tag;
    let domNode;
    if (
        tag &
        (NODE_TAG.NORMAL_COMPONENT |
            NODE_TAG.STATELESS |
            NODE_TAG.NODE |
            NODE_TAG.TEXT)
    ) {
        domNode = vNode.mount(parentContext, parentComponent);
    } else if (isString(vNode) || isNumber(vNode)) {
        domNode = window.document.createTextNode(vNode);
    } else if (isIterator(vNode)) {
        domNode = window.document.createDocumentFragment();
        vNode.forEach(item => {
            domNode.appendChild(
                createDomNode(item, parentContext, parentComponent)
            );
        });
    } else {
        domNode = window.document.createTextNode("");
    }
    return domNode;
}

export function mountVNode(vNode, parentContext, parentComponent, isSvg) {
    const { type, ref, props } = vNode;
    const dom = (vNode.dom = window.document.createElement(type));
    attachAttributes(dom, props);
    const children = getChildrenfromProps(props);
    if (children) {
        for (let childVNode of children) {
            dom.appendChild(
                createDomNode(childVNode, parentContext, parentComponent, isSvg)
            );
        }
    }
    if (ref) {
        Ref.attach(vNode, ref, dom);
    }
    disposeSpecialHostNode(vNode, dom);
    return dom;
}

export function mountTextNode(vNode, parentContext, parentComponent, isSvg) {
    const textNode = (vNode.dom = window.document.createTextNode(this.text));

    return textNode;
}

export function disposeSpecialHostNode(vNode, dom, isUpdate = false) {
    const { type } = vNode;
    const nodes = {
        select: function() {
            const {
                value,
                multiple,
                defaultValue,
                _actualInitValue
            } = vNode.props;
            if (
                isUpdate &&
                (typeof defaultValue !== "undefined" &&
                    typeof _actualInitValue === "undefined")
                // &&(multiple&&!dom.multiple)
            ) {
                //仅defaultValue 更新时，不需要更新value
                return;
            }
            if (typeof value !== "undefined") {
                if (value === dom.value) {
                    return;
                }
                const options = [...dom.options];
                let option;
                while ((option = options.pop())) {
                    option.selected = isArray(value)
                        ? value.includes(option.value)
                        : option.value === value;
                }
            }
        }
    };
    return nodes[type] && nodes[type].call();
}
