import React,{render} from "./React";
import { unmountTree } from "./life-cycle/unmountComponent";

import { Button, Test } from "./test";
window.React = React;


render(<Test color="red" />, document.getElementById("root"));

