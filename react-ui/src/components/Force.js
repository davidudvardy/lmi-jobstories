import React, {Component} from 'react';

class Force extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false
        }
        this.handleForceUpdate = this.handleForceUpdate.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleForceUpdate(event) {
        this.props.onForceUpdate({
            id: this.props.jobId,
            type: "force",
            forceId: this.props.forceId,
            updatedText: event.target.value
        });
    }

    handleFocus(event) {
        this.setState({
            focused: true
        });
    }

    handleBlur(event) {
        this.setState({
            focused: false
        });
    }

    render() {
        let classNames = '';
        classNames += this.state.focused ? ' focused' : '';

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
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                        />
                    </p>
                )
            }
        }

        return (
            <div className={classNames}>
                {wrapText(this.props.text, this.props.editing)}
            </div>
        );
    }

}


export default Force;