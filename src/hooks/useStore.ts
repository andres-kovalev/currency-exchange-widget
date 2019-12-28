import { useReducer, useMemo } from 'react';
import { bindActionCreators, ActionCreatorsMapObject, Dispatch } from 'redux';

/**
 * Custom hook - wrapper above useReducer() to bind action creators
 */
export default function useStore<T, M extends ActionCreatorsMapObject<T>, S>(
    reducer: React.Reducer<S, T>,
    actionCreators: M, initialState: S
): [ S, M ] {
    const [ state, dispatch ] = useReducer(reducer, initialState);

    const boundActionCreators = useMemo(
        () => bindActionCreators(actionCreators, dispatch as Dispatch),
        /*
            there is no need to add dispatch as a dependency
            since React guarantees that dispatch function identity
            is stable and won’t change on re-renders
        */
        [ actionCreators ]
    );

    return [ state, boundActionCreators ];
}
