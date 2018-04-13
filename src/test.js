import {Component} from './React'
export function  Button(){
    return <a href='www.baidu.com'>click</a>
}  


export class Test extends Component{
    render(){
        const {color}=this.props;
        return <div style={{color}}><a href='www.baidu.com'>click</a></div>
    }
}