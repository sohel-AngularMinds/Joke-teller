import React from 'react';
import { shallow } from 'enzyme';
import App from './App'
import Homepage from './Component/Home/Homepage';
import NavbarComponent from './Component/Navbar/NavbarComponent';


it('Should Navbar and Homepage Render or not', () => {
    const wrapper = shallow(<App />);
    const Navbar = wrapper.find(NavbarComponent);
    expect(Navbar.exists()).toBe(true);
    const Home = wrapper.find(Homepage);
    expect(Home.exists()).toBe(true);
})