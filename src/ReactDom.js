import { instantiateComponent } from './instantiateComponent'

export function render(element,container){
    const componentInstance=instantiateComponent(element);
    const node = componentInstance.mount();
    container.appendChild(node);
}
