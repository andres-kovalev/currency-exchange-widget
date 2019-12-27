import React, { useMemo } from 'react';
import { createStore, Store, AnyAction, Action } from 'redux';
import { Provider, useSelector } from 'react-redux';
import { mount, ReactWrapper } from 'enzyme';

import useActionCreators from './useActionCreators';

const INCREMENT = 'INCREMENT';
const increment = (): Action<string> => ({ type: INCREMENT });
const actionCreators = { increment };

type State = {
    value: number;
};

const initialState = { value: 0 };
function reducer(state: State = initialState, { type }: Action<string>): State {
    return type === INCREMENT
        ? { value: state.value + 1 }
        : state;
}

function selector({ value }: State): number {
    return value;
}

function configureStore(): Store<State, AnyAction> {
    return createStore(reducer, { value: 0 });
}

function renderWithReduxProvider(jsx: React.ReactElement): ReactWrapper {
    const store = configureStore();

    return mount(
        <Provider store={ store }>
            { jsx }
        </Provider>
    );
}

describe('useActionCreators', () => {
    it('should return bound action creators', () => {
        const Component: Function = jest.fn(() => {
            const value = useSelector(selector);
            const actions = useActionCreators(actionCreators);

            return (
                <button onClick={ actions.increment }>{ value }</button>
            );
        });

        const wrapper = renderWithReduxProvider(<Component />);

        expect(Component).toHaveBeenCalledTimes(1);

        wrapper.find('button').simulate('click');

        expect(Component).toHaveBeenCalledTimes(2);
    });

    it('should memoize bound action creators', () => {
        const spy = jest.fn();

        const Component: Function = jest.fn(() => {
            const { value } = useSelector(selector);
            const actions = useActionCreators(actionCreators);

            useMemo(spy, [ actions.increment ]);

            return (
                <button onClick={ actions.increment }>{ value }</button>
            );
        });

        const wrapper = renderWithReduxProvider(<Component />);

        expect(spy).toHaveBeenCalledTimes(1);

        wrapper.find('button').simulate('click');

        expect(spy).toHaveBeenCalledTimes(1);
    });
});
