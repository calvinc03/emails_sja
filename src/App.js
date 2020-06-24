import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AddMember from './pages/AddMember';
import Homepage from './pages/Homepage';
import EditMember from './pages/EditMember';
import DeleteMember from './pages/DeleteMember';
import AddColumn from './pages/AddColumn';
import DeleteColumn from './pages/DeleteColumn'

class App extends Component {

  render() {
    return (
      <div className="App container">
        <h1 className="title">Division 776 Form Tracker</h1>
        <Router>
          <Switch>
            <Route path="/" exact component={Homepage} />
            <Route path="/new" exact component={AddMember} />
            <Route path="/edit" exact component={EditMember} />
            <Route path="/delete" exact component={DeleteMember} />
            <Route path="/column/add" exact component={AddColumn} />
            <Route path="/column/delete" exact component={DeleteColumn} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
