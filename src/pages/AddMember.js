import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AddMember extends Component {
    constructor(props) {
        super(props);

        this.state = {
            validName: true,
            validEmail: true
        }
    }

    postMember() {
        var name = document.getElementById("inputName").value;
        var email = document.getElementById("inputEmail").value;
        var group = document.getElementById("inputGroup").value;
        
        if (!/\S/.test(name)) {
            document.getElementById("nameError").style.display='block';
            this.setState({
                validName: false
            });
            return
        }

        var emailregex = /\S+@\S+\.\S+/gmi;
        if (!emailregex.test(email)) {
            document.getElementById("emailError").style.display='block';
            this.setState({
                validEmail: false
            });
            return
        }
        
        group = group.toLowerCase().replace(' ', '_') + 's'
        
        var request = new XMLHttpRequest();
        request.open('POST', 'https://sjarestapi.herokuapp.com/member/new', true);
        
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                document.getElementById('add-mem-spinner').style.display='none';
                document.getElementById('submit-button').style.pointerEvents='auto';
                document.getElementById('cancel-button').style.pointerEvents ='auto';

                if ('error' in JSON.parse(request.responseText)) {
                    document.getElementById("nameUsed").style.display='block';
                    this.setState({
                        validName: false
                    });
                    return
                }
        
                window.location.replace("/");
            }
        }.bind(this);
        document.getElementById('add-mem-spinner').style.display='block';
        document.getElementById('submit-button').style.pointerEvents='none';
        document.getElementById('cancel-button').style.pointerEvents ='none';

        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({name: name, email: email, group: group}));
    }

    updateValidity(type) {
        if (type === 'name') {
            if (!/\S/.test(document.getElementById("inputName").value)) {
                this.setState({
                    validName: false
                });
                document.getElementById("nameError").style.display='block';
            } else {
                this.setState({
                    validName: true
                });
                document.getElementById("nameError").style.display='none';
                document.getElementById("nameUsed").style.display='none';
            }
        } else {
            if (!/\S+@\S+\.\S+/gmi.test(document.getElementById("inputEmail").value)) {
                this.setState({
                    validEmail: false
                });
                document.getElementById("emailError").style.display='block';
            } else {
                this.setState({
                    validEmail: true
                });
                document.getElementById("emailError").style.display='none';
            }
        }
    }

    render() {
        const { validName, validEmail } = this.state;
        return (
            <div className="new-member-page">
                <h2 className="new-header">New Member</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="inputName">Name</label>
                        <input 
                            type="text" 
                            autoComplete="off"
                            spellCheck="false"
                            className={validName? "form-control" : "form-control outline-bad"} 
                            id="inputName" 
                            placeholder="Enter First and Last Name" 
                            onBlur={() => this.updateValidity('name')}></input>
                        <small id="nameError" className="my-form-text">Enter a valid name</small>
                        <small id="nameUsed" className="my-form-text">This member already exists</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputEmail">Email</label>
                        <input 
                            type="email" 
                            autoComplete="off"
                            spellCheck="false"
                            className={validEmail? "form-control" : "form-control outline-bad"} 
                            id="inputEmail" 
                            placeholder="Enter email" 
                            onBlur={() => this.updateValidity('email')}></input>
                        <small id="emailError" className="my-form-text">Enter a valid email address</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputGroup">Group</label>
                        <select className="form-control" id="inputGroup">
                            <option>Junior</option>
                            <option>Cadet Two</option>
                            <option>Cadet One</option>
                            <option>Crusader</option>
                            <option>Leader</option>
                        </select>
                    </div>
                    <div className="btn btn-primary" id="submit-button" onClick={() => this.postMember()}>Submit</div>
                    <Link className="btn btn-light" id="cancel-button" to="/">Cancel</Link>
                    <div className="my-spinner" id="add-mem-spinner"></div>
                </form>
            </div> 
        );
    }
}

export default AddMember