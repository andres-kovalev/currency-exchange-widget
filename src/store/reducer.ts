import { AnyAction } from 'redux';
import produce from 'immer';

import { EXCHANGE } from './types';
import { round } from '../helper/math';

export interface Pockets {
    [key: string]: number;
}

export interface GlobalState {
    pockets: Pockets;
}

const initialState = {
    pockets: {}
};

export default (
    state: GlobalState = initialState,
    { type, payload }: AnyAction
): GlobalState => {
    switch (type) {
        case EXCHANGE: {
            const { source, destination } = payload;

            if (source.amount > (state.pockets[source.currency] || 0)) {
                return state;
            }

            return produce(state, ({ pockets }: { pockets: Pockets }) => {
                /* eslint-disable no-param-reassign */
                pockets[source.currency] = round(pockets[source.currency] - source.amount);
                pockets[destination.currency] = round(
                    (pockets[destination.currency] || 0) + destination.amount
                );
                /* eslint-enable no-param-reassign */
            });
        }
        default:
            return state;
    }
};
