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
    this.handleStartEditing = this.handleStartEditing.bind(this);
    this.handleStopEditing = this.handleStopEditing.bind(this);
    this.handleAddJob = this.handleAddJob.bind(this);
  }

  componentDidMount() {
    // Load job stories and update lists right after it
    fetch("/api/jobstories")
      .then(r => r.json())
      .then(
        (jobStoriesData) => {
          // Additional property to store if JobStory can show editing toolbar
          for(let key of jobStoriesData.keys()) {
            jobStoriesData[key].editable = true;
          }
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
        },
      });
    }
    // Update data model in state
    jobs[updatedJobIndex][updatedJob.type] = updatedJob.updatedText;
    this.setState({
      jobs: jobs,
    });
  }

  handleStartEditing(editingId) {
    let jobs = this.state.jobs;
    for(let key of jobs.keys()) {
      jobs[key].editable = (jobs[key].id === editingId) ? true : false;
    }
    this.setState({
      jobs: jobs,
    });
  }

  handleStopEditing(action) {
    // Reset editable props in state to true, so toolbar is shown
    let jobs = this.state.jobs;
    for(let key of jobs.keys()) {
      jobs[key].editable = true;
    }
    this.setState({
      jobs: jobs,
    });

    // Check if there were any edits at all
    if(this.state.unsavedJob.id != null) {
      
      let {id, context, motivation, outcome} = this.state.unsavedJob;
      let jobs = this.state.jobs;
      let updatedJobIndex = jobs.findIndex(job => { 
        return job.id === id; 
      });

      if(action === "discard") {
        // Restore from unsavedJob to affected job
        jobs[updatedJobIndex].context = context;
        jobs[updatedJobIndex].motivation = motivation;
        jobs[updatedJobIndex].outcome = outcome;
        // Store in state and reset unsavedJob
        this.setState({
          jobs: jobs,
          unsavedJob: {
            id: null,
            context: "",
            motivation: "",
            outcome: "",
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
      editable: true
    });
    this.setState({
      jobs: jobs,
    });
  }

  render() {
    const {jobs, categoryFilter, searchFilter, productData, isLoaded, error} = this.state;
    if(error) {
      return (<h5>Error loading JSON data: {error.message}</h5>);
    } else if (!isLoaded) {
      return (<h5>Loading data...</h5>);
    } else {
      return (
        <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <Link id="home" className="navbar-brand col-sm-3 col-md-2 mr-0" to="/">Job Stories</Link>
            <input 
              className="form-control form-control-dark w-100"
              id="filter" 
              type="text" 
              placeholder="Search job stories..." 
              onInput={this.handleFilterChange} 
              value={this.state.searchFilter}
            />
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap"><a className="nav-link">Sign out</a></li>
            </ul>
          </nav>
          <div className="container-fluid">
            <div className="row">
              <SideBar data={productData} />
              <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                <h2>Job Stories</h2>
                <button id="add" onClick={this.handleAddJob}>Add job story</button>
                <JobStoryList 
                  jobs={jobs} 
                  categoryFilter={categoryFilter} 
                  searchFilter={searchFilter}
                  onJobUpdate={this.handleJobUpdate} 
                  onStartEditing={this.handleStartEditing}
                  onStopEditing={this.handleStopEditing}
                />
              </main>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(App);
