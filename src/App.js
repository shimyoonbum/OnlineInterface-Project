import React, { Component } from 'react';
import { AppMenu } from './components/AppMenu';
import classNames from 'classnames';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';

import './sass/App.scss';

import AppRouter from './components/AppRouter';
import AppTopbar from './components/AppTopbar';
import AppFooter from './components/AppFooter';

export class App extends Component {

    constructor() {
        super();
        this.state = {
            mobileMenuActive: false
        };

        this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
    }

    onMenuButtonClick() {
        this.setState({ mobileMenuActive: !this.state.mobileMenuActive });
    }

    onMenuItemClick() {
        this.setState({ mobileMenuActive: false });
    }

    render() {
        const wrapperClassName = classNames('layout-wrapper', {
            'layout-sidebar-mobile-active': this.state.mobileMenuActive
        });

        return (
            <div className={wrapperClassName}>

                <AppTopbar onMenuButtonClick={this.onMenuButtonClick}/>

                <AppMenu onMenuItemClick={this.onMenuItemClick}/>

                <div className="layout-content">
                    <AppRouter />
                    <AppFooter />
                </div>
            </div>
        );
    }
}

export default App;
