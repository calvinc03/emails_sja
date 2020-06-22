import React, { Component } from 'react';
import { Link } from 'react-router-dom';

var tableData = {}

class EditMember extends Component {
    

    componentDidMount() {
        this.loadTableData('juniors');
    }


    updateTable() {
        var group = document.getElementById('edit-group').value;
        group = group.toLowerCase().replace(' ', '_');
        if (group in tableData) {
            document.getElementById('edit-table').innerHTML = tableData[group];
        } else {
            this.loadTableData(group);
        }
    }

    async loadTableData(group) {
        var displayTable = document.getElementById('edit-table');
        displayTable.innerHTML = '';
        tableData[group] = '';

        var HeaderRequest = new XMLHttpRequest();
        HeaderRequest.open('GET', `https://sjarestapi.herokuapp.com/table?group=${group}`, true);
        HeaderRequest.onreadystatechange = function() {
            if (HeaderRequest.readyState === XMLHttpRequest.DONE) {
                var headers = JSON.parse(HeaderRequest.responseText)['table'];
                var headerhtml = '<thead><tr>';
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
                    var row = `<tr>`
                    for (var k in data[j]) {
                        if (k > 1) {
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
                        } else {
                            row += `<td>${data[j][k]}</td>`;
                        }   
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

    makeChanges() {
        var group = document.getElementById('edit-group').value;
        var tableRows = document.getElementById('edit-table').getElementsByTagName('tbody')[0].rows;
        var submitData = []

        for (var i = 0; i < tableRows.length; i++) {
            var row = [];

            row.push(tableRows[i].cells[0].innerHTML);
            row.push(tableRows[i].cells[1].innerHTML);

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
                    alert('error')
                    return
                }

                window.location.replace("/");
            }
        }
        document.getElementById('edit-mem-spinner').style.display = 'block';
        document.getElementById('make-changes-button').style.pointerEvents='none';
        document.getElementById('edit-cancel-button').style.pointerEvents ='none';
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({group: group, data: submitData, length: submitData.length}));
    }

    render() {
        return (
            <div className="homepage">
                <select className="form-control" onChange={() => this.updateTable()} id='edit-group'>
                    <option>Juniors</option>
                    <option>Cadet Twos</option>
                    <option>Cadet Ones</option>
                    <option>Crusaders</option>
                    <option>Leaders</option>
                </select>
                <table className="table" id="edit-table"></table>
                <div className="btn btn-primary" id="make-changes-button" onClick={() => this.makeChanges()}>Make Changes</div>
                <Link className="btn btn-light" id="edit-cancel-button" to="/">Cancel</Link>
                <div className="my-spinner" id="edit-mem-spinner"></div>
            </div>
        );
    }
}

export default EditMember;
