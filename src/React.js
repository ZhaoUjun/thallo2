import {render,findDOMNode} from "./ReactDom";
import {createElement,createFactory} from "./ReactElement"
import {Component} from './Component'
import{isValidElement} from './utils/isValidElement'
import {unmountComponentAtNode} from './life-cycle/unmountComponent'
/**
 * Top API (done)
 * Component done
 * render done
 * createElement
 * createFactory
 * unmountComponentAtNode
 * 
 * (todo)
 * Fragment
 * cloneElement
 * PureComponent
 * createPortal
 * createContext
 * createRef
 * Children
 * findDomNode
 */

const React=window.React=window.reactDom={
    createElement,
    render,
    Component,
    createFactory,
    isValidElement,
    unmountComponentAtNode,
    findDOMNode
};



export default React;
