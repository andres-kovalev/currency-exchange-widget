import { createStore, Store, AnyAction } from 'redux';
import reducer, { GlobalState } from './reducer';

export { default as useActions } from './useActions';

export default (initialState: GlobalState): Store<GlobalState, AnyAction> =>
    createStore(reducer, initialState);
