import { createDomNode } from "./createDomNode";
import { NODE_TAG } from "./constant";
import { reRenderComponent } from "./life-cycle/reRenderComponent";
import { isSameNode, isNotNullOrUndefined,isString } from "./utils";
import { updateAttr, removeAttr } from "./DomProperty";
import Ref from "./Ref";
import { unmount } from "./life-cycle/unmountComponent";

export default function diff(preVNode, nextVNode, prarentDom, isSvg) {
    let dom = window.document.createTextNode("");
    if (isSameNode(preVNode, nextVNode)) {
        if (nextVNode.tag & NODE_TAG.NORMAL_COMPONENT) {
            dom = reRenderComponent(preVNode, nextVNode);
        } else if (nextVNode.tag & NODE_TAG.STATELESS) {
            dom = reRenderStateLess(preVNode, nextVNode, prarentDom);
        } else if (nextVNode.tag & NODE_TAG.NODE) {
            dom = diffHostNode(preVNode,nextVNode,isSvg)
        }
    } else {
        preVNode.unmount(prarentDom);
        dom = createDomNode(nextVNode);
        prarentDom.appendChild(dom);
    }
    return dom;
}

export function patchAttr(preVNode, nextVnode, isSvg) {
    const domNode = preVNode.dom;
    const preProps = preVNode.props;
    const nextProps = nextVnode.props;
    //update attributes
    for (let name in nextProps) {
        if (preProps[name] !== nextProps[name]) {
            updateAttr(domNode, name, nextProps[name], preProps[name]);
        }
    }
    //remove attributes
    for (let name in preProps) {
        if (!nextProps.hasOwnProperty(name)) {
            removeAttr(domNode, name);
        }
    }
}

function reRenderStateLess(preVNode, nextVnode, prarentDom) {
    const { props, type } = nextVnode;
    const rendered = (nextVnode._rendered = type(props));
    return diff(preVNode._rendered, rendered, prarentDom);
}

function diffHostNode(preVNode, nextVNode,isSvg) {
    const dom = preVNode.dom;
    diffAttributes(preVNode, nextVNode, isSvg);
    diffChildren(
        dom,
        preVNode.props.children||[],
        nextVNode.props.children||[]
    );
    if (nextVNode.ref !== null) {
        Ref.update(preVNode, nextVNode, dom);
    }
    return dom
}

//snabbdom https://github.com/snabbdom/snabbdom
function diffChildren(parentElm, oldCh, newCh) {
    let oldStartIdx = 0,
        newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx;
    let idxInOld;
    let elmToMove;
    let before;
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
        } else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx];
        } else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx];
        } else if (isSameNode(oldStartVnode, newStartVnode)) {
            diff(oldStartVnode, newStartVnode, parentElm);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (isSameNode(oldEndVnode, newEndVnode)) {
            diff(oldEndVnode, newEndVnode, parentElm);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (isSameNode(oldStartVnode, newEndVnode)) {
            // Vnode moved right
            diff(oldStartVnode, newEndVnode, parentElm);
            api.insertBefore(
                parentElm,
                oldStartVnode.elm,
                api.nextSibling(oldEndVnode.elm)
            );
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (isSameNode(oldEndVnode, newStartVnode)) {
            // Vnode moved left
            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
            parentElm.insertBefore(oldEndVnode.dom, oldStartVnode.dom);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
            }
            idxInOld = oldKeyToIdx[newStartVnode.key];
            if (!isNotNullOrUndefined(idxInOld)) {
                // New element
                parentElm.insertBefore(
                    createDomNode(newStartVnode),
                    oldStartVnode.dom
                );
                newStartVnode = newCh[++newStartIdx];
            } else {
                elmToMove = oldCh[idxInOld];
                if (elmToMove.sel !== newStartVnode.sel) {
                    parentElm.insertBefore(
                        createDomNode(newStartVnode),
                        oldStartVnode.dom
                    );
                } else {
                    diff(elmToMove, newStartVnode);
                    oldCh[idxInOld] = undefined;
                    parentElm.insertBefore(elmToMove.dom, oldStartVnode.dom);
                }
                newStartVnode = newCh[++newStartIdx];
            }
        }
    }
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
        if (oldStartIdx > oldEndIdx) {
            before =
                newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].dom;
            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx);
        } else {
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
    }
}
function addVnodes(parentElm, before, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
        const ch = vnodes[startIdx];
        if (ch != null) {
            parentElm.insertBefore(createElm(ch, insertedVnodeQueue), before);
        }
    }
}



function removeVnodes(parentElm, vnodes, startIdx, endIdx) {

    for (; startIdx <= endIdx; ++startIdx) {
        const vnode=vnodes[startIdx]
            unmount(vnode, parentElm);
        // if(isString(vnode)){
        //     console.log(parentElm.children)
        // }else{
        //     console.log(parentElm.childNodes)            
        
        // }
    }
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
    let i,
        map = {},
        key,
        ch;
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (ch != null) {
            key = ch.key;
            if (key !== undefined) map[key] = i;
        }
    }
    return map;
}

function diffAttributes(preVNode, nextVNode, dom) {
    return patchAttr(preVNode, nextVNode, dom);
}

function removeText(from) {
    if(Array.isArray(from)) {
        const child = from[0].nextSibling;

        child.parentNode.removeChild(child);
    }
    else {
        from.textContent = '';
    }
}
