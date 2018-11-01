import React, {Component} from 'react';
import Card from './Card'

class JobStory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false
        }
        this.handleCardUpdate = this.handleCardUpdate.bind(this);
        this.handleStartEditing = this.handleStartEditing.bind(this);
        this.handleStopEditing = this.handleStopEditing.bind(this);
    }

    handleStartEditing(event) {
        this.setState({
            editing: true
        });
        this.props.onStartEditing(this.props.job.id);
    }

    handleStopEditing(event) {
        this.setState({
            editing: false,
        });
        this.props.onStopEditing(event.target.id);
    }

    handleCardUpdate(obj) {
        this.props.onJobUpdate(obj);
    }

    render() {
        return (
            <div className="">
                <Card 
                    jobId={this.props.job.id}
                    text={this.props.job.context}
                    type="context"
                    editing={this.props.editable && this.state.editing}
                    onCardUpdate={this.handleCardUpdate}
                />
                <Card 
                    jobId={this.props.job.id}
                    text={this.props.job.motivation}
                    type="motivation"
                    editing={this.props.editable && this.state.editing}
                    onCardUpdate={this.handleCardUpdate}
                />
                <Card 
                    jobId={this.props.job.id}
                    text={this.props.job.outcome}
                    type="outcome"
                    editing={this.props.editable && this.state.editing}
                    onCardUpdate={this.handleCardUpdate}
                />
                <ToolsTab
                    onStartEditing={this.handleStartEditing} 
                    onStopEditing={this.handleStopEditing} 
                    visible={this.props.editable}
                    editing={this.state.editing} />
            </div>
        );
    }
}

const ToolsTab = (props) => {
    if(props.visible) {
        if(props.editing) {
            return (
                <div>
                    <button id="save" onClick={props.onStopEditing}>Save</button>
                    <button id="discard" onClick={props.onStopEditing}>Discard</button>
                </div>
            );
        } else {
            return (
                <div>
                    <button onClick={props.onStartEditing}>Edit</button>
                </div>
            );
        }
    } else {
        return (<div></div>);
    }
}


export default JobStory;