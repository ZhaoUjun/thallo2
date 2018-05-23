import React from '../src/React'

export function renderIntoDocument(element){
    const container =document.createElement('div')
    return React.render(element,container)
}

export function Simulate(element){
    const event =document.createEvent("MouseEvent");
    return {
        click:function(){
            Object.defineProperty(event,'target',{value:element})
            event.initEvent("click", true, false);  
            document.dispatchEvent(event)
        }
    }
}

export function shallowEqualObjects(objA, objB) {
	if (objA === objB) {
		return true;
	}

	let aKeys = Object.keys(objA);
	let bKeys = Object.keys(objB);
	let len = aKeys.length;

	if (bKeys.length !== len) {
		return false;
	}

	for (let i = 0; i < len; i++) {
		let key = aKeys[i];

		if (objA[key] !== objB[key]) {
			return false;
		}
	}

	return true;
}

export function shallowCompare(component,nextProps,nextState){
    return !(shallowEqualObjects(component.props,nextProps)&&shallowEqualObjects(component.state,nextState))
}