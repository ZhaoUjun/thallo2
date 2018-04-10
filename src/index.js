import React from './React';
import {Button} from './test'
window.React=React
// console.log(<Button/>)

React.ReactDom.render(<a href='www.baidu.com' style={{color:'red'}}>test</a>,document.getElementById('root'))
