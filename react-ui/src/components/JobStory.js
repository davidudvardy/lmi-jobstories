import React, {Component} from 'react';
import Card from './Card'

class JobStory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false
        }

        this.handleCardUpdate = this.handleCardUpdate.bind(this);
    }

    handleStartEditing = (event) => {
        this.setState({
            editing: true
        });
    }

    handleStopEditing = (event) => {
        if(event.target.id == "discard") {
            this.setState({
                editing: false
                // TODO: probably the state change in itself will re-render the cards, and update their 'text' value with the one set from props above
            });
        } else if(event.target.id == "save") {
            this.setState({
                editing: false
            });
            // TODO: besides setting state, we will need to update the job by calling the passed onJobUpdate function, to update data in parent
        }
    }

    handleCardUpdate(obj) {
        this.props.onJobUpdate(obj);
    }

    render() {
        return (
            <div className="list-group flex-row" style={{marginBottom: 10 + 'px'}}>
                <Card 
                    jobId={this.props.job.id}
                    text={this.props.job.context}
                    type="context"
                    editing={this.state.editing}
                    onCardUpdate={this.handleCardUpdate}
                />
                <Card 
                    jobId={this.props.job.id}
                    text={this.props.job.motivation}
                    type="motivation"
                    editing={this.state.editing}
                    onCardUpdate={this.handleCardUpdate}
                />
                <Card 
                    jobId={this.props.job.id}
                    text={this.props.job.outcome}
                    type="outcome"
                    editing={this.state.editing}
                    onCardUpdate={this.handleCardUpdate}
                />
                <ToolsTab 
                    onStartEditing={this.handleStartEditing} 
                    onStopEditing={this.handleStopEditing} 
                    editing={this.state.editing} />
            </div>
        );
    }
}

const ToolsTab = (props) => {
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
}


export default JobStory;