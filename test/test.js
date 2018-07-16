import React, { Component } from "../src/Component";

export function Button() {
	return <a href="www.baidu.com">click</a>;
}

export class Test extends Component {
	state = {
		fontSize: "25px"
	};
	// componentWillMount() {
	// 	console.log("will mount");
	// }
	shouldComponentUpdate() {
		console.log("shouldComponentUpdate");
	}
	componentDidMount() {
		setTimeout(() => {
			console.log(this.state);
			this.setState({ fontSize: "15px" });
			// console.log(this.state)
			// this.setState({fontSize:'20px'})
			// console.log(this.state)
		}, 3000);
	}
	handleClick = e => {
		console.log("click1");
	};
	handleClick2 = e => {
		e.stopPropagation();
		console.log("click2");
	};
	render() {
		const { color } = this.props;
		const { fontSize } = this.state;
		return (
			<div style={{ color, fontSize }} ref="test" onClick={this.handleClick}>
				test
				<a href="www.baidu.com" ref={node => console.log(node)}>
					click
				</a>
				<StateLess color={color} />
				{[1, 2, 3].map(item => <div key={item}>{item}</div>)}
				<button onClick={this.handleClick2}>click2</button>
			</div>
		);
	}
}

function StateLess({ color }) {
	return <div color={color}>StateLess</div>;
}
