import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

class SideBar extends Component {
    render () {
        return (
            <nav>
                <div className="sticky">
                    <h2>Filters</h2>
                    <ul>
                        {this.props.data.map(product => (
                            <li className="products" key={product.key}>
                                <NavLink to={'/product/' + product.key} activeClassName="selected">{product.title}</NavLink>
                                <ul>
                                    {product.usertypes.map(userType => (
                                        <li className="usertypes" key={userType.key}>
                                            <NavLink to={'/usertype/' + userType.key} activeClassName="selected">{userType.title}</NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        );
    }
}

export default SideBar;