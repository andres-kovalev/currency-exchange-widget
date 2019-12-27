import { useActionCreators } from '../hooks';
import * as actions from './actions';

/**
 * Custom hook to get bound action creators (memoized)
 */
export default function useActions(): typeof actions {
    return useActionCreators(actions);
}
