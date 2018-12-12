import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import Card from './Card';
import Force from './Force';

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
        this.handleForceAdd = this.handleForceAdd.bind(this);
    }

    componentDidUpdate() {
        // Hide scrollbars of BODY with CSS if modal is shown
        document.querySelector("body").className = (new URL(document.URL).searchParams.get('job') !== null) ? "jobStorySelected" : "";
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
        // Reveal scrollbars of BODY if modal is closed
        document.querySelector("body").className = "";
    }

    handleForceAdd(event) {
        this.props.onForceAdd(event.target.id);
    }

    render() {
        let sectionClassNames = '';
        sectionClassNames += this.state.editing ? ' editing' : '';
        sectionClassNames += this.props.selected ? ' selected' : '';

        let positiveForces = [];
        let negativeForces = [];
        if(this.props.job.forces) {
            positiveForces = this.props.job.forces.filter(function (force) {
                return force.direction === 'positive';
            });
            negativeForces = this.props.job.forces.filter(function(force) {
                return force.direction === 'negative';
            });
        }

        return (
            <section className={sectionClassNames}>
            {this.props.selected && 
                <div className="tags">
                    <div>{this.props.job.producttitle} {this.state.editing && <span>Edit</span>}</div>
                    {this.props.job.usertypes.map(usertype => (
                        <div key={usertype.id}>{usertype.title} {this.state.editing && <span>Remove</span>}</div>
                    ))}
                    {this.state.editing && <div>+</div>}
                </div>
            }
                <div className="cards">
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
                </div>
            {this.props.selected && 
                <div className="forces">
                    <div className="positiveForces">
                        <h2>Aids, Supports</h2>
                        {this.state.editing && 
                            <button 
                                id="positive"
                                onClick={this.handleForceAdd}
                                className="button button-secondary"
                            >Add</button>
                        }
                        {positiveForces.map(force => (
                            <Force
                                key={force.id}
                                jobId={this.props.job.id}
                                forceId={force.id}
                                text={force.description}
                                editing={this.state.editing}
                                onForceUpdate={this.handleCardUpdate}
                            />
                        ))}
                    </div>
                    <div className="negativeForces">
                        <h2>Obstacles, Fears, Anxieties</h2>
                        {this.state.editing && 
                            <button 
                                id="negative"
                                onClick={this.handleForceAdd}
                                className="button button-secondary"
                            >Add</button>
                        }
                        {negativeForces.map(force => (
                            <Force
                                key={force.id}
                                jobId={this.props.job.id}
                                forceId={force.id}
                                text={force.description}
                                editing={this.state.editing}
                                onForceUpdate={this.handleCardUpdate}
                            />
                        ))}
                    </div>
                </div>
            }
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