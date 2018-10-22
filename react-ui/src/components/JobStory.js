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
                // TODO: should call passed callback function to update jobs in state with original text stored in unsavedJob, clear unsavedJob.id afterwards
            });
        } else if(event.target.id == "save") {
            this.setState({
                editing: false
            });
            // TODO: should call passed callback function to clear unsavedJob.id in Apps and store affected job in DB (INSERT WHERE id=unsavedJob.id)
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