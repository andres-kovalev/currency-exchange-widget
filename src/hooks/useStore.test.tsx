import React, { useMemo } from 'react';
import { shallow } from 'enzyme';

import useStore from './useStore';

const INCREMENT = 'INCREMENT';
const increment = (): { type: string } => ({ type: INCREMENT });
const actionCreators = { increment };
const reducer = (
    state: number,
    { type }: { type: string }
): number => (type === INCREMENT ? state + 1 : state);
const initialState = 0;

describe('useStore', () => {
    it('should return state', () => {
        const Component: React.FC = () => {
            const [ state ] = useStore(reducer, actionCreators, initialState);

            return (
                <span>{ state }</span>
            );
        };

        const wrapper = shallow(<Component />);

        expect(wrapper.find('span')).toHaveText('0');
    });

    it('should return bound action creators', () => {
        const Component: React.FC = () => {
            const [ state, actions ] = useStore(reducer, actionCreators, initialState);

            return (
                <button onClick={ actions.increment }>{ state }</button>
            );
        };

        const wrapper = shallow(<Component />);

        expect(wrapper.find('button')).toHaveText('0');

        wrapper.find('button').simulate('click');

        expect(wrapper.find('button')).toHaveText('1');
    });

    it('should memoize bound action creators', () => {
        const spy = jest.fn();

        const Component: React.FC = () => {
            const [ state, actions ] = useStore(reducer, actionCreators, initialState);

            useMemo(spy, [ actions ]);

            return (
                <button onClick={ actions.increment }>{ state }</button>
            );
        };

        const wrapper = shallow(<Component />);

        expect(spy).toHaveBeenCalledTimes(1);

        wrapper.find('button').simulate('click');

        expect(spy).toHaveBeenCalledTimes(1);
    });
});
