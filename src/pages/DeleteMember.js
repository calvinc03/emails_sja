import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class DeleteMember extends Component {
    

    componentDidMount() {
        this.loadTableData();
    }

    async loadTableData() {
        var displayTable = document.getElementById('delete-table');
        displayTable.innerHTML = '';

        var HeaderRequest = new XMLHttpRequest();
        HeaderRequest.open('GET', `https://sjarestapi.herokuapp.com/table`, true);
        HeaderRequest.onreadystatechange = function() {
            if (HeaderRequest.readyState === XMLHttpRequest.DONE) {
                var headers = JSON.parse(HeaderRequest.responseText)['table'];
                displayTable.innerHTML += `<thead>
                                                <tr>
                                                    <th scope="col">Select</th>
                                                    <th scope="col">${headers[0].replace("_", " ")}</th>
                                                    <th scope="col">${headers[1].replace("_", " ")}</th>
                                                    <th scope="col">${headers[2].replace("_", " ")}</th>
                                                </tr>
                                            </thead>`;
            }
        }
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
                                        <div className="form-group form-check">
                                            <input type="checkbox" className="form-check-input-table" id="checkbox-${j}">
                                        </div>
                                    </th>
                                    <th id="name-${j}">${data[j][0]}</th>
                                    <td>${data[j][1]}</td>
                                    <td id="name-${j}">${data[j][2]}</td>
                                </tr>`
                bodyhtml += row;
            }
            bodyhtml += '</tbody>'
            displayTable.innerHTML += bodyhtml;
            }
        }
        BodyRequest.send();
    }

    deleteMembers() {

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
        xhr.send(JSON.stringify({members: submitData, length: submitData.length}));
    }

    render() {
        return (
            <div className="homepage">
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
