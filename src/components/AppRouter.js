import React from 'react';
import { Route } from 'react-router-dom';

import { DummyIF } from '../pages/DummyIF';
import { IFLogs } from '../pages/IFLogs';
import IFBackup from '../pages/IFBackup';
import Home from '../pages/Home';

const AppRouter = () => {
    return (
        <React.Fragment>       
            <Route exact path="/" component={Home} />

            <Route path="/dummyIF" component={DummyIF} />
            <Route path="/IFLogs" component={IFLogs} />
            <Route path="/IFBackup" component={IFBackup} />
        </React.Fragment>
    );
};

export default AppRouter;