import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class HomeComponent extends Component {

    render() {
        return (
            <div className="home">
                <div className="introduction">
                    <h1>The Most Complete UI Framework</h1>
                    <h2>for REACT</h2>

                    <Link to="/setup" className="link-button">Get Started</Link>
                </div>
                <div className="features">
                    <h3>Why PrimeReact?</h3>
                    <p className="features-tagline">Congratulations! <span role="img" aria-label="celebrate">🎉</span> Your quest to find the UI library for React is complete.</p>

                    <p className="features-description">PrimeReact is a collection of rich UI components for React. All widgets are open source and free to use under MIT License. PrimeReact is developed by PrimeTek Informatics,
                        a vendor with years of expertise in developing open source UI solutions. For project news and updates, please <a href="https://twitter.com/primereact" className="layout-content-link">follow us on twitter</a> and <a href="https://www.primefaces.org/category/primereact/" className="layout-content-link">visit our blog</a>.</p>

                </div>
            </div>        
        );
    }
}
