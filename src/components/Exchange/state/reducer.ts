import produce from 'immer';
import { AnyAction } from 'redux';

import {
    SET_SOURCE_CURRENCY,
    SET_DESTINATION_CURRENCY,
    SET_SOURCE_AMOUNT,
    SET_DESTINATION_AMOUNT,
    SWAP_CURRENCIES,
    SET_RATE
} from './types';
import { round } from '../../../helper/math';

export interface Pocket {
    currency: string;
    amount: number;
}

export type PocketType = 'source' | 'destination';

export interface State {
    source: Pocket;
    destination: Pocket;
    active: PocketType;
    rate: number;
}

export default (state: State, { type, payload }: AnyAction): State => {
    switch (type) {
        case SET_SOURCE_CURRENCY:
            return setCurrency(state, 'source', payload);
        case SET_DESTINATION_CURRENCY:
            return setCurrency(state, 'destination', payload);
        case SWAP_CURRENCIES:
            return produce(state, (draft: State): void => {
                /* eslint-disable no-param-reassign */
                Object.assign(draft, {
                    source: draft.destination,
                    destination: draft.source,
                    rate: 0,
                    active: draft.active === 'source'
                        ? 'destination'
                        : 'source'
                });
                /* eslint-enable no-param-reassign */
            });
        case SET_SOURCE_AMOUNT:
            return produce(state, (draft: State) => {
                /* eslint-disable no-param-reassign */
                draft.source.amount = payload;
                draft.destination.amount = round(payload * draft.rate);
                draft.active = 'source';
                /* eslint-enable no-param-reassign */
            });
        case SET_DESTINATION_AMOUNT:
            return produce(state, (draft: State) => {
                /* eslint-disable no-param-reassign */
                draft.source.amount = round(payload / draft.rate);
                draft.destination.amount = payload;
                draft.active = 'destination';
                /* eslint-enable no-param-reassign */
            });
        case SET_RATE:
            return produce(state, (draft: State) => {
                /* eslint-disable no-param-reassign */
                if (draft.active === 'source') {
                    draft.destination.amount = round(draft.source.amount * payload);
                } else {
                    draft.source.amount = round(draft.destination.amount / payload);
                }

                draft.rate = payload;
                /* eslint-enable no-param-reassign */
            });
        default:
            return state;
    }
};

function setCurrency(state: State, primaryType: PocketType, currency: string): State {
    const secondaryType = primaryType === 'source'
        ? 'destination'
        : 'source';

    return produce(state, (draft: State): void => {
        /* eslint-disable no-param-reassign */
        if (draft[secondaryType].currency === currency) {
            draft[secondaryType].currency = draft[primaryType].currency;
        }

        draft[primaryType].currency = currency;

        draft.rate = 0;
        /* eslint-enable no-param-reassign */
    });
}
