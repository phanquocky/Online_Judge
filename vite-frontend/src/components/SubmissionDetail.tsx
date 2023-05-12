import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

import Table from "react-bootstrap/Table";

import { Link, useParams } from "react-router-dom";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const exampleSource = `#include <bits/stdc++.h>
using namespace std;

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int a, b;   cin >> a >> b;
    cout << (a + b) << endl;
    
    return 0;
}`;

export default function SubmissionDetail() {
  const params = useParams();

  console.log(params);

  return (
    <>
      <Container className="mt-3">
        <Table bordered striped hover size="sm">
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
            <tr>
              <td>
                <Link to="/submissions/detail/1231231">1000001</Link>
              </td>
              <td>05/11/2022 19:30</td>
              <td>
                <Link to="/problems/detail/1231231">A + B</Link>
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
          </tbody>
        </Table>

        <Card>
          <Card.Header as="h5">Source</Card.Header>
          <Card.Body>
            <SyntaxHighlighter language="cpp" style={docco}>
              {exampleSource}
            </SyntaxHighlighter>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
