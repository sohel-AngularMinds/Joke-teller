import React from 'react';
import { render, screen,fireEvent } from '@testing-library/react'
import { shallow } from 'enzyme';
import Homepage from './Homepage';

it('After Calling ComponentDidMount is State is Changed',async () => {    
    const wrapper = shallow(<Homepage />);
    const instance =wrapper.instance();
    await instance.componentDidMount();
    expect(wrapper.state().max).toBe(1368);
    expect(wrapper.state().api).not.toEqual('{}')
})


it('After selecting select value is range is changed or not', async () => {
    render(<Homepage />);
    let selectLanguage = screen.getByTestId('selectLanguage');
    fireEvent.change(selectLanguage, { target: { value: 'pt' } });
    
    let fromRange = screen.getByTestId('fromRange');
    let toRange = screen.getByTestId('toRange');
    
    expect(fromRange.value).toBe(0);
    expect(toRange.value).toBe(1);

    console.log(fromRange.value);
    console.log(toRange.value);

})