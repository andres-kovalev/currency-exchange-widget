import reducer, { State } from './reducer';
import * as actions from './actions';

const initialState: State = {
    source: {
        currency: 'PLN',
        amount: 10000
    },
    destination: {
        currency: 'EUR',
        amount: 2344
    },
    rate: 0.2344,
    active: 'source'
};

describe('Exchange', () => {
    describe('reducer', () => {
        describe('on setSourceCurrency action', () => {
            let newState: State;

            beforeEach(() => {
                newState = reducer(initialState, actions.setSourceCurrency('EUR'));
            });

            it('should set source currency', () => {
                expect(newState.source.currency).toBe('EUR');
            });

            it('should reset rate', () => {
                expect(newState.rate).toBe(0);
            });

            it('should prevent source and destination currencies from being equal', () => {
                expect(newState.destination.currency).toBe('PLN');
            });
        });

        describe('on setDestinationCurrency action', () => {
            let newState: State;

            beforeEach(() => {
                newState = reducer(initialState, actions.setDestinationCurrency('PLN'));
            });

            it('should set destination currency', () => {
                expect(newState.destination.currency).toBe('PLN');
            });

            it('should reset rate', () => {
                expect(newState.rate).toBe(0);
            });

            it('should prevent source and destination currencies from being equal', () => {
                expect(newState.source.currency).toBe('EUR');
            });
        });

        describe('on swapCurrencies action', () => {
            let newState: State;

            beforeEach(() => {
                newState = reducer(initialState, actions.swapCurrencies());
            });

            it('should swap pockets currencies', () => {
                expect(newState.source.currency).toBe('EUR');
                expect(newState.destination.currency).toBe('PLN');
            });

            it('should swap pockets amounts', () => {
                expect(newState.source.amount).toBe(2344);
                expect(newState.destination.amount).toBe(10000);
            });

            it('should reset rate', () => {
                expect(newState.rate).toBe(0);
            });

            it('should change active pocket', () => {
                expect(newState.active).toBe('destination');
            });
        });

        describe('on setSourceAmount action', () => {
            let newState: State;

            beforeEach(() => {
                newState = reducer(initialState, actions.setSourceAmount(100));
            });

            it('should set source amount', () => {
                expect(newState.source.amount).toBe(100);
            });

            it('should set source pocket as active', () => {
                expect(newState.active).toBe('source');
            });

            it('should re-calculate destination amount using current rate', () => {
                expect(newState.destination.amount).toBe(23.44);
            });
        });

        describe('on setDestinationAmount action', () => {
            let newState: State;

            beforeEach(() => {
                newState = reducer(initialState, actions.setDestinationAmount(100));
            });

            it('should set destination amount', () => {
                expect(newState.destination.amount).toBe(100);
            });

            it('should set destination pocket as active', () => {
                expect(newState.active).toBe('destination');
            });

            it('should re-calculate source amount using current rate', () => {
                expect(newState.source.amount).toBe(426.62);
            });
        });

        describe('on setRate action', () => {
            let newState: State;

            beforeEach(() => {
                newState = reducer(initialState, actions.setRate(0.5));
            });

            it('should set rate', () => {
                expect(newState.rate).toBe(0.5);
            });

            it('should re-calculate inactive pocket amount using new rate', () => {
                expect(newState.destination.amount).toBe(5000);
            });
        });
    });
});
