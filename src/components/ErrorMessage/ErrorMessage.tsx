import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import { Error, Close } from '@material-ui/icons';

import styles from './ErrorMessage.module.scss';

type VerticalAlignment = 'top' | 'bottom';
type HorizontalAlignment = 'left' | 'right' | 'center';

interface SnackbarAnchorOrigin {
    vertical: VerticalAlignment;
    horizontal: HorizontalAlignment;
}

const anchorOrigin: SnackbarAnchorOrigin = {
    vertical: 'top',
    horizontal: 'center'
};

interface ErrorMessageProps {
    open?: boolean;
    autoHideDuration?: number;
    message: string;
    onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    open = false,
    autoHideDuration = 3000,
    message, onClose
}) => (
    <Snackbar
        anchorOrigin={ anchorOrigin }
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
    >
        <SnackbarContent
            className={styles.container}
            aria-describedby="error-message"
            message={
                <span id="error-message" className={styles.message}>
                    <Error className={cx(styles.icon, styles.errorIcon)} />
                    { message }
                </span>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="close"
                    color="inherit"
                    onClick={ onClose }
                >
                    <Close className={styles.icon} />
                </IconButton>
            ]}
        />
    </Snackbar>
);

ErrorMessage.propTypes = {
    open: PropTypes.bool,
    autoHideDuration: PropTypes.number,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ErrorMessage;
