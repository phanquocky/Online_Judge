import Container from "react-bootstrap/Container";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Button from "react-bootstrap/Button";

import Form from "react-bootstrap/Form";

import FloatingLabel from "react-bootstrap/FloatingLabel";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function ProblemSubmit() {
  const params = useParams();
  const id = params.id;

  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    /* TODO: Do some submit on the server here and navigate to that submissions*/

    const lang = e.currentTarget.lang.value;
    const source = e.currentTarget.source.value;

    const submitBody = {
      source: source,
      user: localStorage.getItem("username"),
      problem: id,
    };

    if (lang === "cpp") {
      fetch(`/api/submit-cpp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitBody),
      });
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("username")) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <Container className="mb-5">
        <Form onSubmit={handleSubmit}>
          <Row className="mt-3">
            <Col md={6}>
              <h1>A + B</h1>
            </Col>
            <Col className="pt-3">Time limit: 1500ms</Col>
            <Col className="pt-3">Mem. limit: 512Mb</Col>
            <Col className="pt-3" md={2}>
              <Button className="float-end" type="submit">
                Submit
              </Button>
            </Col>
          </Row>

          <FloatingLabel className="mt-3" label="Programming language">
            <Form.Select name="lang">
              {[
                { lang: "C++", key: "cpp" },
                // { lang: "Python", key: "py" },
                // { lang: "Java", key: "java" },
              ].map((lang) => {
                return (
                  <option value={lang.key} key={lang.key}>
                    {lang.lang}
                  </option>
                );
              })}
            </Form.Select>
          </FloatingLabel>

          <Form.Group className="mt-3">
            <Form.Text>
              <h4>Source code</h4>
            </Form.Text>
            <code>
              <Form.Control name="source" as="textarea" rows={20} required />
            </code>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
}
