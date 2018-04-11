import React from './React';
import {Button} from './test'
window.React=React
// console.log(<Button/>)

React.ReactDom.render(
    <Button/>  
    ,document.getElementById('root')
)
