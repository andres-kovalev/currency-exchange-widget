import { ActionCreator, Action } from 'redux';

import {
    SET_SOURCE_CURRENCY,
    SET_SOURCE_AMOUNT,
    SWAP_CURRENCIES,
    SET_DESTINATION_AMOUNT,
    SET_DESTINATION_CURRENCY,
    SET_RATE
} from './types';

type SimpleAction = Action<string>;

interface ActionWithPayload<T> extends Action<string> {
    payload: T;
}

type ActionCreatorFunction<T> = ActionCreator<ActionWithPayload<T>>;

export const setSourceCurrency: ActionCreatorFunction<string> = (currency: string) => ({
    type: SET_SOURCE_CURRENCY,
    payload: currency
});

export const setDestinationCurrency: ActionCreatorFunction<string> = (currency: string) => ({
    type: SET_DESTINATION_CURRENCY,
    payload: currency
});

export const swapCurrencies: ActionCreator<SimpleAction> = () => ({
    type: SWAP_CURRENCIES
});

export const setSourceAmount: ActionCreatorFunction<number> = (amount: number) => ({
    type: SET_SOURCE_AMOUNT,
    payload: amount
});

export const setDestinationAmount: ActionCreatorFunction<number> = (amount: number) => ({
    type: SET_DESTINATION_AMOUNT,
    payload: amount
});

export const setRate: ActionCreatorFunction<number> = (rate: number) => ({
    type: SET_RATE,
    payload: Math.round(rate * 10000) / 10000
});
