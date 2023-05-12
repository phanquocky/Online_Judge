import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import Container from "react-bootstrap/Container";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Button from "react-bootstrap/Button";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Login() {
  const [message, setMessage] = useState<string>();

  function handleSubmit(e) {
    e.preventDefault();
    // localStorage.setItem("username", e.target.username.value);
    // window.location.reload();

    var loginBody = {
      user_name: e.target.username.value,
      password: e.target.password.value,
    };

    fetch(`/api/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginBody),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res === "0")
          setMessage("Invalid username and/or password. Please try again");
        else {
          setMessage("");
          localStorage.setItem("username", loginBody.user_name);
          localStorage.setItem("id_user", res);

          window.location.reload();
        }
      });
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("username")) {
      navigate("/");
    }
  }, []);

  return (
    <Container className="mt-3">
      <h3>Login</h3>
      {message}
      <Row className="mt-5 justify-content-center">
        <Col md="3">
          <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-1">
              <InputGroup.Text>Username</InputGroup.Text>
              <Form.Control name="username" required></Form.Control>
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>Password</InputGroup.Text>
              <Form.Control
                name="password"
                required
                type="password"
              ></Form.Control>
            </InputGroup>
            <Button type="submit">Login</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
