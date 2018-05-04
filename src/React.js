import {render,findDOMNode} from "./ReactDom";
import {createElement,createFactory,cloneElement,isValidElement} from "./ReactElement"
import {Component} from './Component'
import {unmountComponentAtNode} from './life-cycle/unmountComponent'
/**
 * Top API (done)
 * Component done
 * render done
 * createElement
 * createFactory
 * unmountComponentAtNode
 * cloneElement
 * findDomNode
 * 
 * 
 * 
 * (todo)
 * Fragment
 * PureComponent
 * createPortal
 * createContext
 * createRef
 * Children

 */

const React=window.React=window.reactDom={
    createElement,
    render,
    Component,
    createFactory,
    isValidElement,
    unmountComponentAtNode,
    findDOMNode,
    cloneElement
};



export default React;
