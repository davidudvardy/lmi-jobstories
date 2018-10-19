import React, {Component} from 'react';

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            originalText: this.props.text,
            renderedText: this.props.text
        };
    }

    handleChange(event) {
        this.setState({
            renderedText: event.target.value
        })
    }

    render() {
        return (
            <div className={"list-group-item list-group-item-action flex-row align-items-start " + this.props.type.toLowerCase()}>
                <small style={{textTransform: 'capitalize'}}>{this.props.type}</small>
                <p className="mb-1">
                    <textarea 
                        type="text" 
                        readOnly={!this.props.editing} 
                        value={this.state.renderedText} 
                        onChange={this.handleChange.bind(this)}
                    /></p>
            </div>
        )
    }
}

export default Card;