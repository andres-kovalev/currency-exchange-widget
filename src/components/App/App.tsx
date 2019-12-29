import React from 'react';
import { Provider } from 'react-redux';
import { StylesProvider } from '@material-ui/core/styles';

import configureStore from '../../store';
import { Routes } from '..';
import pockets from '../../const/pockets.json';

const store = configureStore({ pockets });

const App: React.FC = () => (
    <StylesProvider injectFirst>
        <Provider store={ store }>
            <Routes />
        </Provider>
    </StylesProvider>
);

export default App;
