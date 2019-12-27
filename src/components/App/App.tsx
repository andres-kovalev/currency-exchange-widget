import React from 'react';
import { Provider } from 'react-redux';

import configureStore from '../../store';
import { Routes } from '..';
import pockets from '../../const/pockets.json';

const store = configureStore({ pockets });

const App: React.FC = () => (
    <Provider store={ store }>
        <Routes />
    </Provider>
);

export default App;
