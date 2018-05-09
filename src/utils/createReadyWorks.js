import {hasLifeCycle,isNotNullOrUndefined} from './index'
import Ref from '../Ref'

function flushHook(previous,current){
    if(previous&&hasLifeCycle('componentDidUpdate',current.component)){
        const {component}=current;
        component['componentDidUpdate']( previous.props,previous.component.state,component.snapShot)
    }
    else if(!previous&&hasLifeCycle('componentDidMount',current.component)){
       
        current.component['componentDidMount']()
    }
}

function flushRef(prevouis,current){
    if(prevouis){
        Ref.update(prevouis,current)
    }
    else{
        Ref.attach(current,current.ref)
    }
}

function flushPenddingCallback(current){
    const {component}=current;
    if (component._pendingCallbacks) {
        while (component._pendingCallbacks.length) {
            component._pendingCallbacks.pop().call(component);
        }
    }
}

export function createReadyWorks(){
    const workStack=[]
    return{
        add:function(previous,current){
            workStack.push({previous,current})
        },
        flushWorks:function(){
            let work;
            while (work=workStack.pop()){
                const {previous,current}=work;
                flushHook(previous,current);
                flushRef(previous,current);
                flushPenddingCallback(current)             
            }
        }
    }
}