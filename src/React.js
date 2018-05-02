import {render} from "./ReactDom";
import {createElement,createFactory} from "./ReactElement"
import {Component} from './Component'
import{isValidElement} from './utils/isValidElement'
/**
 * Top API (done)
 * Component done
 * render done
 * createElement
 * createFactory
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
    isValidElement
};



export default React;
