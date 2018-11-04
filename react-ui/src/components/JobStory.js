import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import Card from './Card';

class JobStory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false
        }
        this.handleCardUpdate = this.handleCardUpdate.bind(this);
        this.handleStartEditing = this.handleStartEditing.bind(this);
        this.handleStopEditing = this.handleStopEditing.bind(this);
        this.handleCloseJobStory = this.handleCloseJobStory.bind(this);
    }

    handleStartEditing() {
        this.setState({
            editing: true
        });
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

    handleCloseJobStory() {
        // Invoke editing stop handler with discard to finish editing on close
        let obj = {
            target: {
                id: 'discard'
            }
        };
        this.handleStopEditing(obj);
        // Go to URL with no searchParams to close selected job
        this.props.history.push(new URL(document.URL).pathname);
    }

    render() {
        let sectionClassNames = '';
        sectionClassNames += this.state.editing ? ' editing' : '';
        sectionClassNames += this.props.selected ? ' selected' : '';

        let positiveForces = this.props.job.forces.filter(function (force) {
            return force.direction === 'positive';
        });
        let negativeForces = this.props.job.forces.filter(function(force) {
            return force.direction === 'negative';
        });

        return (
            <section className={sectionClassNames}>
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
                {this.props.selected && 
                    <Toolbar
                        onStartEditing={this.handleStartEditing} 
                        onStopEditing={this.handleStopEditing} 
                        editing={this.state.editing} />
                }
                {this.props.selected && 
                    <button id="close" onClick={this.handleCloseJobStory}>
                        <span>Close</span>
                    </button>
                }
                {this.props.selected && 
                    <div id="forces">
                    <div id="positiveForces">
                            {positiveForces.map(force => (
                                <div>
                                    <p>{force.description}</p>
                                </div>
                            ))}
                        </div>
                        <div id="negativeForces">
                            {negativeForces.map(force => (
                                <div>
                                    <p>{force.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </section>
        );
    }
}

const Toolbar = (props) => {
    if(props.editing) {
        return (
            <div className="toolbar">
                <button id="save" className="button button-primary" onClick={props.onStopEditing}>Save</button>
                <button id="discard" className="button button-secondary" onClick={props.onStopEditing}>Discard</button>
            </div>
        );
    } else {
        return (
            <div className="toolbar">
                <button className="button button-secondary" onClick={props.onStartEditing}>Edit</button>
            </div>
        );
    }
}


export default withRouter(JobStory);