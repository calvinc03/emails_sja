import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

class EditMember extends Component {
    

    componentDidMount() {
        if (Cookies.get('permissions') === 'Admin') {
            this.loadTableData();
        } 
    }

    async loadTableData() {
        var displayTable = document.getElementById('edit-table');
        displayTable.innerHTML = '';

        var HeaderRequest = new XMLHttpRequest();
        HeaderRequest.open('GET', `https://sjarestapi.herokuapp.com/table`, true);
        HeaderRequest.onreadystatechange = function() {
            if (HeaderRequest.readyState === XMLHttpRequest.DONE) {
                var headers = JSON.parse(HeaderRequest.responseText)['table'];
                var headerhtml = '<thead><tr>';
                for (var i in headers) {
                    headerhtml += `<th scope="col">${headers[i].replace("_", " ")}</th>`;
                }
                headerhtml += '</tr></thead>';
                displayTable.innerHTML += headerhtml;
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
                    var row = `<tr><th>${data[j][0]}</th><th>${data[j][1]}</th><th>${data[j][2]}</th>`
                    for (var k = 3; k < data[j].length; k++) {
                        var yes = data[j][k] === 'yes'? 'selected' : '';
                        var no = data[j][k] === 'no'? 'selected' : '';
                        var na = data[j][k] === 'n/a'? 'selected' : '';
                        row += `<td>
                                    <select className="form-control">
                                        <option ${yes} value='yes'>yes</option>
                                        <option ${no} value='no'>no</option>
                                        <option ${na} value='n/a'>n/a</option>
                                    </select>
                                </td>`
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

    makeChanges() {
        var tableRows = document.getElementById('edit-table').getElementsByTagName('tbody')[0].rows;
        var submitData = []

        for (var i = 0; i < tableRows.length; i++) {
            var row = [];

            row.push(tableRows[i].cells[0].innerHTML);
            row.push(tableRows[i].cells[1].innerHTML);
            row.push(tableRows[i].cells[2].innerHTML);

            var select = tableRows[i].getElementsByTagName('select');
            for (var j = 0; j < select.length; j++) {
                row.push(select[j].value);
            }
            submitData.push(row);
        }
        
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://sjarestapi.herokuapp.com/group/update', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                document.getElementById('edit-mem-spinner').style.display = 'none';
                document.getElementById('make-changes-button').style.pointerEvents='auto';
                document.getElementById('edit-cancel-button').style.pointerEvents ='auto';

                if ('error' in JSON.parse(xhr.responseText)) {
                    alert(JSON.parse(xhr.responseText)['error']);
                    return
                }
                window.location.replace("/");
            }
        }
        document.getElementById('edit-mem-spinner').style.display = 'block';
        document.getElementById('make-changes-button').style.pointerEvents='none';
        document.getElementById('edit-cancel-button').style.pointerEvents ='none';

        const access_token = Cookies.get('access_token');
        xhr.setRequestHeader("token", access_token);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({data: submitData, length: submitData.length}));
    }

    render() {
        if (Cookies.get('permissions') !== 'Admin') {
            return (<h2>You do not have permissions to view this page</h2>)
        }
        return (
            <div className="homepage">
                <table className="table" id="edit-table"></table>
                <div className="btn btn-primary" id="make-changes-button" onClick={() => this.makeChanges()}>Make Changes</div>
                <Link className="btn btn-light" id="edit-cancel-button" to="/">Return</Link>
                <div className="my-spinner" id="edit-mem-spinner"></div>
            </div>
        );
    }
}

export default EditMember;
