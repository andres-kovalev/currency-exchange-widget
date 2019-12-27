import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators, ActionCreatorsMapObject } from 'redux';

/**
 * Custom hook to memoize bound action creators
 */
export default function useActionCreators<T, M extends ActionCreatorsMapObject<T>>(actions: M): M {
    const dispatch = useDispatch();

    return useMemo(
        () => bindActionCreators(actions, dispatch),
        [ actions, dispatch ]
    );
}
