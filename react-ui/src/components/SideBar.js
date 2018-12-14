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
                            <li className="products" key={product.id}>
                                <NavLink to={'/product/' + product.id} activeClassName="selected">{product.title}</NavLink>
                                <ul>
                                    {Array.isArray(product.usertypes) && product.usertypes.map(userType => (
                                        <li className="usertypes" key={userType.id}>
                                            <NavLink to={'/usertype/' + userType.id} activeClassName="selected">{userType.title}</NavLink>
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