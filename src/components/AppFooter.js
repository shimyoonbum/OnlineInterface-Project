import React from 'react';

const AppFooter = () => {
    const version = require('../../package.json') && require('../../package.json').version;

    return (
        <div className="content-section layout-footer clearfix" style={{padding : '5px 30px 5px 30px'}}>
            <span>중계서버 관리화면 {version}.Ver by <a href="http://www.pulmuone.com" target="_blank" rel="noopener noreferrer">풀무원</a></span>
        </div>
    );
};

export default AppFooter;