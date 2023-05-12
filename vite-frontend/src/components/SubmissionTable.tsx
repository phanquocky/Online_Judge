import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
type Submission = {
  _id: String;
  when: String;
  time: String;
  language: String;
};
export default function SubmissionTable(probs) {
  const [submissions, setSubmission] = useState<Submission[]>([]);
  const [problemName, setProblemName] = useState<String>("");
  const [userName, setUserName] = useState<String>("");

  useEffect(() => {
    fetch(`/api/submissions/sumission-user/${probs.idUser}`)
      .then((res) => res.json())
      .then((submissions) => {
        setSubmission(submissions);
      });
  }, []);

  console.log(submissions);
  return (
    <Table bordered striped hover size="sm">
      <p>{probs.idUser}</p>
      <thead>
        <tr>
          <th>#</th>
          <th>When</th>
          <th>Problem</th>
          <th>Author</th>
          <th>Language</th>
          <th>Verdict</th>
          <th>Memory</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((item) => {
          return (
            <tr>
              <td>
                <Link to={`/submissions/detail/${item._id}`}>{item._id}</Link>
              </td>
              <td>{item.when + "  " + item.time}</td>
              <td>
                <Link to="/problems/detail/1234567"></Link>
              </td>
              <td>
                <Link to="/users/detail/admin">admin</Link>
              </td>
              <td>{item.language}</td>
              <td>
                <b className="text-danger">WA</b>
              </td>
              <td>200Kb</td>
              <td>350ms</td>
            </tr>
          );
        })}
        {/* <tr>
          <td>
            <Link to="/submissions/detail/1000001">1000001</Link>
          </td>
          <td>05/11/2022 19:30</td>
          <td>
            <Link to="/problems/detail/1234567">A + B</Link>
          </td>
          <td>
            <Link to="/users/detail/admin">admin</Link>
          </td>
          <td>C++</td>
          <td>
            <b className="text-danger">WA</b>
          </td>
          <td>200Kb</td>
          <td>350ms</td>
        </tr>

        <tr>
          <td>
            <Link to="/submissions/detail/1000001">1000001</Link>
          </td>
          <td>05/11/2022 19:11</td>
          <td>
            <Link to="/problems/detail/2000000">A + B</Link>
          </td>
          <td>
            <Link to="/users/detail/admin">admin</Link>
          </td>
          <td>C++</td>
          <td>
            <b className="text-success">AC</b>
          </td>
          <td>200Kb</td>
          <td>350ms</td>
        </tr> */}
      </tbody>
    </Table>
  );
}
