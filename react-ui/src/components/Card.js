import React from 'react';

function Card(props) {
    return (
        <div className={"list-group-item list-group-item-action flex-row align-items-start " + props.type.toLowerCase()} style={{maxWidth: 20 + 'rem'}}>
            <small style={{textTransform: 'capitalize'}}>{props.type}</small>
            <p className="mb-1">{props.text}</p>
        </div>
    )
}

export default Card;