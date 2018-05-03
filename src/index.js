import React from "./React";
import { unmountTree } from "./life-cycle/unmountComponent";

import { Button, Test } from "./test";
window.React = React;


// render(<Test color="red" />, document.getElementById("root"));
React.render(React.createElement('span',{},['test','test2',['test3','test4']]), document.getElementById("root"));

// React.render(React.createElement('span',{},null), document.getElementById("root"));