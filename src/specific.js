export const textareaSpec={
    attachAttr:function(node,propName,value){
        if(propName==='value'||propName==='defaultValue'){
            node.value=value;
        }
    }
}