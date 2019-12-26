import React from 'react';
import { shallow } from 'enzyme';

import useDerivedState from './useDerivedState';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const identity = (value: any): any => value;

describe('useDerivedState', () => {
    it('should return state', () => {
        const Component: React.FC = () => {
            const [ state ] = useDerivedState<number>(identity, 0);

            return (
                <span>{ state }</span>
            );
        };

        const wrapper = shallow(<Component />);

        expect(wrapper.find('span')).toHaveText('0');
    });

    it('should return function to update state', () => {
        const Component: React.FC = jest.fn(() => {
            const [ state, setState ] = useDerivedState(identity, 0);

            return (
                <button onClick={ (): void => setState(state + 1) }>{ state }</button>
            );
        });

        const wrapper = shallow(<Component />);

        expect(Component).toHaveBeenCalledTimes(1);

        wrapper.find('button').simulate('click');

        expect(Component).toHaveBeenCalledTimes(2);
    });

    it('should update state without re-render using update callback', () => {
        const Component: React.FC<{ value: string }> = jest.fn(({ value }) => {
            const [ state ] = useDerivedState<string>(
                () => value,
                value
            );

            return (
                <span>{ state }</span>
            );
        });

        const wrapper = shallow(<Component value="0" />);

        expect(Component).toHaveBeenCalledTimes(1);
        expect(wrapper.find('span')).toHaveText('0');

        wrapper.setProps({ value: '1' });

        expect(Component).toHaveBeenCalledTimes(2);
        expect(wrapper.find('span')).toHaveText('1');
    });
});
