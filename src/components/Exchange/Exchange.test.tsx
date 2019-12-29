import React from 'react';
import { shallow, mount, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import { Select, FormHelperText, Button } from '@material-ui/core';
import { act } from '@testing-library/react';

import styles from './Exchange.module.scss';

import Exchange from './Exchange';
import currencies from '../../const/currencies.json';
import configureStorage from '../../store';
import pockets from '../../const/pockets.json';
import NumberField from '../NumberField';
import * as RateService from '../../services/rateService';
import ErrorMessage from '../ErrorMessage';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

function renderWithReduxProvider(jsx: React.ReactElement): ReactWrapper {
    const store = configureStorage({ pockets });

    return mount(
        <Provider store={ store }>
            { jsx }
        </Provider>
    );
}

let mockRatePromise = Promise.resolve(0.1234);

function setRate(rate: number): void {
    mockRatePromise = Promise.resolve(rate);
}

function goSlow(): void {
    mockRatePromise = new Promise(noop);
}

function goOffline(): void {
    mockRatePromise = Promise.reject(new Error('Offline!'));
}

const waitForRate = (): Promise<void> => act(
    async () => {
        try {
            await mockRatePromise;
        } catch (e) {
            // do nothing
        }
    }
);

jest.mock('../../services/rateService', () => ({
    getRate: jest.fn(() => mockRatePromise)
}));

jest.useFakeTimers();

describe('Exchange', () => {
    beforeEach(() => {
        RateService.getRate.mockClear();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    describe('by default', () => {
        let wrapper: ReactWrapper;

        beforeEach(() => {
            goSlow();

            wrapper = renderWithReduxProvider(<Exchange />);
        });

        it('should select basic currencies', () => {
            const expectedCurrencies = currencies.slice(0, 2);

            const currencySelectors = wrapper.find(Select);

            expect(currencySelectors).toHaveLength(2);
            currencySelectors.forEach(
                (select, index) => expect(select).toHaveProp({
                    value: expectedCurrencies[index]
                })
            );
        });

        it('should set source and destination amount to 0', () => {
            const amountFields = wrapper.find(NumberField);

            expect(amountFields).toHaveLength(2);
            amountFields.forEach(
                (inputField) => expect(inputField).toHaveProp({
                    value: 0
                })
            );
        });

        it('should disable exchange button', () => {
            expect(getExchangeButton(wrapper)).toHaveProp({
                disabled: true
            });
        });

        it('should highlight active currencies (with active pockets)', () => {
            // those elements are not shown until select will be activated
            // i believe it's easier to take those from children prop
            const itemsElements = wrapper.find(Select).at(0).prop('children');

            expect(itemsElements).toHaveLength(currencies.length);

            React.Children.forEach(itemsElements, (menuItem) => {
                if (!menuItem) {
                    return;
                }

                const itemWrapper = shallow(menuItem as React.ReactElement);
                const value = itemWrapper.prop('value');

                if (!value) {
                    return;
                }

                if (value in pockets) {
                    expect(itemWrapper).toHaveClassName(styles.active);
                } else {
                    expect(itemWrapper).not.toHaveClassName(styles.active);
                }
            });
        });

        it('should request exchange rate after first render', () => {
            expect(RateService.getRate).toHaveBeenCalledTimes(1);
        });
    });

    describe('after rate loaded', () => {
        let wrapper: ReactWrapper;

        beforeEach(async () => {
            setRate(0.1234);

            wrapper = renderWithReduxProvider(<Exchange />);

            await waitForRate();
        });

        it('should keep exchange button disabled', () => {
            expect(getExchangeButton(wrapper)).toHaveProp({
                disabled: true
            });
        });

        it('should enable exchange button when source amount is present and less than available amount', () => {
            const sourceAmountInput = getSourceInput(wrapper);
            setInputValue(sourceAmountInput, '- 1');

            expect(getExchangeButton(wrapper)).toHaveProp({
                disabled: false
            });
        });

        it('should disable exchange button when source amount is greater than available amount', () => {
            const sourceAmountInput = getSourceInput(wrapper);
            setInputValue(sourceAmountInput, '- 10001');

            expect(getExchangeButton(wrapper)).toHaveProp({
                disabled: true
            });
        });

        it('should update destination amount when source amount changed', () => {
            const sourceAmountInput = getSourceInput(wrapper);
            setInputValue(sourceAmountInput, '- 100');

            expect(getDestinationInput(wrapper)).toHaveProp({
                value: 12.34
            });
        });

        it('should update source amount when destination amount changed', () => {
            const destinationAmountInput = getDestinationInput(wrapper);
            setInputValue(destinationAmountInput, '+ 12.34');

            expect(getSourceInput(wrapper)).toHaveProp({
                value: 100
            });
        });

        it('should update available amount after exchange', () => {
            const expectedBalances = [ 9900, 112.34 ];
            const sourceAmountInput = getSourceInput(wrapper);

            setInputValue(sourceAmountInput, '- 100');

            act(() => {
                getExchangeButton(wrapper).simulate('click');
            });

            const balances = wrapper.find(FormHelperText);

            expect(balances).toHaveLength(2);

            balances.forEach((balance, index) => {
                expect(balance.text()).toContain(expectedBalances[index]);
            });
        });

        it('should request exchange rate each 10 seconds', async () => {
            expect(RateService.getRate).toHaveBeenCalledTimes(1);

            await act(async () => {
                jest.runAllTimers();

                return Promise.resolve();
            });

            expect(RateService.getRate).toHaveBeenCalledTimes(2);
        });
    });

    it('should show an error message when rate end-point is not available', async () => {
        const consoleSpy = jest.spyOn(console, 'error');
        consoleSpy.mockImplementation(noop);

        try {
            goOffline();

            const wrapper = renderWithReduxProvider(<Exchange />);

            await waitForRate();

            wrapper.update();

            expect(wrapper.find(ErrorMessage)).toHaveProp({ open: true });
            // eslint-disable-next-line @typescript-eslint/unbound-method, no-console
            expect(console.error).toHaveBeenCalled();
        } finally {
            consoleSpy.mockRestore();
        }
    });
});

function getExchangeButton(wrapper: ReactWrapper): ReactWrapper {
    return wrapper.find(Button).filter({ color: 'primary' });
}

function getSourceInput(wrapper: ReactWrapper): ReactWrapper {
    return getInputWithSign(wrapper, '-');
}

function getDestinationInput(wrapper: ReactWrapper): ReactWrapper {
    return getInputWithSign(wrapper, '+');
}

function getInputWithSign(wrapper: ReactWrapper, sign: string): ReactWrapper {
    return wrapper.find(NumberField).filter({ sign });
}

function setInputValue<T>(input: ReactWrapper<T>, value: string): void {
    input.find('input').simulate('change', { target: { value } });
}
