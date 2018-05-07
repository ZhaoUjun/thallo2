import React from '../src/React'

export function renderIntoDocument(element){
    const container =document.createElement('div')
    return React.render(element,container)
}