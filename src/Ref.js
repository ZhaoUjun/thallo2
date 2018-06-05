import { isComposite, isFunction, isStateless, isString ,isNotNullOrUndefined} from "./utils";
import { NODE_TAG } from "./constant";

export default {
    update(lastVnode, nextVnode, domNode) {
        const prevRef = isNotNullOrUndefined(lastVnode)? lastVnode.ref:null;
        const nextRef = isNotNullOrUndefined(lastVnode)? nextVnode.ref:null;
        if(prevRef===nextRef){
            return void 0
        }
        this.detach(lastVnode, prevRef, lastVnode.dom);
        this.attach(nextVnode, nextRef, domNode);
    },
    attach(vnode, ref, domNode) {
        // throw ('test')
        const node = isComposite(vnode) ? vnode.component : domNode;
        if (isFunction(ref)) {
            ref(node);
        } else if (isString(ref)) {
            if (
                vnode &&
                vnode.parentVNode &&
                vnode.parentVNode.tag & NODE_TAG.STATELESS
            ) {
                console.warn("statelessComponent do not support refs");
                return;
            }
            const inst = vnode._owner;
            if(inst===null){
                throw new Error('cannot supply a ref outside of render method')
            }
            if (inst && isFunction(inst.render)) {
                inst.refs[ref] = node;
            }
        }
    },
    detach(vnode, ref, domNode) {
        const node = isComposite(vnode) ? vnode.component : domNode;
        if (isFunction(ref)) {
            ref(null);
        } else if (isString(ref)) {
            const inst = vnode._owner;
            if (inst.refs[ref] === node && isFunction(inst.render)) {
                delete inst.refs[ref];
            }
        }
    }
};
