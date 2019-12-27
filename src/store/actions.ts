import { Action } from 'redux';
import { EXCHANGE } from './types';

interface Source {
    currency: string;
    amount: number;
}

interface Payload {
    source: Source;
    destination: Source;
}

interface ExchangeAction extends Action {
    payload: Payload;
}

// eslint-disable-next-line import/prefer-default-export
export const exchange = (source: Source, destination: Source): ExchangeAction => ({
    type: EXCHANGE,
    payload: { source, destination }
});
