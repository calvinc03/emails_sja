import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

class Homepage extends Component {

  componentDidMount() {
    this.loadTableData('juniors');
    this.loadTableData('cadet_twos');
    this.loadTableData('cadet_ones');
    this.loadTableData('crusaders');
    this.loadTableData('leaders');
  }

  async loadTableData(group) {
      var HeaderRequest = new XMLHttpRequest();
      HeaderRequest.open('GET', `https://sjarestapi.herokuapp.com/table?group=${group}`, true);
      HeaderRequest.onreadystatechange = function() {
        if (HeaderRequest.readyState === XMLHttpRequest.DONE) {
          var headers = JSON.parse(HeaderRequest.responseText)['table'];
          document.getElementById(`${group}-spinner`).style.display = 'none';
          const tableheader = document.getElementById(`${group}-header`);
          var headerhtml = '<tr><th scope="col">#</th>';
          for (var i in headers) {
            headerhtml += `<th scope="col">${headers[i]}</th>`;
          }
          headerhtml += '</tr>';
          tableheader.innerHTML = headerhtml;
        }
      }
      HeaderRequest.send();
      

      var BodyRequest = new XMLHttpRequest();
      BodyRequest.open('GET', `https://sjarestapi.herokuapp.com/member/all?group=${group}`, true);
      BodyRequest.onreadystatechange = function() {
        if (BodyRequest.readyState === XMLHttpRequest.DONE) {
          var data = JSON.parse(BodyRequest.responseText)['members'];
          const tablebody = document.getElementById(`${group}-body`);
          var bodyhtml = '';
          var num = 1
          for (var j in data) {
            var row = `<tr><th scope="row">${num}</th>`
            for (var k in data[j]) {
              row += `<td>${data[j][k]}</td>`
            }
            bodyhtml += row + '</tr>'
            num += 1
      }
      tablebody.innerHTML = bodyhtml;

        }
      }
      BodyRequest.send();
  }

  render() {
    return (
        <div className="homepage">
          <Link to="/new"><button type="button" className="btn btn-info btn-add-mem">Add Member</button></Link>
          <h2>Juniors</h2>
          <Spinner animation="border" id="juniors-spinner" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <table className="table">
            <thead id="juniors-header"></thead>
            <tbody id="juniors-body">
            </tbody>
          </table>
          <h2>Cadet Twos</h2>
          <Spinner animation="border" id="cadet_twos-spinner" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <table className="table">
            <thead id="cadet_twos-header"></thead>
            <tbody id="cadet_twos-body">
            </tbody>
          </table>
          <h2>Cadet Ones</h2>
          <Spinner animation="border" id="cadet_ones-spinner" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <table className="table">
            <thead id="cadet_ones-header"></thead>
            <tbody id="cadet_ones-body">
            </tbody>
          </table>
          <h2>Crusaders</h2>
          <Spinner animation="border" id="crusaders-spinner" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <table className="table">
            <thead id="crusaders-header"></thead>
            <tbody id="crusaders-body">
            </tbody>
          </table>
          <h2>Leaders</h2>
          <Spinner animation="border" id="leaders-spinner" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <table className="table">
            <thead id="leaders-header"></thead>
            <tbody id="leaders-body">
            </tbody>
          </table>
        </div>
    );
  }
}

export default Homepage;
