import React from 'react';
import { Route, Redirect } from 'react-router';

import App from './components/App';
import Home from './components/Home';

export default (
    <Route components={App}>
        <Route path="/domotic" component={Home} />
        <Redirect from="*" to="/domotic" />
    </Route>
);
