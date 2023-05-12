import Container from "react-bootstrap/Container";

import Form from "react-bootstrap/Form";

import FormControl from "react-bootstrap/FormControl";

import InputGroup from "react-bootstrap/InputGroup";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Button from "react-bootstrap/Button";

import { useSearchParams } from "react-router-dom";

import { useState, useEffect } from "react";

export default function Register() {
  const [params, setParams] = useSearchParams();

  function handleSubmit(e) {
    e.preventDefault();

    var registerBody = {
      user_name: e.target.user_name.value,
      password: e.target.password.value,
      about: e.target.about.value,
    };

    fetch(`/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerBody),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res) setParams({ success: "false" });
        else setParams({ success: "true" });
        window.location.reload();
      });
  }

  const [message, setMessage] = useState<string>();

  useEffect(() => {
    if (params.get("success") === "false")
      setMessage("Invalid username, please try again");
    else if (params.get("success") === "true")
      setMessage("Register success, please login");
  }, []);

  return (
    <Container className="mt-3">
      <h3>Register</h3>
      {message}
      <Row className="mt-5 justify-content-center">
        <Col md={4}>
          <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-2">
              <InputGroup.Text>Username</InputGroup.Text>
              <FormControl name="user_name" required></FormControl>
            </InputGroup>
            <InputGroup className="mb-2">
              <InputGroup.Text>Password</InputGroup.Text>
              <FormControl
                name="password"
                type="password"
                required
              ></FormControl>
            </InputGroup>
            <Form.Text>Description</Form.Text>
            <FormControl
              name="about"
              as="textarea"
              rows={10}
              className="mb-5"
            ></FormControl>

            <Button type="submit">Register</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
