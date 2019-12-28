import React, { useCallback, useEffect, useMemo } from 'react';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { Select, MenuItem, FormHelperText, Button, IconButton, FormControl } from '@material-ui/core';
import { SwapVert, TrendingUp } from '@material-ui/icons';

import styles from './Exchange.module.scss';

import { useStore } from '../../hooks';
import reducer, { State } from './state/reducer';
import * as actionCreators from './state/actions';
import createAsyncTimer from '../../helper/asyncTimer';
import * as RateService from '../../services/rateService';
import { useActions } from '../../store';
import currencies from '../../const/currencies.json';
import { NumberField } from '..';
import { GlobalState, Pockets } from '../../store/reducer';

const TIMEOUT = 10000;

const initialState: State = {
    source: {
        /*
            let's assume our currencies ordered by priority:
            1st - user currency, 2nd-4th - common currencies (EUR, GBP, USD), 5th-... - rest
         */
        currency: currencies[0],
        amount: 0
    },
    destination: {
        currency: currencies[1],
        amount: 0
    },
    active: 'source',
    rate: 0
};

const sourceInfoClasses = cx(styles.pocket, styles.info);
const smallPanelClasses = cx(styles.panel, styles.small);
const largePanelClasses = cx(styles.panel, styles.large);
const rateButtonClasses = cx(styles.panelButton, styles.medium);
const destinationClasses = cx(styles.pocket, styles.destination);
const destinationInfoClasses = cx(styles.pocket, styles.info, styles.destination);

const Exchange: React.FC = () => {
    // there is no need to pollute global storage with widget local state, so let's leave it here
    const [ state, actions ] = useStore(reducer, actionCreators, initialState);
    const handleSourceCurrencyChange = useCallback(
        (event: React.ChangeEvent<{ value: unknown }>) =>
            actions.setSourceCurrency(event.target.value as string),
        [ actions ]
    );
    const handleDestinationCurrencyChange = useCallback(
        (event: React.ChangeEvent<{ value: unknown }>) =>
            actions.setDestinationCurrency(event.target.value as string),
        [ actions ]
    );

    const openHistory = (): void => {
        // eslint-disable-next-line
        alert('Not implemented yet.');
    };

    useEffect(() => createAsyncTimer(
        async () => {
            try {
                const rate = await RateService.getRate(
                    state.source.currency,
                    state.destination.currency
                );

                actions.setRate(rate);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }
        }, TIMEOUT
    ), [ state.source.currency, state.destination.currency, actions ]);

    const pockets = useSelector(pocketsSelector);

    const sourceAvailable: number = pockets[state.source.currency] || 0;
    const destinationAvailable: number = pockets[state.destination.currency] || 0;

    const { exchange } = useActions();
    const handleExchangeClick = (): void => {
        exchange(state.source, state.destination);
    };

    const isReady = state.source.amount > 0 && state.rate > 0;
    const isValid = state.source.amount <= sourceAvailable;

    // reorder currencies to show active first
    const orderedCurrencies = useMemo(
        () => currencies
            .filter(
                (currency) => currency in pockets
            ).map(
                (currency) => renderCurrency(currency, styles.active)
            )
            .concat(
                currencies
                    .filter(
                        (currency) => !(currency in pockets)
                    ).map(
                        (currency) => renderCurrency(currency)
                    )
            ),
        [ pockets ]
    );

    return (
        <React.Fragment>
            <div className={ styles.grid }>
                <div className={ styles.pocket }>
                    <Select
                        value={ state.source.currency }
                        onChange={ handleSourceCurrencyChange }
                        aria-label="Source currency"
                    >
                        { orderedCurrencies }
                    </Select>
                    <NumberField
                        sign='-'
                        value={ state.source.amount }
                        onChange={ actions.setSourceAmount }
                        invalid={ !isValid }
                        aria-label="Source amount"
                    />
                </div>
                <div className={ sourceInfoClasses }>
                    <FormHelperText>
                        { `Available: ${sourceAvailable} ${state.source.currency}` }
                    </FormHelperText>
                    { !isValid && <FormHelperText className={ styles.right }>
                        Insufficient funds
                    </FormHelperText> }
                </div>
                <div className={ smallPanelClasses }>
                    <IconButton
                        color="secondary"
                        className={ styles.panelButton }
                        size="small"
                        onClick={ actions.swapCurrencies }
                        aria-label="Swap currencies"
                    >
                        <SwapVert />
                    </IconButton>
                </div>
                <div className={ largePanelClasses }>
                    <Button
                        color="secondary"
                        variant="outlined"
                        className={ rateButtonClasses }
                        size="small"
                        onClick={ openHistory }
                        aria-label="Show history"
                    >
                        <TrendingUp /> { `1 ${state.source.currency} = ${state.rate || '?'} ${state.destination.currency}` }
                    </Button>
                </div>
                <div className={ destinationClasses }>
                    <Select
                        value={ state.destination.currency }
                        onChange={ handleDestinationCurrencyChange }
                        aria-label="Destination currency"
                    >
                        { orderedCurrencies }
                    </Select>
                    <FormControl fullWidth>
                        <NumberField
                            sign='+'
                            value={ state.destination.amount }
                            onChange={ actions.setDestinationAmount }
                            aria-label="Destination amount"
                        />
                    </FormControl>
                </div>
                <div className={ destinationInfoClasses }>
                    <FormHelperText>
                        { `Available: ${destinationAvailable} ${state.destination.currency}` }
                    </FormHelperText>
                </div>
                <div className={ styles.footer }>
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        className={ styles.wide }
                        onClick={ handleExchangeClick }
                        disabled={ !isReady || !isValid }
                    >
                        Exchange
                    </Button>
                </div>
            </div>
        </React.Fragment>
    );
};

function pocketsSelector({ pockets }: GlobalState): Pockets {
    return pockets;
}

function renderCurrency(currency: string, className?: string): React.ReactElement {
    return (
        <MenuItem
            key={ currency }
            value={ currency }
            className={ className }
        >
            { currency }
        </MenuItem>
    );
}

export default Exchange;
