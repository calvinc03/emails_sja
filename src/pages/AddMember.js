import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

var i = 1;
var member_names;

class AddMember extends Component {
    
    componentDidMount() {
        var HeaderRequest = new XMLHttpRequest();
        HeaderRequest.open('GET', `https://sjarestapi.herokuapp.com/member/names`, true);
        HeaderRequest.onreadystatechange = function() {
            if (HeaderRequest.readyState === XMLHttpRequest.DONE) {
                member_names = JSON.parse(HeaderRequest.responseText)['names'];
            }
        }
        const access_token = Cookies.get('access_token');
        HeaderRequest.setRequestHeader("token", access_token);
        HeaderRequest.send();
    }

    postMember() {
        var inputs = document.getElementById('form').children;
        var submitData = [];
        for (var k = 1; k < inputs.length; k++) {
            
            if (this.updateValidity(inputs[k])) {
                const name = inputs[k].children[0].firstElementChild.value;
                const email = inputs[k].children[1].firstElementChild.value;
                const group = inputs[k].children[2].value.toLowerCase();
                submitData.push([name, email, group]);
            } else continue;
        }
        
        if (submitData.length !== inputs.length - 1) return

        var request = new XMLHttpRequest();
        request.open('POST', 'https://sjarestapi.herokuapp.com/member/new', true);
        
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                document.getElementById('add-mem-spinner').style.display='none';
                document.getElementById('submit-button').style.pointerEvents='auto';
                document.getElementById('cancel-button').style.pointerEvents ='auto';

                if ('error' in JSON.parse(request.responseText)) {
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
        request.send(JSON.stringify({members: submitData, length: submitData.length}));
    }

    updateValidity(div) {
        var valid = true;
        
        var name_section = div.children[0];
        var email_section = div.children[1];

        name_section.children[1].innerHTML = '';
        email_section.children[1].innerHTML = '';

        if (!/\S/.test(name_section.firstElementChild.value)) {
            var invalidName = document.createElement('small');
            invalidName.className = "my-form-text";
            invalidName.innerText = 'This name is not valid';
            name_section.children[1].appendChild(invalidName);
            valid = false;
        }
        
        if (member_names.includes(name_section.firstElementChild.value)) {
            var usedName = document.createElement('small');
            usedName.className = "my-form-text";
            usedName.innerText = `This member is already in the table`;
            name_section.children[1].appendChild(usedName);
            valid = false;
        }
        
        var emailregex = /\S+@\S+\.\S+/gmi;
        if (!emailregex.test(email_section.firstElementChild.value)) {
            var invalidEmail = document.createElement('small');
            invalidEmail.className = "my-form-text";
            invalidEmail.innerText = 'This email is not valid';
            email_section.children[1].appendChild(invalidEmail);
            valid = false;
        }

        return valid;
    }

    addForm() {
        var form = document.getElementById("form");

        var div = document.createElement("div");
        div.innerHTML += `<div id="div-name${i}">
                                <input 
                                    type="text" 
                                    autoComplete="off"
                                    spellCheck="false"
                                    id="name${i}" 
                                    placeholder="Enter First and Last Name"></input>
                                <div></div>
                            </div>
                            <div id="div-email${i}">
                                <input 
                                    type="email" 
                                    autoComplete="off"
                                    spellCheck="false"
                                    id="email${i}" 
                                    placeholder="Enter email"></input>
                                <div></div>
                            </div>
                            <select id='group${i}'>
                                <option>Junior</option>
                                <option>Cadet Two</option>
                                <option>Cadet One</option>
                                <option>Crusader</option>
                                <option>Leader</option>
                            </select>
                            <img id='cancelmem${i}' alt="cancel" src="https://img.icons8.com/color/20/000000/cancel--v1.png"/>`

        div.id = `row${i}`;
        div.className = "form-row";

        form.appendChild(div);
        
        div.children[0].className = "form-group col-4";
        div.children[1].className = "form-group col-5";
        div.children[2].className = "form-control col-2";
        div.children[3].className = "input-img cancel-row";
        
        div.children[0].firstElementChild.className = "form-control";
        div.children[1].firstElementChild.className = "form-control";
        
        div.children[3].addEventListener("click", function () { 
            div.remove();
        });
        i++;
    }

    render() {
        if (Cookies.get('permissions') !== 'Admin') {
            return (<h2>You do not have permissions to view this page</h2>)
        }
        return (
            <div className="new-member-page">
                <h2 className="new-header">New Member</h2>
                <form id="form">
                    <div className="form-row">
                        <label className="col-4">Name</label>
                        <label className="col-5">Email</label>
                        <label className="col-3">Group</label>
                    </div>
                    <div className="form-row" id="row0">
                        <div className="form-group col-4" id="div-name0">
                            <input 
                                type="text" 
                                autoComplete="off"
                                spellCheck="false"
                                className="form-control" 
                                id="name0" 
                                placeholder="Enter First and Last Name"></input>
                            <div></div>
                        </div>
                        <div className="form-group col-5" id="div-email0">
                            <input 
                                type="email" 
                                autoComplete="off"
                                spellCheck="false"
                                className="form-control"
                                id="email0" 
                                placeholder="Enter email"></input>
                            <div></div>
                        </div>
                        <select className="form-control col-2" id='group0'>
                            <option>Junior</option>
                            <option>Cadet Two</option>
                            <option>Cadet One</option>
                            <option>Crusader</option>
                            <option>Leader</option>
                        </select>
                    </div>
                </form>
                <div><div className="btn btn-info" onClick={() => this.addForm()}>Add</div></div>
                <div className="btn btn-primary" id="submit-button" onClick={() => this.postMember()}>Submit</div>
                <Link className="btn btn-light" id="cancel-button" to="/">Cancel</Link>
                <div className="my-spinner" id="add-mem-spinner"></div>
                
            </div> 
        );
    }
}

export default AddMember