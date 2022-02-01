import React from 'react';
import { shallow } from 'enzyme';
import Homepage from './Homepage';

it('After Calling ComponentDidMount is State is Changed',async () => {    
    const wrapper = shallow(<Homepage />);
    const instance =wrapper.instance();
    await instance.componentDidMount();
    expect(wrapper.state().max).toBe(1368);
    expect(wrapper.state().api).not.toEqual('{}')
})
