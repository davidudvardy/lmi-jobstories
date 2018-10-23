import React, {Component} from 'react';

class Card extends Component {
    constructor(props) {
        super(props);
        this.handleCardUpdate = this.handleCardUpdate.bind(this);
    }

    handleCardUpdate(event) {
        this.props.onCardUpdate({
            id: this.props.jobId,
            type: this.props.type,
            updatedText: event.target.value
        });
    }

    render() {
        let wrapText = (text, editing) => {
            if(!editing) {
                return (
                    <p>{text}</p>
                );
            } else {
                return (
                    <p><textarea 
                        type="text" 
                        value={text} 
                        onChange={this.handleCardUpdate}
                    /></p>
                )
            }
        }

        return (
            <div className={"list-group-item list-group-item-action flex-row align-items-start " + this.props.type.toLowerCase()}>
                <small style={{textTransform: 'capitalize'}}>{this.props.type}</small>
                {wrapText(this.props.text, this.props.editing)}
            </div>
        );
    }

}


export default Card;