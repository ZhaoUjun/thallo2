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