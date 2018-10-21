import React, {Component} from 'react';
import JobStory from './JobStory';

class JobStoryList extends Component {
    constructor(props) {
        super(props);
        this.handleJobUpdate = this.handleJobUpdate.bind(this);
    }

    componentDidMount() {
        document.getElementById("filter").oninput = this.handleFilterChange;
    }

    handleFilterChange = (event) => {
        let list = this.props.getParentState().filteredJobStoryList;
        let pattern = event.target.value.toLowerCase();
        list = list.filter(job => job.context.toLowerCase().search(pattern) !== -1 || job.motivation.toLowerCase().search(pattern) !== -1 || job.outcome.toLowerCase().search(pattern) !== -1 );
        this.props.setParentState({
            renderedJobStoryList: list,
        });
    }

    handleJobUpdate(obj) {
        console.log("Should update job:", obj.id, obj.type, obj.updatedText);
    }

    render() {
        return (
            this.props.data.map(job => (
                <JobStory job={job} key={job.id} onJobUpdate={this.handleJobUpdate} />
            ))
        );
    }
}

export default JobStoryList;