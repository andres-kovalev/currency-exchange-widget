import reducer from './reducer';
import * as actions from './actions';

const initialState = {
    pockets: {
        PLN: 1000,
        EUR: 10
    }
};

describe('Redux#reducer', () => {
    describe('on exchange action', () => {
        it('should reduce source pocket amount', () => {
            const source = {
                currency: 'PLN',
                amount: 430
            };
            const destination = {
                currency: 'EUR',
                amount: 100
            };

            const newState = reducer(initialState, actions.exchange(source, destination));

            expect(newState.pockets.PLN).toBe(570);
        });

        it('should increase destination pocket amount', () => {
            const source = {
                currency: 'PLN',
                amount: 430
            };
            const destination = {
                currency: 'EUR',
                amount: 110
            };

            const newState = reducer(initialState, actions.exchange(source, destination));

            expect(newState.pockets.EUR).toBe(120);
        });

        it('should create new pocket if needed', () => {
            const source = {
                currency: 'PLN',
                amount: 380
            };
            const destination = {
                currency: 'USD',
                amount: 100
            };

            const newState = reducer(initialState, actions.exchange(source, destination));

            expect(newState.pockets.USD).toBe(100);
        });

        it('should skip exchange in case of insufficient funds', () => {
            const source = {
                currency: 'PLN',
                amount: 4300
            };
            const destination = {
                currency: 'EUR',
                amount: 1000
            };

            const newState = reducer(initialState, actions.exchange(source, destination));

            expect(newState).toBe(initialState);
        });

        it('should skip exchange from not existing pockets', () => {
            const source = {
                currency: 'USD',
                amount: 100
            };
            const destination = {
                currency: 'PLN',
                amount: 380
            };

            const newState = reducer(initialState, actions.exchange(source, destination));

            expect(newState).toBe(initialState);
        });
    });
});
