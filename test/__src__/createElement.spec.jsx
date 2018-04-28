import createElement from '../../src/createElement'
import React from '../../src/React'

describe('create vnode', () => {
    it('create hostnode ',()=>{
      const vnode=<div id='test'>test</div>
     
      expect(vnode.type).toBe('div')
    })
   
  })
  