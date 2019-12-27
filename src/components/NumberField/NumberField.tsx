import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { TextField } from '@material-ui/core';

import styles from './NumberField.module.scss';

import { useDerivedState } from '../../hooks';
import { floor } from '../../helper/math';

type Sign = '-' | '+';

interface NumberFieldProps {
    onChange?: (value: number) => void;
    value?: number;
    sign?: Sign;
    invalid?: boolean;
}

const formatRegExp = /^([+-]\s)?\d+(\.\d{0,2})?$/;

/**
 * Separate component to input numbers - responsible for correct number format
 */
const NumberField: React.FC<NumberFieldProps> = ({ onChange, sign, value, invalid, ...props }) => {
    const normalizedValue = normalizeValue(value);
    /**
     * We hold formatted value in local state (instead of formatting each time original value)
     * to let user enter dot ('1.') and leading decimal zeroes ('1.0')
     */
    const [ formattedValue, setFormattedValue ] = useDerivedState<string>(
        (state) => (restoreValue(state) === normalizedValue
            ? state
            : formatValue(normalizedValue.toString(), sign)),
        ''
    );

    const handleValueChange: React.ChangeEventHandler<HTMLInputElement> = ({ target }) => {
        const extractedValue = extractValue(target.value);

        if (extractedValue && !target.value.match(formatRegExp)) {
            return;
        }

        const newValue = restoreValue(extractedValue);
        setFormattedValue(formatValue(extractedValue, sign));

        if (newValue === normalizedValue) {
            return;
        }

        if (onChange) {
            onChange(newValue);
        }
    };

    const inputProps = {
        className: cx({
            [styles.invalid]: !!invalid
        })
    };

    return (
        <TextField
            placeholder="0"
            { ...props }
            inputProps={inputProps}
            value={ formattedValue }
            onChange={ handleValueChange }
        />
    );
};

NumberField.propTypes = {
    onChange: PropTypes.func,
    sign: PropTypes.oneOf([ '+', '-' ]),
    value: PropTypes.number,
    invalid: PropTypes.bool
};

NumberField.defaultProps = {
    invalid: false
};

/**
 * Normalizes value by removing all decimals except first two
 */
function normalizeValue(value = 0): number {
    const normalizedValue = floor(value);

    return Number.isNaN(normalizedValue)
        ? 0
        : normalizedValue;
}

/**
 * Generates value to put into input field
 * - adds sign to non-zero values
 * - returns empty string for zero to let input field to show placeholder
 */
function formatValue(value: string, sign?: Sign): string {
    return parseFloat(value)
        ? `${sign} ${fixLeadingZeroes(value)}`
        : '';
}

const signRegExp = /^([+-]\s)?(.*)$/;

/**
 * Removes sign from formatted value
 */
function extractValue(value: string): string {
    const match = value.match(signRegExp);

    if (!match) {
        return '';
    }

    return match[2];
}

/**
 * Restores normalized value from formatted one
 */
function restoreValue(value = ''): number {
    return normalizeValue(parseFloat(extractValue(value)));
}

/**
 * Removes leading zeroes
 */
function fixLeadingZeroes(value: string): string {
    return value.toString().replace(/^(0(?!\.))+/, '');
}

export default NumberField;
