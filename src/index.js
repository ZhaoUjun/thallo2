import React from "./React";
import { unmountTree } from "./life-cycle/unmountComponent";

import { Button, Test } from "./test";
window.React = React;
// console.log(<Button/>)

React.ReactDom.render(<Test color="red" />, document.getElementById("root"));

// setTimeout(() => {
//     unmountTree(document.getElementById("root"));
// }, 2000);
