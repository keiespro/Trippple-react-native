import React from 'react';
import { shallow } from "enzyme";
import { expect } from 'chai';
import sinon from 'sinon';

import Welcome from "../../app/components/welcome";
import IntroScreen from "../../app/components/welcome";

describe("<Welcome/>", () => {

   it('renders a Navigator component', () => {
     const wrapper = shallow(<Welcome />);

     expect(wrapper.findWhere(n =>  n.node.ref == 'nav')).to.have.length(1);
   });

});

describe("<IntroScreen/>", () => {

  it('renders <Carousel/>  button', () => {
    const wrapper = shallow(<IntroScreen />);
    setTimeout(()=>{
      expect(wrapper.find('Carousel')).to.have.length(1);
      // console.log(wrapper.debug());
    },500);
  });
   it('renders <Login/>  button', () => {
     const wrapper = shallow(<IntroScreen />);
     setTimeout(()=>{
       expect(wrapper.findWhere(n =>  n.node.ref == 'loginbtn')).to.have.length(1);
     },500);
   });
   it('renders <Register/>  button', () => {
     const wrapper = shallow(<IntroScreen />);
     setTimeout(()=>{
       expect(wrapper.findWhere(n =>  n.node.ref == 'registerbtn')).to.have.length(1);
     },500);
   });

  //  it('renders a IntroScreen  component', () => {
  //     const wrapper = shallow(<Welcome />);
  //     expect(wrapper.find(IntroScreen)).to.have.length(1);
  //   });
});
