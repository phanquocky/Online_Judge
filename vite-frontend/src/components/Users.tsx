import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Card from "react-bootstrap/Card";

import FormControl from "react-bootstrap/FormControl";

import Button from "react-bootstrap/Button";

import { Link } from "react-router-dom";

import UserDetail, { User } from "./UserDetail";

import { useState, useEffect } from "react";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [userName, setUserName] = useState<String>("pqk");
  const [userOrganization, setUserOrganization] = useState<String>("hcmus");

  function searchUser() {
    const searchParams = new URLSearchParams();
    if (userName.length > 0)
      searchParams.append("user_name", userName as string);
    if (userOrganization.length > 0)
      searchParams.append("organization", userOrganization as string);

    fetch(`/api/api-user-problem?${searchParams.toString()}`)
      .then((res) => res.json())
      .then((res) => {
        setUsers(res);
      });
  }

  useEffect(() => {
    fetch("/api/api-all-users")
      .then((res) => res.json())
      .then((userList) => {
        setUsers(userList);
      });
  }, []);

  return (
    <>
      <Container className="mt-3">
        <Row>
          <Col>
            <Table bordered striped hover>
              <thead>
                <tr>
                  <th>User</th>
                  <th># solved</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => {
                  return (
                    <tr>
                      <td>
                        <Link to={"/users/detail/" + item._id}>
                          {item.user_name}
                        </Link>
                      </td>
                      <td>{item.solved}</td>
                    </tr>
                  );
                })}
                {/* {users.map((item) => {
                  <tr>
                    <td>
                      <Link to="/users/detail/admin">item.user_name</Link>
                    </td>
                    <td>item.solved</td>
                  </tr>;
                })} */}
              </tbody>
            </Table>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Header as="h5">Filter</Card.Header>
              <Card.Body>
                <FormControl
                  className="mb-2"
                  placeholder="User's name"
                  aria-label="User's name"
                ></FormControl>

                <FormControl
                  className="mb-3"
                  placeholder="Organization"
                  aria-label="Organization"
                ></FormControl>

                <Button variant="outline-dark" onClick={searchUser}>
                  Search
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
