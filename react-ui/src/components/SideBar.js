import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';

class SideBar extends Component {
    render () {
        return (
            <nav className="sidebar">
                <ul className="sidebar-links">
                    {this.props.data.map(product => (
                        <li className="sidebar-item" key={product.key}>
                            <NavLink to={'/product/' + product.key} activeClassName="selected">{product.title}</NavLink>
                            <ul>
                                {product.usertypes.map(userType => (
                                    <li className="sidebar-item" key={userType.key}>
                                        <NavLink to={'/usertype/' + userType.key} activeClassName="selected">{userType.title}</NavLink>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    }
}

export default SideBar;