import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

class DeleteColumn extends Component {
    

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
                var headerhtml = `<thead>
                                    <tr>
                                        <th scope="col">${headers[0]}</th>
                                        <th scope="col">${headers[1]}</th>
                                        <th scope="col">${headers[2]}</th>`;
                for (var i = 3; i < headers.length; i++) {
                    headerhtml += `<th scope="col">`;
                    if (i > 1) {
                        headerhtml += `<input type="checkbox" htmlFor=${headers[i]} class="form-check-input" id="column-${i}">`
                    }
                    headerhtml += `${headers[i].replace("_", " ")}</th>`;
                }
                headerhtml += '</tr></thead>';
                displayTable.innerHTML += headerhtml;
            }
        };
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
                    var row = `<tr>`
                    for (var k in data[j]) {
                        row += `<td>${data[j][k]}</td>`;
                    }
                bodyhtml += row + '</tr>';
            }
            bodyhtml += '</tbody>'
            displayTable.innerHTML += bodyhtml;
            }
        }
        BodyRequest.setRequestHeader("token", access_token);
        BodyRequest.send();
    }

    deleteColumns() {
        var submitData = [];
        var num = 3;

        while (document.getElementById(`column-${num}`) != null) {
            if (document.getElementById(`column-${num}`).checked)
                submitData.push(document.getElementById(`column-${num}`).attributes.htmlFor.value);
            num++;
        }
        
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', 'https://sjarestapi.herokuapp.com/column/remove', true);
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
        xhr.send(JSON.stringify({columns: submitData}));
    }

    render() {
        if (Cookies.get('permissions') !== 'Admin') {
            return (<h2>You do not have permissions to view this page</h2>)
        }
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
                        <h5 className="modal-title" id="exampleModalLabel">Delete Columns</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        Are you sure?
                    </div>
                    <div className="modal-footer">
                        <button type="button" id="delete-button" className="btn btn-danger" onClick={() => this.deleteColumns()}>Yes</button>
                        <button type="button" id="delete-cancel-button" className="btn btn-secondary" data-dismiss="modal">No</button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

export default DeleteColumn;
