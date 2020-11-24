import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

// Sample Case
import { DummyIF } from './pages/DummyIF';
import { IFLogs } from './pages/IFLogs';
import { IFBackup } from './pages/IFBackup';
import { HomeComponent } from './pages/Home';

class AppRouter extends Component {
    render() {
        return (
            <React.Fragment>       
                <Route exact path="/" component={HomeComponent} />

                <Route path="/dummyIF" component={DummyIF} />
                <Route path="/IFLogs" component={IFLogs} />
                <Route path="/IFBackup" component={IFBackup} />
            </React.Fragment>
        );
    }
}

export default withRouter(AppRouter);
