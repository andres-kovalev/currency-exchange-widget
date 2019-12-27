import React from 'react';
import { shallow } from 'enzyme';
import { TextField } from '@material-ui/core';

import NumberField from './NumberField';

describe('NumberField', () => {
    it('should render itself using TextField', () => {
        const wrapper = shallow(<NumberField sign="+" />);

        expect(wrapper.find(TextField)).toExist();
    });

    it('should show placeholder when value is 0', () => {
        const wrapper = shallow(<NumberField sign="+" value={ 0 } />);

        expect(wrapper.find(TextField)).toHaveProp({
            value: '',
            placeholder: '0'
        });
    });

    it('should add sign when value is not 0', () => {
        const wrapper = shallow(<NumberField sign="+" value={ 1 } />);

        expect(wrapper.find(TextField)).toHaveProp({
            value: '+ 1'
        });
    });

    it('should call onChange callback when number value changed', () => {
        const onChange = jest.fn();
        const wrapper = shallow(
            <NumberField
                sign="+"
                value={ 1 }
                onChange={ onChange }
            />
        );

        expect(onChange).not.toHaveBeenCalled();

        wrapper.find(TextField).simulate('change', { target: { value: '+ 11' } });

        expect(onChange).toHaveBeenCalledWith(11);
    });

    it('should not call onChange callback when only formatted value changed', () => {
        const onChange = jest.fn();
        const wrapper = shallow(
            <NumberField
                sign="+"
                value={ 1 }
                onChange={ onChange }
            />
        );

        expect(onChange).not.toHaveBeenCalled();

        wrapper.find(TextField).simulate('change', { target: { value: '+ 1.' } });

        expect(onChange).not.toHaveBeenCalled();
    });

    it('should update formatted value when value prop changed', () => {
        const wrapper = shallow(<NumberField sign="+" value={ 1 } />);

        expect(wrapper.find(TextField)).toHaveProp({
            value: '+ 1'
        });

        wrapper.setProps({ value: 2 });

        expect(wrapper.find(TextField)).toHaveProp({
            value: '+ 2'
        });
    });
});
