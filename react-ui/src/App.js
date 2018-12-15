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
        productid: "",
        producttitle: "",
        usertypes: [],
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
    this.handleForceAdd = this.handleForceAdd.bind(this);
    this.handleProductDataChange = this.handleProductDataChange.bind(this);
  }

  componentDidMount() {
    // Load job stories and update lists right after it
    fetch("/api/jobstories")
      .then(r => r.json())
      .then(
        (jobStoriesData) => {
          this.setState({
            // Forces can be null, so convert it to empty array
            jobs: jobStoriesData.map(j => {
                    if(!Array.isArray(j.forces)) j.forces = [];
                    return j;
                  }),
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
    let jobs = JSON.parse(JSON.stringify(this.state.jobs));
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
          productid: jobs[updatedJobIndex].productid,
          producttitle: jobs[updatedJobIndex].producttitle,
          usertypes: jobs[updatedJobIndex].usertypes,
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
      
      let {id, context, motivation, outcome, forces, productid, producttitle, usertypes} = this.state.unsavedJob;
      let jobs = JSON.parse(JSON.stringify(this.state.jobs));
      let updatedJobIndex = jobs.findIndex(job => { 
        return job.id === id; 
      });

      if(action === "discard") {
        // Restore from unsavedJob to affected job
        jobs[updatedJobIndex].context = context;
        jobs[updatedJobIndex].motivation = motivation;
        jobs[updatedJobIndex].outcome = outcome;
        jobs[updatedJobIndex].forces = forces;
        jobs[updatedJobIndex].productid = productid;
        jobs[updatedJobIndex].producttitle = producttitle;
        jobs[updatedJobIndex].usertypes = usertypes;
        // Store in state and reset unsavedJob
        this.setState({
          jobs: jobs,
          unsavedJob: {
            id: null,
            context: "",
            motivation: "",
            outcome: "",
            forces: [],
            productid: "",
            producttitle: "",
            usertypes: [],
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
            'outcome': jobs[updatedJobIndex].outcome,
            'forces': jobs[updatedJobIndex].forces,
            'usertypes': jobs[updatedJobIndex].usertypes.map(u => u.id)
            // productid and producttitle are derived from usertypes, not stored in jobstories table, so no need to send
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
                  forces: [],
                  productid: "",
                  producttitle: "",
                  usertypes: [],
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
    // Get max job id used already to use in state data model
    let jobs = JSON.parse(JSON.stringify(this.state.jobs));
    let nextJobId = -1;
    jobs.forEach(job => {
      if(job.id > nextJobId) nextJobId = job.id;
    });
    nextJobId++;

    // Get max force ids used already to use in state data model
    let nextForceId = -1;
    jobs.forEach(job => {
      job.forces.forEach(force => {
        if(force.id > nextForceId) nextForceId = force.id;
      });
    });
    nextForceId++;

    jobs.push({
      id: nextJobId,
      context: "Context",
      motivation: "Motivation",
      outcome: "Outcome",
      productid: this.state.productData[0].id,
      producttitle: this.state.productData[0].title,
      usertypes: [this.state.productData[0].usertypes[0]],
      forces: [
        {
          id: nextForceId,
          description: "Positive force",
          direction: "positive"
        },
        {
          id: nextForceId + 1,
          description: "Negative force",
          direction: "negative"
        }
      ]
    });

    this.setState({
      jobs: jobs,
    });

    // Open newly added job in modal to edit
    // TODO: Could we initiate editing mode to make it even more convenient?
    this.props.history.push("/?job=" + nextJobId);
  }

  handleForceAdd(action) {
    // Get array index of currently edited job story in state data model
    let jobs = JSON.parse(JSON.stringify(this.state.jobs));
    let updatedJobId = parseInt(new URL(document.URL).searchParams.get('job'), 10);
    let updatedJobIndex = jobs.findIndex(job => { 
      return job.id === updatedJobId;
    });

    // Store original text in state if we just started editing
    if(this.state.unsavedJob.id == null) {
      this.setState({
        unsavedJob: {
          id: updatedJobId,
          context: jobs[updatedJobIndex].context,
          motivation: jobs[updatedJobIndex].motivation,
          outcome: jobs[updatedJobIndex].outcome,
          forces: JSON.parse(JSON.stringify(jobs[updatedJobIndex].forces)),
          productid: jobs[updatedJobIndex].productid,
          producttitle: jobs[updatedJobIndex].producttitle,
          usertypes: jobs[updatedJobIndex].usertypes,
        },
      });
    }

    // Get max force ids used already
    let nextForceId = -1;
    jobs.forEach(job => {
      if(Array.isArray(job.forces)) {
        job.forces.forEach(force => {
          if(force.id > nextForceId) nextForceId = force.id;
        });
      }
    });
    nextForceId++;

    // Add new force with sample content
    if(!Array.isArray(jobs[updatedJobIndex].forces)) jobs[updatedJobIndex].forces = [];
    jobs[updatedJobIndex].forces.push({
      id: nextForceId,
      description: 'New force',
      direction: action,
    });

    // Update state with new data
    this.setState({
      jobs: jobs,
    });
  }

  handleProductDataChange(updatedJob) {
    let jobs = JSON.parse(JSON.stringify(this.state.jobs));
    const updatedJobIndex = jobs.findIndex(job => job.id === updatedJob.id);

    // Store original text in state if we just started editing
    if(this.state.unsavedJob.id == null) {
      this.setState({
        unsavedJob: {
          id: updatedJob.id,
          context: jobs[updatedJobIndex].context,
          motivation: jobs[updatedJobIndex].motivation,
          outcome: jobs[updatedJobIndex].outcome,
          forces: JSON.parse(JSON.stringify(jobs[updatedJobIndex].forces)),
          productid: jobs[updatedJobIndex].productid,
          producttitle: jobs[updatedJobIndex].producttitle,
          usertypes: JSON.parse(JSON.stringify(jobs[updatedJobIndex].usertypes)),
        },
      });
    }

    jobs[updatedJobIndex].productid = updatedJob.productid;
    jobs[updatedJobIndex].producttitle = updatedJob.producttitle;

    const productIndex = this.state.productData.findIndex(p => p.id === updatedJob.productid);
    if(this.state.productData[productIndex].usertypes.length === 1) {
      // If we just assigned a product which has only a single usertype, 
      // we must assign that usertype too, and disable deselecting it from frontend 
      // in JobStory.js as every job story must have at least one usertype assigned.
      jobs[updatedJobIndex].usertypes = [{
        id: this.state.productData[productIndex].usertypes[0].id,
        title: this.state.productData[productIndex].usertypes[0].title,
      }];
    } else {
      jobs[updatedJobIndex].usertypes = updatedJob.usertypes;
    }

    // Clear filters so to make sure current job is not filtered out by the change
    this.props.history.push("/" + new URL(document.URL).search);

    this.setState({
      jobs: jobs,
    });
  }

  render() {
    const {jobs, categoryFilter, searchFilter, productData, isLoaded, error} = JSON.parse(JSON.stringify(this.state));
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
              value={searchFilter}
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
              onForceAdd={this.handleForceAdd}
              productData={productData}
              onProductDataChange={this.handleProductDataChange}
            />
          </main>
        </div>
      );
    }
  }
}

export default withRouter(App);
