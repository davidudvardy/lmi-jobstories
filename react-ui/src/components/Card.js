import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false
        }
        this.handleCardUpdate = this.handleCardUpdate.bind(this);
        this.handleCardFocus = this.handleCardFocus.bind(this);
        this.handleCardBlur = this.handleCardBlur.bind(this);
    }

    handleCardUpdate(event) {
        this.props.onCardUpdate({
            id: this.props.jobId,
            type: this.props.type,
            updatedText: event.target.value
        });
    }

    handleCardFocus(event) {
        this.setState({
            focused: true
        });
    }

    handleCardBlur(event) {
        this.setState({
            focused: false
        });
    }

    render() {
        let cardClassNames = 'card ';
        cardClassNames += this.props.type.toLowerCase();
        cardClassNames += this.state.focused ? ' focused' : '';

        let wrapText = (text, editing) => {
            if(!editing) {
                return (
                    <p>
                        <Link 
                            to={'?job=' + this.props.jobId}
                        >
                            {text}
                        </Link>
                    </p>
                );
            } else {
                return (
                    <p>
                        <textarea 
                            type="text" 
                            value={text} 
                            onChange={this.handleCardUpdate}
                            onFocus={this.handleCardFocus}
                            onBlur={this.handleCardBlur}
                        />
                    </p>
                )
            }
        }

        return (
            <div className={cardClassNames}>
                <h2>{this.props.type}</h2>
                {wrapText(this.props.text, this.props.editing)}
            </div>
        );
    }

}


export default Card;