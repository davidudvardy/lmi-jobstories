import React, {Component} from 'react';

class Force extends Component {
    constructor(props) {
        super(props);
        this.handleForceUpdate = this.handleForceUpdate.bind(this);
    }

    handleForceUpdate(event) {
        this.props.onForceUpdate({
            id: this.props.jobId,
            type: "force",
            forceId: this.props.forceId,
            updatedText: event.target.value
        });
    }

    render() {
        let wrapText = (text, editing) => {
            if(!editing) {
                return (
                    <p>
                        {text}
                    </p>
                );
            } else {
                return (
                    <p>
                        <textarea 
                            type="text" 
                            value={text} 
                            onChange={this.handleForceUpdate}
                        />
                    </p>
                )
            }
        }

        return (
            <div>
                {wrapText(this.props.text, this.props.editing)}
            </div>
        );
    }

}


export default Force;