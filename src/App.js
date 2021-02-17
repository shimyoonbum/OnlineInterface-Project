import React, { useState } from 'react';
import classNames from 'classnames';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';

import './sass/App.scss';

import AppRouter from './components/AppRouter';
import AppTopbar from './components/AppTopbar';
import AppFooter from './components/AppFooter';
import AppMenu from './components/AppMenu';

const App = () => {
    const [mobileMenuActive, setMobileMenuActive] = useState(false);

    const onMenuButtonClick = () => {
        setMobileMenuActive(!mobileMenuActive);
    };

    const onMenuItemClick = () => {
        setMobileMenuActive(false);
    };

    const wrapperClassName = classNames('layout-wrapper', {
        'layout-sidebar-mobile-active': mobileMenuActive,
    });

    return (
        <div className={wrapperClassName}>
            <AppTopbar onMenuButtonClick={onMenuButtonClick} />

            <AppMenu onMenuItemClick={onMenuItemClick} />

            <div className="layout-content">
                <AppRouter />
                <AppFooter />
            </div>
        </div>
    );
};

export default App;
