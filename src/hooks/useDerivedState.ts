import { useRef, useCallback } from 'react';
import useUpdate from './useUpdate';

type Optional<T> = T | undefined;

type DerivedStateCallback<T> = (state?: T) => Optional<T>;

type SetStateFunction<T> = (state: T) => void;

/**
 * Custom hook to implement behaviour similar to static getDerivedStateFromProps()
 */
export default function useDerivedState<T>(
    callback: DerivedStateCallback<T>,
    initialValue?: T
): [ Optional<T>, SetStateFunction<T> ] {
    const state = useRef(initialValue);
    const update = useUpdate();
    const newState = callback(state.current);

    if (state.current !== newState) {
        state.current = newState;
    }

    const setState = useCallback((value: T) => {
        if (state.current === value) {
            return;
        }

        state.current = value;

        update();
    }, [ update ]);

    return [ state.current, setState ];
}
