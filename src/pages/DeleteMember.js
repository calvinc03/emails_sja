import React, { Component } from 'react';
import { Link } from 'react-router-dom';

var tableData = {}

class DeleteMember extends Component {
    

    componentDidMount() {
        this.loadTableData('juniors');
    }


    updateTable() {
        var group = document.getElementById('delete-group').value;
        group = group.toLowerCase().replace(' ', '_');
        if (group in tableData) {
            document.getElementById('delete-table').innerHTML = tableData[group];
        } else {
            this.loadTableData(group);
        }
    }

    async loadTableData(group) {
        var displayTable = document.getElementById('delete-table');
        displayTable.innerHTML = '';
        tableData[group] = '';

        var HeaderRequest = new XMLHttpRequest();
        HeaderRequest.open('GET', `https://sjarestapi.herokuapp.com/table?group=${group}`, true);
        HeaderRequest.onreadystatechange = function() {
            if (HeaderRequest.readyState === XMLHttpRequest.DONE) {
                var headers = JSON.parse(HeaderRequest.responseText)['table'];
                var headerhtml = '<thead><tr><th scope="col"></th>';
                for (var i in headers) {
                    headerhtml += `<th scope="col">${headers[i]}</th>`;
                }
                headerhtml += '</tr></thead>';
                displayTable.innerHTML += headerhtml;
                tableData[group] += headerhtml;
            }
        }
        HeaderRequest.send();

        var BodyRequest = new XMLHttpRequest();
        BodyRequest.open('GET', `https://sjarestapi.herokuapp.com/member/all?group=${group}`, true);
        BodyRequest.onreadystatechange = function() {
            if (BodyRequest.readyState === XMLHttpRequest.DONE) {
                var data = JSON.parse(BodyRequest.responseText)['members'];
                var bodyhtml = '<tbody>';
                for (var j in data) {
                    var row = `<tr>
                                    <th scope="row">
                                        <div className="form-group form-check">
                                            <input type="checkbox" class="form-check-input" id="checkbox-${j}">
                                        </div>
                                    </th>`
                    for (var k in data[j]) {
                        row += `<td id="name-${j}">${data[j][k]}</td>`;
                    }
                bodyhtml += row + '</tr>';
            }
            bodyhtml += '</tbody>'
            displayTable.innerHTML += bodyhtml;
            tableData[group] += bodyhtml;
            }
        }
        BodyRequest.send();
    }

    deleteMembers() {
        var group = document.getElementById('delete-group').value;
        group = group.toLowerCase().replace(' ', '_');

        var submitData = [];
        
        var num = 0;
        while (document.getElementById(`checkbox-${num}`) != null) {
            if (document.getElementById(`checkbox-${num}`).checked)
                submitData.push(document.getElementById(`name-${num}`).innerHTML);
            num++;
        }
        
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
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({group: group, members: submitData, length: submitData.length}));
    }

    render() {
        return (
            <div className="homepage">
                <select className="form-control" onChange={() => this.updateTable()} id='delete-group'>
                    <option>Juniors</option>
                    <option>Cadet Twos</option>
                    <option>Cadet Ones</option>
                    <option>Crusaders</option>
                    <option>Leaders</option>
                </select>
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
