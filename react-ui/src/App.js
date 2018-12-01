import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import JobStoryList from './components/JobStoryList';
import SideBar from './components/SideBar';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: [],
      unsavedJob: {
        id: null,
        context: "",
        motivation: "",
        outcome: "",
        forces: [],
      },
      categoryFilter: {
        type: "",
        category: "",
      },
      searchFilter: "",
      productData: [],
      isLoaded: false,
      error: null,
    }

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleJobUpdate = this.handleJobUpdate.bind(this);
    this.handleStopEditing = this.handleStopEditing.bind(this);
    this.handleAddJob = this.handleAddJob.bind(this);
  }

  componentDidMount() {
    // Load job stories and update lists right after it
    fetch("/api/jobstories")
      .then(r => r.json())
      .then(
        (jobStoriesData) => {
          this.setState({
            jobs: jobStoriesData,
            isLoaded: true,
          });
          this.props.history.listen(() => {
            this.handleURLChange();
          });
          this.handleURLChange();
        },
        (error) => {
          this.setState({
            error: error,
            isLoaded: true,
          });
        },
      );
    // Load product and usertype categories
    fetch("/api/categories")
      .then(r => r.json())
      .then(
        (productData) => {
          this.setState({
            productData: productData,
            isLoaded: true,
          });
        },
        (error) => {
          this.setState({
            error: error,
            isLoaded: true,
          });
        },
      );
  }
  
  handleURLChange() {
    this.setState({
      categoryFilter: {
        type: new URL(document.URL).pathname.split('/')[1] || "home",
        category: new URL(document.URL).pathname.split('/')[2] || "home",
      },
      searchFilter: "",
    });
  }

  handleFilterChange(event) {
    this.setState({
      searchFilter: event.target.value,
    });
  }

  handleJobUpdate(updatedJob) {
    let jobs = this.state.jobs;
    let updatedJobIndex = jobs.findIndex(job => { 
      return job.id === updatedJob.id;
    });

    // Store original text in state if we just started editing
    if(this.state.unsavedJob.id == null) {
      this.setState({
        unsavedJob: {
          id: updatedJob.id,
          context: jobs[updatedJobIndex].context,
          motivation: jobs[updatedJobIndex].motivation,
          outcome: jobs[updatedJobIndex].outcome,
          forces: JSON.parse(JSON.stringify(jobs[updatedJobIndex].forces)),
        },
      });
    }

    // Update data model in state
    if(updatedJob.type === 'force') {
        let updatedForceIndex = jobs[updatedJobIndex].forces.findIndex(force => { 
          return force.id === updatedJob.forceId;
        });
        jobs[updatedJobIndex].forces[updatedForceIndex].description = updatedJob.updatedText;
    } else {
      jobs[updatedJobIndex][updatedJob.type] = updatedJob.updatedText;
    }

    this.setState({
      jobs: jobs,
    });
  }

  handleStopEditing(action) {
    // Check if there were any edits at all
    if(this.state.unsavedJob.id != null) {
      
      let {id, context, motivation, outcome, forces} = this.state.unsavedJob;
      let jobs = this.state.jobs;
      let updatedJobIndex = jobs.findIndex(job => { 
        return job.id === id; 
      });

      if(action === "discard") {
        // Restore from unsavedJob to affected job
        jobs[updatedJobIndex].context = context;
        jobs[updatedJobIndex].motivation = motivation;
        jobs[updatedJobIndex].outcome = outcome;
        jobs[updatedJobIndex].forces = forces;
        // Store in state and reset unsavedJob
        this.setState({
          jobs: jobs,
          unsavedJob: {
            id: null,
            context: "",
            motivation: "",
            outcome: "",
            forces: [],
          },
        });

      } else if(action === "save") {

        // Call API with POST data containing fields
        fetch('/api/jobstory-update/' + id, {
          method: "PUT",
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            'context': jobs[updatedJobIndex].context,
            'motivation': jobs[updatedJobIndex].motivation,
            'outcome': jobs[updatedJobIndex].outcome
          }),
        })
          .then(r => r.json())
          .then(
            (response) => {
              // Reset unsavedJob
              this.setState({
                unsavedJob: {
                  id: null,
                  context: "",
                  motivation: "",
                  outcome: "",
                },
              });
            },
            (error) => {
              console.log("Error:", error);
            },
          );

      }
    }
  }

  handleAddJob() {
    let jobs = this.state.jobs;
    let nextId = jobs.slice(-1)[0].id + 1;

    jobs.push({
      id: nextId,
      context: "Context",
      motivation: "Motivation",
      outcome: "Outcome",
      product: "bold360",
      usertypes: [
        "bold360-end-user"
      ],
      forces: [
        {
          key: 1,
          description: "Positive force",
          direction: "positive"
        },
        {
          key: 2,
          description: "Negative force",
          direction: "negative"
        }
      ]
    });
    this.setState({
      jobs: jobs,
    });
  }

  render() {
    const {jobs, categoryFilter, searchFilter, productData, isLoaded, error} = this.state;
    if(error) {
      return (<h1>Error loading JSON data: {error.message}</h1>);
    } else if (!isLoaded) {
      return (<h1>Loading data...</h1>);
    } else {
      return (
        <div className="container">
          <header>
            <Link id="home" className="brand" to="/"><span>Job Stories</span></Link>
            <input 
              className=""
              id="filter" 
              type="text" 
              placeholder="Search job stories..." 
              onInput={this.handleFilterChange} 
              value={this.state.searchFilter}
            />
          </header>
          <SideBar data={productData} />
          <main>
            <h1>Job Stories</h1>
            <button id="add" onClick={this.handleAddJob}><span>Add job story</span></button>
            <JobStoryList 
              jobs={jobs} 
              categoryFilter={categoryFilter} 
              searchFilter={searchFilter}
              onJobUpdate={this.handleJobUpdate} 
              onStopEditing={this.handleStopEditing}
            />
          </main>
        </div>
      );
    }
  }
}

export default withRouter(App);
