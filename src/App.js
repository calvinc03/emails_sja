import React, { Component } from 'react';
import Cookies from 'js-cookie';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AddMember from './pages/AddMember';
import Homepage from './pages/Homepage';
import EditMember from './pages/EditMember';
import DeleteMember from './pages/DeleteMember';
import AddColumn from './pages/AddColumn';
import DeleteColumn from './pages/DeleteColumn';
import SendEmail from './pages/SendEmail';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false
    }
  }

  componentDidMount() {
    document.getElementById('intro-spinner').style.display = 'block';
    document.getElementById('content').style.display = 'none';
    const access_token = Cookies.get('access_token');

    if (access_token != null) {
      var request = new XMLHttpRequest();
      request.open('POST', `https://sjarestapi.herokuapp.com/auth`, true);
      request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
          if ('success' in JSON.parse(request.responseText)) {
            this.setState({
              isLoggedIn: true
            });
          }
          document.getElementById('content').style.display = 'block';
          document.getElementById('intro-spinner').style.display = 'none';
        }
      }.bind(this);
      
      request.setRequestHeader("Content-Type", "application/json");
      request.send(JSON.stringify({access_token: access_token}));
    } else {
      document.getElementById('content').style.display = 'block';
      document.getElementById('intro-spinner').style.display = 'none';
    }
  }

  login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const error = document.getElementById('error-messages');
    error.innerHTML = ''

    if (!/\S/.test(username)) {
      var invalidName = document.createElement('small');
      invalidName.className = "my-form-text";
      invalidName.innerText = 'Enter a username';
      error.appendChild(invalidName);
      return;
    }

    if (!/\S/.test(password)) {
      var invalidPass = document.createElement('small');
      invalidPass.className = "my-form-text";
      invalidPass.innerText = 'Enter a password';
      error.appendChild(invalidPass);
      return;
    }

    var request = new XMLHttpRequest();
    request.open('POST', `https://sjarestapi.herokuapp.com/login`, true);
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        const response = JSON.parse(request.responseText);
        
        if ('error' in response) {
          var errormsg = document.createElement('small');
          errormsg.className = "my-form-text";
          errormsg.innerText = response['error'];
          error.appendChild(errormsg);
          
          document.getElementById('intro-spinner').style.display = 'none';
          document.getElementById('content').style.display = 'block';
          return;
        }

        const inOneHour = new Date(new Date().getTime() + 3600 * 1000);
        Cookies.set('access_token', response['access_token'], { expires: inOneHour });
        Cookies.set('permissions', response['permissions'], { expires: inOneHour });

        this.setState({
          isLoggedIn: true
        });
        
        document.getElementById('intro-spinner').style.display = 'none';
        document.getElementById('content').style.display = 'block';

      }
    }.bind(this);
    document.getElementById('intro-spinner').style.display = 'block';
    document.getElementById('content').style.display = 'none';

    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({user: username, pass: password}));
  }

  render() {
    if (this.state.isLoggedIn) {
      return (
        <div>
          <div className="my-spinner" id="intro-spinner"></div>
          <div className="App container" id="content">
            <h1 className="title">Division 776 Form Tracker</h1>
            <Router>
              <Switch>
                <Route path="/" exact component={Homepage} />
                <Route path="/new" exact component={AddMember} />
                <Route path="/edit" exact component={EditMember} />
                <Route path="/delete" exact component={DeleteMember} />
                <Route path="/column/add" exact component={AddColumn} />
                <Route path="/column/delete" exact component={DeleteColumn} />
                <Route path="/email" exact component={SendEmail} />
              </Switch>
            </Router>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="my-spinner" id="intro-spinner"></div>
          <div className="container login-container" id="content">
            <img className="sja-logo" alt="sja-logo" src="https://www.vmcdn.ca/f/files/tbnewswatch/images/business/business-directory-photos/channel-graphics/st,-john-ambulance.jpg"></img>
            <div className="login-form">
              <h3>Division 776 Form Tracker</h3>
              <div className="form-group">
                <input type="text" id="username" autoComplete="off" spellCheck="false" className="form-control" placeholder="Username"></input>
              </div>
              <div className="form-group">
                <input type="password" id="password" className="form-control" placeholder="Password"></input>
              </div>
              <div id="error-messages" className="intro-error"></div>
              <div className="form-group">
                <button type="submit" id="login-btn" className="btnSubmit" value="Login" onClick={() => this.login()}>LOGIN</button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

export default App;
