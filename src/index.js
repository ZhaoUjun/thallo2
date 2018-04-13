import React from './React';
import {Button,Test} from './test'
window.React=React
// console.log(<Button/>)

React.ReactDom.render(
    <Test color='red'/>  
    ,document.getElementById('root')
)
