import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

var table_data = {'junior': '', 'cadet_two': '', 'cadet_one': '', 'crusader': '', 'leader': ''};

class DeleteMember extends Component {
    

    componentDidMount() {
        if (Cookies.get('permissions') === 'Admin') {
            this.loadTableData();
        } 
    }

    async loadTableData() {
        var displayTable = document.getElementById('delete-table');
        displayTable.innerHTML = '';

        var HeaderRequest = new XMLHttpRequest();
        HeaderRequest.open('GET', `https://sjarestapi.herokuapp.com/table`, true);
        HeaderRequest.onreadystatechange = function() {
            if (HeaderRequest.readyState === XMLHttpRequest.DONE) {
                var headers = JSON.parse(HeaderRequest.responseText)['table'];
                var headerHTML = `<thead>
                                    <tr>
                                        <th scope="col">Select</th>
                                        <th scope="col">${headers[0].replace("_", " ")}</th>
                                        <th scope="col">${headers[1].replace("_", " ")}</th>
                                        <th scope="col">${headers[2].replace("_", " ")}</th>
                                    </tr>
                                </thead>`;
                displayTable.innerHTML += headerHTML;
                table_data['headers'] = headerHTML;
            }
        }
        const access_token = Cookies.get('access_token');
        HeaderRequest.setRequestHeader("token", access_token);
        HeaderRequest.send();

        var BodyRequest = new XMLHttpRequest();
        BodyRequest.open('GET', `https://sjarestapi.herokuapp.com/member/all`, true);
        BodyRequest.onreadystatechange = function() {
            if (BodyRequest.readyState === XMLHttpRequest.DONE) {
                var data = JSON.parse(BodyRequest.responseText)['members'];
                var bodyhtml = '<tbody>';
                for (var j in data) {
                    var row = `<tr>
                                    <th scope="row">
                                        <input type="checkbox" className="form-check-input-table" id="checkbox-${j}">
                                    </th>
                                    <th id="name-${j}">${data[j][0]}</th>
                                    <td>${data[j][1]}</td>
                                    <td>${data[j][2]}</td>
                                </tr>`
                    bodyhtml += row;
                    table_data[data[j][2].replace(" ", "_")] += row;
                }
            bodyhtml += '</tbody>'
            displayTable.innerHTML += bodyhtml;
            this.addClassNames();
            }
        }.bind(this);
        BodyRequest.setRequestHeader("token", access_token);
        BodyRequest.send();
    }

    addClassNames() {
        var num = 0;
        while (document.getElementById(`name-${num}`) != null) {
            document.getElementById(`name-${num}`).className = "name";    
            num++;
        }
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
    
        var tableID = document.getElementById('delete-table');
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
    
        var tableID = document.getElementById('delete-table');
    
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

    deleteMembers() {

        var submitData = [];
        var tableRows = document.getElementsByTagName('tr');

        for (var i = 1; i < tableRows.length; i++) {
            if (tableRows[i].children[0].firstElementChild.checked)
                submitData.push(tableRows[i].children[1].innerHTML);
        }

        if (submitData.length === 0) return;
        
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', 'https://sjarestapi.herokuapp.com/member/remove', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                document.getElementById('delete-mem-spinner').style.display = 'none';
                document.getElementById('delete-button').style.pointerEvents='auto';
                document.getElementById('delete-cancel-button').style.pointerEvents ='auto';

                if ('error' in JSON.parse(xhr.responseText)) {
                    alert(JSON.parse(xhr.responseText)['error']);
                    return
                }
                window.location.replace("/");
            }
        }
        document.getElementById('delete-mem-spinner').style.display = 'block';
        document.getElementById('delete-button').style.pointerEvents='none';
        document.getElementById('delete-cancel-button').style.pointerEvents ='none';

        const access_token = Cookies.get('access_token');
        xhr.setRequestHeader("token", access_token);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({members: submitData, length: submitData.length}));
    }

    render() {
        if (Cookies.get('permissions') !== 'Admin') {
            return (<h2>You do not have permissions to view this page</h2>)
        }
        return (
            <div className="homepage">
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
                <table className="table" id="delete-table"></table>
                <div className="btn btn-danger" data-toggle="modal" data-target="#exampleModal">Delete</div>
                <Link className="btn btn-light" to="/">Cancel</Link>
                <div className="my-spinner" id="delete-mem-spinner"></div>

                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Delete Members</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        Are you sure?
                    </div>
                    <div className="modal-footer">
                        <button type="button" id="delete-button" className="btn btn-danger" onClick={() => this.deleteMembers()}>Yes</button>
                        <button type="button" id="delete-cancel-button" className="btn btn-secondary" data-dismiss="modal">No</button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

export default DeleteMember;
