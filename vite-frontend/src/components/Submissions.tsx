import Container from "react-bootstrap/Container";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Card from "react-bootstrap/Card";

import Form from "react-bootstrap/Form";

import FormSelect from "react-bootstrap/FormSelect";

import Button from "react-bootstrap/Button";
import SubmissionTable from "./SubmissionTable";

import FloatingLabel from "react-bootstrap/FloatingLabel";

import Pagination from "react-bootstrap/Pagination";

export default function Submissions() {
  return (
    <>
      <Container className="mt-4">
        <Row>
          <Col>
            <SubmissionTable />
            <Pagination>
              <Pagination.Item key={1}>1</Pagination.Item>
              <Pagination.Item key={2}>2</Pagination.Item>
              <Pagination.Item key={3}>3</Pagination.Item>
            </Pagination>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Header as="h5">Filter</Card.Header>
              <Card.Body>
                <Form.Control
                  className="mb-2"
                  placeholder="Problem's name"
                  aria-label="Problem's name"
                />

                <Form.Control
                  className="mb-2"
                  placeholder="Author's name"
                  aria-label="Author's name"
                />

                <FloatingLabel className="mb-2" label="Language">
                  <FormSelect>
                    <option>C++</option>
                    <option>Python</option>
                    <option>Java</option>
                  </FormSelect>
                </FloatingLabel>

                <FloatingLabel className="mb-3" label="Verdict">
                  <FormSelect>
                    <option>AC</option>
                    <option>WA</option>
                    <option>TLE</option>
                  </FormSelect>
                </FloatingLabel>

                <Button variant="outline-dark">Search</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
