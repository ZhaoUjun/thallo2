import {Component} from './React'
export function  Button(){
    return <a href='www.baidu.com'>click</a>
}  


export class Test extends Component{
    componentWillMount(){
        console.log('will mount')
    }
    componentDidMount(){
        console.log(this.refs)
    }
    render(){
        const {color}=this.props;
        return <div style={{color}} ref='test'>
            test
            <a href='www.baidu.com' ref={(node)=>console.log(node)}>click</a>
        </div>
    }
}