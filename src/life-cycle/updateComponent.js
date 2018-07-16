import { NODE_TAG } from "../constant";
import {
	getChildrenfromProps,
	isClass,
	isComponent,
	isFunction,
	isNotNullOrUndefined,
	hasLifeCycle,
	isArray
} from "../utils";
import { CurrentOwner, mountedComponents, readyWorks } from "../top";
import { createDomNode } from "../createDomNode";
import { getChildContext } from "../utils/getChildContext";
import { renderComponent } from "./mountComponent";
import diff from "../diff";
import { createElement } from "../ReactElement";

export function updateComponent(component, isForce) {
	component.nextState = component.getState();
	const { vNode, props, state, context, nextState, nextContext } = component;
	const nextProps = (component.nextProps = component.nextProps || props);
	let shouldSkip = false;

	let snapShot;
	if (hasLifeCycle("shouldComponentUpdate", component)) {
		shouldSkip =
			isForce ||
			!component.shouldComponentUpdate(nextProps, nextState, nextContext);
	}
	if (hasLifeCycle("getSnapshotBeforeUpdate", component)) {
		snapShot = component.getSnapshotBeforeUpdate(props, state, context);
		component.snapShot = snapShot;
	}
	if (!shouldSkip) {
		if (hasLifeCycle("componentWillUpdate", component)) {
			component.componentWillUpdate(nextProps, nextState);
		}
		component.props = nextProps;
		component.state = nextState;
		component.context = nextContext;
		component.childContext = getChildContext(component, component.childContext);
		const lastRendered = vNode._rendered;
		const rendered = renderComponent(vNode, component);
		const parentDom = lastRendered.dom && lastRendered.dom.parentNode;
		vNode.dom = diff(lastRendered, rendered, parentDom, component.childContext);
	}
	component._dirty = false;

	return vNode.dom;
}
