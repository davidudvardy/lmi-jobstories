import React, {Component} from 'react';
import JobStory from './JobStory';

class JobStoryList extends Component {
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

    render() {
        return (
            this.props.getParentState().renderedJobStoryList.map(job => (
                <JobStory job={job} />
            ))
        );
    }
}

export default JobStoryList;