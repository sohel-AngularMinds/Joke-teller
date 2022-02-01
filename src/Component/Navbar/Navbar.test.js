import React from "react";
import { shallow } from "enzyme";
import NavbarComponent from "./NavbarComponent"


it("should Menu Button Clicked or Not", () => {
    const wrapper = shallow(<NavbarComponent />);
    const myState = wrapper.state('show');
    expect(myState).toBe(false);

    const Button = wrapper.find('.edit-btn');
    Button.simulate('click');
    expect(wrapper.state('show')).toBe(true);
})