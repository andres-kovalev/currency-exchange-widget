import React from 'react';
import { shallow, mount, ShallowWrapper } from 'enzyme';
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';

import ErrorMessage from './ErrorMessage';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

describe('ErrorMessage', () => {
    describe('by default', () => {
        let wrapper: ShallowWrapper;

        beforeEach(() => {
            wrapper = shallow(
                <ErrorMessage
                    message="Test message"
                    onClose={ noop }
                />
            );
        });

        it('should render as expected', () => {
            expect(wrapper).toMatchSnapshot();
        });

        it('should render itself using Snackbar component', () => {
            expect(wrapper.find(Snackbar)).toExist();
            expect(wrapper.find(SnackbarContent)).toExist();
        });

        it('should render itself not opened', () => {
            const snackbar = wrapper.find(Snackbar);

            expect(snackbar).toHaveProp({ open: false });
        });
    });

    it('should render itself with provided message', () => {
        const wrapper = mount(
            <ErrorMessage
                open
                message="Test message"
                onClose={ noop }
            />
        );
        const messageSpan = wrapper.find('#error-message');

        expect(messageSpan).toHaveText('Test message');
    });

    it('should call onClose callback on close button click', () => {
        const onClose = jest.fn();

        const wrapper = mount(
            <ErrorMessage
                open
                message="Test message"
                onClose={ onClose }
            />
        );
        const closeButton = wrapper.find(IconButton);

        expect(onClose).not.toHaveBeenCalled();

        closeButton.simulate('click');

        expect(onClose).toHaveBeenCalled();
    });
});
