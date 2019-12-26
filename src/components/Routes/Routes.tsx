import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Exchange } from '..';

const Routes: React.FC = () => (
    <BrowserRouter>
        <Switch>
            <Route path='/exchange'>
                <Exchange />
            </Route>
            {/* since no screens implemented except exchange we need to redirect */}
            <Route path='/'>
                <Redirect to="/exchange" />
            </Route>
        </Switch>
    </BrowserRouter>
);

export default Routes;
