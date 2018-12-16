import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import Card from './Card';
import Force from './Force';

class JobStory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            products: [],
            usertypes: [],
        }
        this.handleCardUpdate = this.handleCardUpdate.bind(this);
        this.handleStartEditing = this.handleStartEditing.bind(this);
        this.handleStopEditing = this.handleStopEditing.bind(this);
        this.handleCloseJobStory = this.handleCloseJobStory.bind(this);
        this.handleForceAdd = this.handleForceAdd.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.handleUsertypeChange = this.handleUsertypeChange.bind(this);
        this.highlightSearch = this.highlightSearch.bind(this);
    }

    componentDidUpdate() {
        // Hide scrollbars of BODY with CSS if modal is shown
        document.querySelector("body").className = (new URL(document.URL).searchParams.get('job') !== null) ? "jobStorySelected" : "";
    }

    handleStartEditing() {
        // Wait till productData arrives, it is needed for editing the tags
        // TODO: At least a loading state should be created to make this nicer !!!
        if(this.props.productData !== undefined) {
            // Collect all productnames and ids in state
            let products = [];
            this.props.productData.forEach(p => {
                products.push({
                    id: p.id,
                    title: p.title,
                });
            });

            // Save products and all usertypes of the current product 
            const productIndex = this.props.productData.findIndex(p => p.id === this.props.job.productid);
            this.setState({
                editing: true,
                products: products,
                usertypes: this.props.productData[productIndex].usertypes,
            });
        }
    }

    handleStopEditing(event) {
        if(this.props.job.usertypes.length === 0 && event.target.id === 'save') {
            alert("Please select at least one usertype.");
        } else {
            this.setState({
                editing: false,
            });
            this.props.onStopEditing(event.target.id);            
        }
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

    handleProductChange(event) {
        const {id, title} = this.state.products.find(p => p.id === event.target.value);
        this.props.onProductDataChange({
            id: this.props.job.id,
            productid: id,
            producttitle: title,
            usertypes: [],
        });

        // Save all usertypes of the new product in state so we can display for editing
        const productIndex = this.props.productData.findIndex(p => p.id === id);
        this.setState({
            usertypes: this.props.productData[productIndex].usertypes,
        });
    }

    handleUsertypeChange(event) {
        if(event.target.checked) {
            // Add new usertype
            this.props.job.usertypes.push({
                id: event.target.id,
                title: this.state.usertypes.find(u => u.id === event.target.id).title,
            });
        } else {
            // Remove usertype
            const usertypeIndex = this.props.job.usertypes.findIndex(u => u.id === event.target.id);
            this.props.job.usertypes.splice(usertypeIndex, 1);
        }
        this.props.onProductDataChange({
            id: this.props.job.id,
            productid: this.props.job.productid,
            producttitle: this.props.job.producttitle,
            usertypes: this.props.job.usertypes,
        });
    }

    highlightSearch(text) {
        const search = document.getElementById('filter').value;
        // TODO: How could we insert HTML tags, like a <span> in replaced text? HTML gets rendered as string now :(
        return (search.length > 2) ? text.replace(new RegExp(search, 'gi'), '_' + search + '_') : text;
    }

    render() {
        let sectionClassNames = '';
        sectionClassNames += this.state.editing ? ' editing' : '';
        sectionClassNames += this.props.selected ? ' selected' : '';

        let positiveForces = [];
        let negativeForces = [];
        if(this.props.job.forces) {
            positiveForces = this.props.job.forces.filter(f => f.direction === 'positive');
            negativeForces = this.props.job.forces.filter(f => f.direction === 'negative');
        }

        return (
            <section className={sectionClassNames}>
            {this.props.selected && !this.state.editing && 
            // Product and usertype tags -- Read-only
                <div className="tags">
                    <div>{this.props.job.producttitle}</div>
                    {this.props.job.usertypes.map(u => 
                        <div key={u.id}>{u.title}</div>
                    )}
                </div>
            }
            {this.props.selected && this.state.editing && 
            // Product and usertype tags -- Editing
                <div className="tags">
                    <div><select defaultValue={this.props.job.productid} onChange={this.handleProductChange}>
                        {this.state.products.map(p => 
                            <option key={p.id} value={p.id}>{p.title}</option>
                        )}
                    </select></div>
                    {this.state.usertypes.map(uState => 
                        <div key={uState.id}>
                            <label>
                                <input 
                                    type="checkbox" 
                                    id={uState.id} 
                                    defaultChecked={this.props.job.usertypes.findIndex(uProps => uProps.id === uState.id) !== -1}
                                    onChange={this.handleUsertypeChange}
                                    disabled={this.state.usertypes.length === 1}
                                />
                                {uState.title}
                            </label>
                        </div>,
                        this
                    )}
                </div>
            }
                <div className="cards">
                    <Card 
                        jobId={this.props.job.id}
                        text={this.highlightSearch(this.props.job.context)}
                        type="context"
                        editing={this.state.editing}
                        onCardUpdate={this.handleCardUpdate}
                    />
                    <Card 
                        jobId={this.props.job.id}
                        text={this.highlightSearch(this.props.job.motivation)}
                        type="motivation"
                        editing={this.state.editing}
                        onCardUpdate={this.handleCardUpdate}
                    />
                    <Card 
                        jobId={this.props.job.id}
                        text={this.highlightSearch(this.props.job.outcome)}
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