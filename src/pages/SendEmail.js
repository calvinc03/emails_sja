import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

var header_names = []

class SendEmail extends Component {

    componentDidMount() {
        if (Cookies.get('permissions') === 'Admin') {
            this.loadTableData();
            this.loadTableHeaders();
        }
    }

    async loadTableData() {
        var displayTable = document.getElementById('send-table');
        
        var BodyRequest = new XMLHttpRequest();
        BodyRequest.open('GET', `https://sjarestapi.herokuapp.com/member/all`, false);
        BodyRequest.onreadystatechange = function() {
            if (BodyRequest.readyState === XMLHttpRequest.DONE) {
                var data = JSON.parse(BodyRequest.responseText)['members'];
                var bodyhtml = '<tbody>';
                var lastGroup = '';
                var num = 0;
                for (var j in data) {
                    if (lastGroup != data[j][2]) {
                        num = 0;
                        lastGroup = data[j][2];
                    }
                    var row = `<tr>
                                    <td>
                                        <input type="checkbox" className="form-check-input-table" id=${data[j][2].replace(" ", "_")}-check${num}>
                                    </td>
                                    <th>${data[j][0]}</th>
                                    <th>${data[j][1]}</th>
                                    <th>${data[j][2]}</th>`
                    for (var k = 3; k < data[j].length; k++) {
                        row += `<td>${data[j][k]}</td>`;
                    }
                    num++;
                bodyhtml += row + `</tr>`;
            }
            bodyhtml += '</tbody>'
            displayTable.innerHTML += bodyhtml;
            }
        }
        const access_token = Cookies.get('access_token');
        BodyRequest.setRequestHeader("token", access_token);
        BodyRequest.send();
    }

    loadTableHeaders(group) {
        var displayTable = document.getElementById('send-table');
        
        var HeaderRequest = new XMLHttpRequest();
        HeaderRequest.open('GET', `https://sjarestapi.herokuapp.com/table?group=${group}`, true);
        HeaderRequest.onreadystatechange = function() {
            if (HeaderRequest.readyState === XMLHttpRequest.DONE) {
                var headers = JSON.parse(HeaderRequest.responseText)['table'];
                var headerhtml = '<thead><tr><th scope="col">List</th>';
                for (var i in headers) {
                    headerhtml += `<th scope="col">${headers[i].replace("_", " ")}</th>`;
                    header_names.push(headers[i]);
                }
                headerhtml += '</tr></thead>';
                displayTable.innerHTML += headerhtml;
            }
        }
        const access_token = Cookies.get('access_token');
        HeaderRequest.setRequestHeader("token", access_token);
        HeaderRequest.send();
    }

    selectAll() {
        var table = document.getElementsByTagName('input');
        if (document.getElementById('all-check').checked) {
            for (var i = 0; i < table.length; i++) {
                table[i].checked = true;
            }
        } else {
            for (i = 0; i < table.length; i++) {
                table[i].checked = false;
            }
        }
    }

    selectGroup(group) {
        var i = 0;
        while(document.getElementById(`${group}-check${i}`) !== null) {
            if (document.getElementById(`${group}-check`).checked) 
                document.getElementById(`${group}-check${i}`).checked = true;
            else 
                document.getElementById(`${group}-check${i}`).checked = false;

            i++;
        }
    }

    sendEmails() {
        var tableRows = document.getElementById('send-table').rows;
        var submitData = [];

        // Getting tablerows also gets the header. Offset var i by 1.
        for (var i = 1; i < tableRows.length; i++) {
            var row = [];
            if (tableRows[i].cells[0].children[0].checked) {
                row.push(tableRows[i].cells[1].innerHTML);
                row.push(tableRows[i].cells[2].innerHTML);

                for (var j = 4; j < tableRows[i].cells.length; j++) {
                    if (tableRows[i].cells[j].innerHTML === 'no') {
                        row.push(header_names[j-1].replace("_", " "));
                    }
                }

                if (row.length > 2) {
                    submitData.push(row);
                }
            } else continue;
        }

        if (submitData.length === 0) return;

        var request = new XMLHttpRequest();
        request.open('POST', 'https://sjarestapi.herokuapp.com/email', true);
        
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                document.getElementById('send-mem-spinner').style.display='none';
                document.getElementById('send-button').style.pointerEvents='auto';
                document.getElementById('send-cancel-button').style.pointerEvents ='auto';

                if ('error' in JSON.parse(request.responseText)) {
                    document.getElementById("nameUsed").style.display='block';
                    alert(JSON.parse(request.responseText['error']));
                    return
                }
        
                window.location.replace("/");
            }
        }

        document.getElementById('send-mem-spinner').style.display='block';
        document.getElementById('send-button').style.pointerEvents='none';
        document.getElementById('send-cancel-button').style.pointerEvents ='none';

        const access_token = Cookies.get('access_token');
        request.setRequestHeader("token", access_token);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({members: submitData}));
    }

    render() {
        if (Cookies.get('permissions') !== 'Admin') {
            return (<h2>You do not have permissions to view this page</h2>)
        }
        return (
            <div className="homepage">
                
                <table className="table" id="send-table"></table>
                <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="all-check" onChange={() => this.selectAll()}/>
                    <label className="form-check-label" htmlFor="all-check">All</label>
                </div>
                <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="junior-check" onChange={() => this.selectGroup("junior")}/>
                    <label className="form-check-label" htmlFor="junior-check">Juniors</label>
                </div>
                <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="cadet_two-check" onChange={() => this.selectGroup("cadet_two")}/>
                    <label className="form-check-label" htmlFor="cadet_two-check">Cadet 2s</label>
                </div>
                <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="cadet_one-check" onChange={() => this.selectGroup("cadet_one")}/>
                    <label className="form-check-label" htmlFor="cadet_one-check">Cadet 1s</label>
                </div>
                <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="crusader-check" onChange={() => this.selectGroup("crusader")}/>
                    <label className="form-check-label" htmlFor="crusader-check">Crusaders</label>
                </div>
                <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="leader-check" onChange={() => this.selectGroup("leader")}/>
                    <label className="form-check-label" htmlFor="leader-check">Leaders</label>
                </div>
                <div className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Send Now</div>
                <Link className="btn btn-light" to="/">Return</Link>
                <div className="my-spinner" id="send-mem-spinner"></div>

                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Send Emails</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        You will send emails to all the selected members. Are you sure?
                    </div>
                    <div className="modal-footer">
                        <button type="button" id="send-button" className="btn btn-primary" onClick={() => this.sendEmails()}>Yes</button>
                        <button type="button" id="send-cancel-button" className="btn btn-secondary" data-dismiss="modal">No</button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

export default SendEmail;
