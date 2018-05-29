import React from "../../src/React";
import {renderIntoDocument,Simulate} from '../utils'

function normalizeCodeLocInfo(str) {
  return str && str.replace(/at .+?:\d+/g, 'at **');
}

function renderToString(node){
  return renderIntoDocument(<div>{node}</div>).innerHTML
}

describe('CSSPropertyOperations', () => {

  it('should automatically append `px` to relevant styles', () => {
    var styles = {
      left: 0,
      margin: 16,
      opacity: 0.5,
      padding: '4px',
    };
    var div = <div style={styles} />;
    var html = renderToString(div);
    expect(html).toContain("left: 0px; margin: 16px; opacity: 0.5; padding: 4px");
  });

  it('should trim values', () => {
    var styles = {
      left: '16px ',
      opacity: 0.5,
      right: ' 4px ',
    };
    var div = <div style={styles} />;
    var html = renderToString(div);
    expect(html).toContain('left: 16px; opacity: 0.5; right: 4px');
  });

  it('should not append `px` to styles that might need a number', () => {
    var styles = {
      flex: 0,
      opacity: 0.5,
    };
    var div = <div style={styles} />;
    var html = renderToString(div);
    expect(html).toContain('flex: 0 1 0%; opacity: 0.5');
  });

  // it('should create vendor-prefixed markup correctly', () => {
  //   var styles = {
  //     msTransition: 'none',
  //     MozTransition: 'none',
  //   };
  //   var div = <div style={styles} />;
  //   var html = renderToString(div);
  //   expect(html).toContain('"-ms-transition:none;-moz-transition:none"');
  // });

  it('should set style attribute when styles exist', () => {
    var styles = {
      backgroundColor: '#000',
      display: 'none',
    };
    var div = <div style={styles} />;
    var root = document.createElement('div');
    div = React.render(div, root);
    expect(/style=".*"/.test(root.innerHTML)).toBe(true);
  });

  it('should not set style attribute when no styles exist', () => {
    var styles = {
      backgroundColor: null,
      display: null,
    };
    var div = <div style={styles} />;
    var html = renderToString(div);
    expect(/style=/.test(html)).toBe(false);
  });

  // it('should not add units to CSS custom properties', () => {
  //   class Comp extends React.Component {
  //     render() {
  //       return <div style={{'--foo': 5}} />;
  //     }
  //   }

  //   var root = document.createElement('div');
  //   React.render(<Comp />, root);

  //   expect(root.children[0].style.Foo).toEqual('5');
  // });
});
