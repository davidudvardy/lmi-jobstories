import React, {Component} from 'react';
import JobStory from './JobStory';

class JobStoryList extends Component {
    constructor(props) {
        super(props);
        // Store a model of all JobStories shown to track editability
        this.state = {
            editable: [],
        };
        this.handleJobUpdate = this.handleJobUpdate.bind(this);
        this.handleStopEditing = this.handleStopEditing.bind(this);
        this.handleStartEditing = this.handleStartEditing.bind(this);
    }

    componentDidUpdate() {
        // Update editable array in state once data is loaded
        if(this.props.jobs.length > 0 && this.state.editable.length === 0) {
            let editable = new Array(this.props.jobs.length);
            this.props.jobs.forEach(job => {
                editable[job.id] = true;
            });
            this.setState({
                editable: editable,
            });
        }
    }

    handleJobUpdate(obj) {
        this.props.onJobUpdate(obj);
    }

    handleStartEditing(editingId) {
        // TODO: should set this.state.editable[] to false for all except findIndex(job.id)
        let editable = this.state.editable;
        editable.fill(false);
        editable[editingId] = true;
        this.setState({
            editable: editable,
        });
    }

    handleStopEditing(action) {
        let editable = this.state.editable;
        editable.fill(true);
        this.setState({
            editable: editable,
        });
        this.props.onStopEditing(action);
    }

    render() {
        // Filter for categories first
        let type = this.props.categoryFilter.type;
        let category = this.props.categoryFilter.category;
        let jobs = this.props.jobs;

        switch (type) {
            case 'product':
                jobs = jobs.filter(function (job) {
                    return job.product === category;
                });
                break;
            case 'usertype':
                jobs = jobs.filter(function (job) {
                    return job.usertypes.includes(category);
                });
                break;
            default:
                // leave 'jobs' unaffected in any other cases
        }

        // Then filter for search term if present
        if(this.props.searchFilter) {
            let searchFilter = this.props.searchFilter.toLowerCase();
            jobs = jobs.filter(job => job.context.toLowerCase().search(searchFilter) !== -1 || job.motivation.toLowerCase().search(searchFilter) !== -1 || job.outcome.toLowerCase().search(searchFilter) !== -1 );
        }

        return (
            jobs.map(job => (
                <JobStory 
                    job={job} 
                    key={job.id} 
                    onJobUpdate={this.handleJobUpdate}
                    onStartEditing={this.handleStartEditing}
                    onStopEditing={this.handleStopEditing}
                    editable={this.state.editable[job.id]}
                />
            ))
        );
    }
}

export default JobStoryList;