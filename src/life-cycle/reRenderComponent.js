import { updateComponent } from "./updateComponent";
import { hasLifeCycle } from "../utils";
import { getChildContext } from "../utils/getChildContext";
import { readyWorks } from "../top";

function updateContext(component, nextVnode, parentContext) {
	component.context = attchContext(nextVnode, parentContext);
	component.childContext = getChildContext(component, parentContext);
}
function attchContext(nextVnode, parentContext) {
	let context = {};
	if (nextVnode.type.contextTypes) {
		Object.keys(nextVnode.type.contextTypes).forEach(key => {
			context[key] = parentContext[key];
		});
	} else {
		context = nextVnode.component.context;
	}
	return context;
}
function getNextContext(nextVnode, parentContext) {
	let context = {};
	if (nextVnode.type.contextTypes) {
		Object.keys(nextVnode.type.contextTypes).forEach(key => {
			context[key] = parentContext[key];
		});
	} else {
		context = nextVnode.component.context;
	}
	return context;
}
export function reRenderComponent(preVnode, nextVnode, parentContext) {
	const preProps = preVnode.props;
	const nextProps = nextVnode.props;
	const component = (nextVnode.component = preVnode.component);
	component.nextContext = getNextContext(nextVnode, parentContext);
	component.childContext = getChildContext(component, parentContext);

	component._disable = true; // avoid updating again when call setState in this hook
	if (hasLifeCycle("componentWillReceiveProps", component)) {
		component.componentWillReceiveProps(nextProps, component.nextContext);
	}
	component._disable = false;
	// component.preProps = preProps;
	// component.preState = component.state;
	// component.preContext = component.context;
	component.nextProps = nextProps;
	component.vNode = nextVnode;
	nextVnode._rendered = preVnode._rendered;
	nextVnode.dom = preVnode.dom;
	// updateContext(component,nextVnode,parentContext)
	readyWorks.add(preVnode, nextVnode);
	return updateComponent(component, false);
}
