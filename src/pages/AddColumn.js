import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AddColumn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            validName: true
        }
    }

    newColumn() {
        var name = document.getElementById("inputColumn").value;
        
        if (!/\S/.test(name)) {
            document.getElementById("nameError").style.display='block';
            this.setState({
                validName: false
            });
            return
        }
        var groups = []
        if (document.getElementById("juniors-check").checked) groups.push("juniors");
        if (document.getElementById("cadet_twos-check").checked) groups.push("cadet_twos");
        if (document.getElementById("cadet_ones-check").checked) groups.push("cadet_ones");
        if (document.getElementById("crusaders-check").checked) groups.push("crusaders");
        if (document.getElementById("leaders-check").checked) groups.push("leaders");
        
        var request = new XMLHttpRequest();
        request.open('POST', 'https://sjarestapi.herokuapp.com/column/new', true);
        
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                document.getElementById('add-mem-spinner').style.display='none';
                document.getElementById('submit-button').style.pointerEvents='auto';
                document.getElementById('cancel-button').style.pointerEvents ='auto';

                if ('error' in JSON.parse(request.responseText)) {
                    document.getElementById("nameUsed").style.display='block';
                    console.log(JSON.parse(request.responseText['error']));

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
        
        console.log(JSON.stringify({column: name, groups: groups}));
        request.send(JSON.stringify({column: name, groups: groups}));
    }

    updateValidity() {
        if (!/\S/.test(document.getElementById("inputColumn").value)) {
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
    }

    addForm() {
        // var form = document.getElementById("form");
        // var name = document.createElement("div");
        // name.setAttribute("className", "form-group");

    }

    render() {
        const { validName } = this.state;
        return (
            <div className="new-member-page">
                <h2 className="new-header">Add Column</h2>
                <form id="form">
                    <div className="form-group">
                        <label htmlFor="inputColumn">Column</label>
                        <input 
                            type="text" 
                            autoComplete="off"
                            spellCheck="false"
                            className={validName? "form-control" : "form-control outline-bad"} 
                            id="inputColumn" 
                            placeholder="Enter Column Name" 
                            onBlur={() => this.updateValidity()}></input>
                        <small id="nameError" className="my-form-text">Enter a valid column name</small>
                        <small id="nameUsed" className="my-form-text">This column already exists</small>
                    </div>
                    <div className="form-group form-check">
                        <input type="checkbox" className="form-check-input" id="juniors-check" />
                        <label className="form-check-label" htmlFor="juniors-check">Juniors</label>
                    </div>
                    <div className="form-group form-check">
                        <input type="checkbox" className="form-check-input" id="cadet_twos-check" />
                        <label className="form-check-label" htmlFor="cadet_twos-check">Cadet 2s</label>
                    </div>
                    <div className="form-group form-check">
                        <input type="checkbox" className="form-check-input" id="cadet_ones-check" />
                        <label className="form-check-label" htmlFor="cadet_ones-check">Cadet 1s</label>
                    </div>
                    <div className="form-group form-check">
                        <input type="checkbox" className="form-check-input" id="crusaders-check" />
                        <label className="form-check-label" htmlFor="crusaders-check">Crusaders</label>
                    </div>
                    <div className="form-group form-check">
                        <input type="checkbox" className="form-check-input" id="leaders-check" />
                        <label className="form-check-label" htmlFor="leaders-check">Leaders</label>
                    </div>
                </form>
                {/* <img className="add-img" src="https://img.icons8.com/material-outlined/64/000000/plus.png" onClick={() => this.addForm()}/> */}
                <div className="btn btn-primary" id="submit-button" onClick={() => this.newColumn()}>Submit</div>
                <Link className="btn btn-light" id="cancel-button" to="/">Cancel</Link>
                <div className="my-spinner" id="add-mem-spinner"></div>   
            </div> 
        );
    }
}

export default AddColumn