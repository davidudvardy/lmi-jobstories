import React, {Component} from 'react';
import JobStory from './JobStory';

class JobStoryList extends Component {
    constructor(props) {
        super(props);
        this.handleJobUpdate = this.handleJobUpdate.bind(this);
        this.handleStopEditing = this.handleStopEditing.bind(this);
        this.handleForceAdd = this.handleForceAdd.bind(this);
        this.handleProductDataChange = this.handleProductDataChange.bind(this);
    }

    handleJobUpdate(obj) {
        this.props.onJobUpdate(obj);
    }

    handleStopEditing(action) {
        this.props.onStopEditing(action);
    }

    handleForceAdd(action) {
        this.props.onForceAdd(action);
    }

    handleProductDataChange(obj) {
        this.props.onProductDataChange(obj);
    }

    render() {
        // Filter for categories first
        let type = this.props.categoryFilter.type;
        let category = this.props.categoryFilter.category;
        let jobs = this.props.jobs; // TODO: Shouldn't we copy here properly? We are changing the props.jobs via this link later when filtering...
        let usertypes = [];

        switch (type) {
            case 'product':
                jobs = jobs.filter(job => job.productid === category);
                break;
            case 'usertype':
                jobs = jobs.filter(function (job) {
                    usertypes = [];
                    job.usertypes.forEach(usertype => {
                        usertypes.push(usertype.id);
                    });
                    return usertypes.includes(category);
                });
                break;
            default:
                // leave 'jobs' unaffected in any other cases
        }

        // Then filter for search term if present
        if(this.props.searchFilter) {
            const searchFilter = this.props.searchFilter.toLowerCase();
            jobs = jobs.filter(function (job) {
                let forces_str = '';
                job.forces.forEach(force => {
                    forces_str += force.description.toLowerCase() + ' ';
                });
                return job.context.toLowerCase().search(searchFilter) !== -1 || job.motivation.toLowerCase().search(searchFilter) !== -1 || job.outcome.toLowerCase().search(searchFilter) !== -1 || forces_str.search(searchFilter) !== -1;
            });
        }

        return (
            jobs.map(job => 
                <JobStory 
                    job={job} 
                    key={job.id} 
                    onJobUpdate={this.handleJobUpdate}
                    onStopEditing={this.handleStopEditing}
                    onForceAdd={this.handleForceAdd}
                    selected={job.id === parseInt(new URL(document.URL).searchParams.get('job'), 10)}
                    productData={this.props.productData}
                    onProductDataChange={this.handleProductDataChange}
                />
            )
        );
    }
}

export default JobStoryList;