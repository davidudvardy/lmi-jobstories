import React, {Component} from 'react';
import JobStory from './JobStory';

class JobStoryList extends Component {
    constructor(props) {
        super(props);
        this.handleJobUpdate = this.handleJobUpdate.bind(this);
        this.handleStopEditing = this.handleStopEditing.bind(this);
    }

    handleJobUpdate(obj) {
        this.props.onJobUpdate(obj);
    }

    handleStopEditing(action) {
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
            jobs = jobs.filter(function (job) {
                let forces_str = '';
                job.forces.map(function(force) {
                    forces_str += force.description.toLowerCase() + ' ';
                });
                return job.context.toLowerCase().search(searchFilter) !== -1 || job.motivation.toLowerCase().search(searchFilter) !== -1 || job.outcome.toLowerCase().search(searchFilter) !== -1 || forces_str.search(searchFilter) !== -1;
            });
        }

        return (
            jobs.map(job => (
                <JobStory 
                    job={job} 
                    key={job.id} 
                    onJobUpdate={this.handleJobUpdate}
                    onStopEditing={this.handleStopEditing}
                    selected={job.id == new URL(document.URL).searchParams.get('job')}
                />
            ))
        );
    }
}

export default JobStoryList;