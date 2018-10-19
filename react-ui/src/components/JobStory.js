import React, {Component} from 'react';

class JobStory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            originalJob: this.props.job,
            renderedJob: this.props.job
        }
    }

    handleStartEditing = (event) => {
        this.setState({
            editing: true
        });
    }

    handleStopEditing = (event) => {
        if(event.target.id == "discard") {
            this.setState({
                editing: false,
                renderedJob: this.props.job
            });
        } else if(event.target.id == "save") {
            this.setState({
                editing: false,
                originalJob: this.state.renderedJob
            });
        }
    }

    render() {
        return (
            <div id={'jobstory' + this.state.renderedJob.id} className="list-group flex-row" style={{marginBottom: 10 + 'px'}}>
                <Card text={this.state.renderedJob.context} type="context" editing={this.state.editing} />
                <Card text={this.state.renderedJob.motivation} type="motivation" editing={this.state.editing} />
                <Card text={this.state.renderedJob.outcome} type="outcome" editing={this.state.editing} />
                <ToolsTab 
                    onStartEditing={this.handleStartEditing} 
                    onStopEditing={this.handleStopEditing} 
                    editing={this.state.editing} />
            </div>
        );
    }
}

const Card = (props) => {
    let EditableP = contentEditable("p");
    let plainText = <p className="mb-1">{props.text}</p>;

    return (
        <div className={"list-group-item list-group-item-action flex-row align-items-start " + props.type.toLowerCase()}>
            <small style={{textTransform: 'capitalize'}}>{props.type}</small>
            { (props.editing) ? <EditableP value={props.text} className="mb-1" style={{color: '#000', background: 'rgb(255,250,230)'}}/> : plainText }
        </div>
    )
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

function contentEditable(WrappedComponent) {
    return class extends React.Component {
        state = {
            editing: false
        };

        toggleEdit = e => {
            e.stopPropagation();
            if (this.state.editing) {
                // TODO: what is this?
                this.cancel();
            } else {
                this.edit();
            }
        };

        edit = () => {
            console.log("edit");
            this.setState(
                {
                    editing: true
                },
                () => {
                    this.domElm.focus();
                }
            );
        };

        save = () => {
            // TODO: set renderedJobStories from here somehow?
            console.log("save");
            //console.log("Saving", this.domElm.textContent);
            this.setState(
                {
                    editing: false
                },
                () => {
                    if (this.props.onSave && this.isValueChanged()) {
                        console.log("Value is changed", this.domElm.textContent);
                    }
                }
            );
        };

        cancel = () => {
            // TODO: restore original value to P somehow?
            console.log("cancel");
            this.setState({
                editing: false
            });
        };

        isValueChanged = () => {
            return this.props.value !== this.domElm.textContent;
        };

        handleKeyDown = e => {
            console.log("handleKeyDown", e);
            const { key } = e;
            switch (key) {
                case "Enter":
                    this.save();
                    break;
                case "Escape":
                    this.cancel();
                    break;
            }
        };

        render() {
            return (
                <WrappedComponent
                    className={this.state.editing ? "editing" : ""}
                    onClick={this.toggleEdit}
                    contentEditable={this.state.editing}
                    suppressContentEditableWarning
                    ref={domNode => {
                        this.domElm = domNode;
                    }}
                    onBlur={this.save}
                    onKeyDown={this.handleKeyDown}
                    {...this.props}
                >
                    {this.props.value}
                </WrappedComponent>
            );
        }
    };
}


export default JobStory;