import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Spinner } from 'react-bootstrap';

var table_data = {'junior': '', 'cadet_two': '', 'cadet_one': '', 'crusader': '', 'leader': ''};

class Homepage extends Component {

  componentDidMount() {
    this.loadTableData();
    this.loadHeaders();
  }

  async loadHeaders() {
    var tableID = document.getElementById("home-table");
    
    var HeaderRequest = new XMLHttpRequest();
    HeaderRequest.open('GET', `https://sjarestapi.herokuapp.com/table?group=juniors`, true);
    HeaderRequest.onreadystatechange = function() {
      if (HeaderRequest.readyState === XMLHttpRequest.DONE) {
        document.getElementById("home-spinner").style.display = 'none';
        var headers = JSON.parse(HeaderRequest.responseText)['table'];

        var headerhtml = '<thead><tr>';
        for (var i = 0; i < headers.length; i++) {
          // skips email address
          if (i === 1) { continue; }
           headerhtml += `<th scope="col">${headers[i].replace("_", " ")}</th>`;
        }
        headerhtml += '</tr></thead>';
        table_data['headers'] = headerhtml;
        tableID.innerHTML += headerhtml;
      }
    }
    const access_token = Cookies.get('access_token');
    HeaderRequest.setRequestHeader("token", access_token);
    HeaderRequest.send();
  }

  async loadTableData(group) {
    var tableID = document.getElementById("home-table");

    var BodyRequest = new XMLHttpRequest();
    BodyRequest.open('GET', `https://sjarestapi.herokuapp.com/member/all`, true);
    BodyRequest.onreadystatechange = function() {
      if (BodyRequest.readyState === XMLHttpRequest.DONE) {
        var data = JSON.parse(BodyRequest.responseText)['members'];

        var bodyhtml = '<tbody>';
        for (var j in data) {
          // starts row off with name and group and skips email
          var row = `<tr><th>${data[j][0]}</th><th>${data[j][2]}</th>`
          // iterate through the remaining columns
          for (var k = 3; k < data[j].length; k++) {
              row += `<td>${data[j][k]}</td>`
          }
          bodyhtml += row + `</tr>`
          table_data[data[j][2].replace(" ", "_")] += row + `</tr>`;
        }
        bodyhtml += "</tbody>";
        tableID.innerHTML += bodyhtml;
      }
    }
    const access_token = Cookies.get('access_token');
    BodyRequest.setRequestHeader("token", access_token);
    BodyRequest.send();
  }

  addButton(group) {
    
    var buttons = document.getElementById('btn-filters');

    if (document.getElementById(group) !== null) return;

    var newButton = document.createElement("div");
    newButton.className = "btn filter-btn";
    newButton.id = group;
    newButton.innerHTML = `${group.replace('_', ' ')} <img id="${group}-cancel" src="https://img.icons8.com/ultraviolet/20/000000/cancel.png"/>`
    buttons.appendChild(newButton);

    document.getElementById(`${group}-cancel`).className = "cancel-img";
    document.getElementById(`${group}-cancel`).addEventListener('click', function () {
      this.removeButton(group);
    }.bind(this))

    var tableID = document.getElementById('home-table');
    var tbody = '<tbody>';
    for (var i = 0; i < buttons.children.length; i++) {
      tbody += table_data[buttons.children[i].id];
    }
    tbody += '</tbody>';
    tableID.innerHTML = table_data['headers'] + tbody; 
  }

  removeButton(group) {
    var buttons = document.getElementById('btn-filters');
    document.getElementById(`${group}`).remove();

    var tableID = document.getElementById('home-table');

    if (buttons.children.length === 0) {
      tableID.innerHTML = table_data['headers'] + table_data['junior'] + 
                          table_data['cadet_two'] + table_data['cadet_one'] + 
                          table_data['crusader'] + table_data['leader'];
    } else {
        var tbody = '<tbody>';
        for (var i = 0; i < buttons.children.length; i++) {
          tbody += table_data[buttons.children[i].id];
        }
        tbody += '</tbody>';
        tableID.innerHTML = table_data['headers'] + tbody;
    }
  }

  render() {
    const permissions = Cookies.get('permissions');
    return (
        <div className="homepage">
          <Link to="/new" className={permissions === 'Admin'? "btn btn-info" : "remove"}>Add</Link>
          <Link to="/edit" className={permissions === 'Admin'? "btn btn-warning" : "remove"}>Edit</Link>
          <Link to="/delete" className={permissions === 'Admin'? "btn btn-danger" : "remove"}>Delete</Link>

          <Link to="/column/delete" className={permissions === 'Admin'? "btn btn-danger columns" : "remove"}>Delete Column</Link>
          <Link to="/column/add" className={permissions === 'Admin'? "btn btn-success columns" : "remove"}>Add Column</Link>
          <div className="filter">
            <div className="btn-group">
              <button type="button" className="btn btn-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Filter
              </button>
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => this.addButton('junior')}>Juniors</div>
                <div className="dropdown-item" onClick={() => this.addButton('cadet_two')}>Cadet Twos</div>
                <div className="dropdown-item" onClick={() => this.addButton('cadet_one')}>Cadet Ones</div>
                <div className="dropdown-item" onClick={() => this.addButton('crusader')}>Crusaders</div>
                <div className="dropdown-item" onClick={() => this.addButton('leader')}>Leaders</div>
              </div>
              <div id="btn-filters"></div>
            </div>
          </div>
          <table className="table" id="home-table"></table>
          <Spinner animation="border" id="home-spinner" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          
          <Link to="/email" className={permissions === 'Admin'? "btn btn-info" : "remove"}>Send Emails</Link>
        </div>
    );
  }
}

export default Homepage;
