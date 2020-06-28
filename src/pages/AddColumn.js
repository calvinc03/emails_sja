import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

var headers;
var i = 1;

class AddColumn extends Component {

    componentDidMount() {
    
        var HeaderRequest = new XMLHttpRequest();
        HeaderRequest.open('GET', `https://sjarestapi.herokuapp.com/table`, true);
        HeaderRequest.onreadystatechange = function() {
            if (HeaderRequest.readyState === XMLHttpRequest.DONE) {
                headers = JSON.parse(HeaderRequest.responseText)['table'];
            }
        }
        const access_token = Cookies.get('access_token');
        HeaderRequest.setRequestHeader("token", access_token);
        HeaderRequest.send();
    }

    newColumn() {
        var names = document.getElementById("form").getElementsByTagName('input');
        var submitData = [];
        var errordiv = document.getElementById('error-messages');
        errordiv.innerHTML = '';

        for (var k = 0; k < names.length; k++) {
            if (!/\S/.test(names[k].value)) {
                var invalidColumn = document.createElement('small');
                invalidColumn.className = "my-form-text";
                invalidColumn.innerText = `Column ${k+1} is not a valid column name`;
                errordiv.appendChild(invalidColumn);
            }
            else if (headers.includes(names[k].value)) {
                var usedColumn = document.createElement('small');
                usedColumn.className = "my-form-text";
                usedColumn.innerText = `Column ${k+1} is already in the table`;
                errordiv.appendChild(usedColumn);
            }
            else if (submitData.includes(names[k].value)) {
                var sameColumn = document.createElement('small');
                sameColumn.className = "my-form-text";
                sameColumn.innerText = `Column ${k+1} is the same as another Column`;
                errordiv.appendChild(sameColumn);
            }
            else {
                submitData.push(names[k].value.replace(" ", "_"))
            }
        }

        if (submitData.length !== names.length) return;
        
        var request = new XMLHttpRequest();
        request.open('POST', 'https://sjarestapi.herokuapp.com/column/new', true);
        
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                document.getElementById('add-mem-spinner').style.display='none';
                document.getElementById('submit-button').style.pointerEvents='auto';
                document.getElementById('cancel-button').style.pointerEvents ='auto';

                if ('error' in JSON.parse(request.responseText)) {
                    document.getElementById("nameUsed").style.display='block';
                    alert(JSON.parse(request.responseText['error']));
                    return
                }
        
                window.location.replace("/");
            }
        };
        document.getElementById('add-mem-spinner').style.display='block';
        document.getElementById('submit-button').style.pointerEvents='none';
        document.getElementById('cancel-button').style.pointerEvents ='none';

        const access_token = Cookies.get('access_token');
        request.setRequestHeader("token", access_token);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({columns: submitData}));
    }

    addForm() {
        var form = document.getElementById("form");
        var newDiv = document.createElement("div");
        newDiv.className = "column-form";
        newDiv.id = `column-div${i}`;
        newDiv.innerHTML = `<input 
                                type="text" 
                                autoComplete="off"
                                spellCheck="false"
                                id="inputColumn${i}" 
                                placeholder="Enter Column Name"></input>
                            <img id="cancelimg${i}" alt="cancel" src="https://img.icons8.com/color/20/000000/cancel--v1.png"/>`;
        form.appendChild(newDiv);

        document.getElementById(`inputColumn${i}`).className = "form-control column-input";
        document.getElementById(`cancelimg${i}`).className = "input-img";
        
        document.getElementById(`cancelimg${i}`).addEventListener("click", function () {          
            newDiv.remove();
        });
        i++;
    }

    render() {
        if (Cookies.get('permissions') !== 'Admin') {
            return (<h2>You do not have permissions to view this page</h2>)
        }
        return (
            <div className="new-member-page">
                <h2 className="new-header">Add Column</h2>
                <form>
                    <label className="">Column</label>
                    <div className="form-group half-length" id="form">
                        <div className="column-form" id="column-div0">
                            <input 
                                type="text" 
                                autoComplete="off"
                                spellCheck="false"
                                className="form-control column-input" 
                                id="inputColumn0" 
                                placeholder="Enter Column Name"></input>
                        </div>
                    </div>
                </form>
                <div id="error-messages"></div>
                <div><div className="btn btn-info" onClick={() => this.addForm()}>Add</div></div>
                <div className="btn btn-primary" id="submit-button" onClick={() => this.newColumn()}>Submit</div>
                <Link className="btn btn-light" id="cancel-button" to="/">Cancel</Link>
                <div className="my-spinner" id="add-mem-spinner"></div>   
            </div> 
        );
    }
}

export default AddColumn