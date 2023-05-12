import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// import "katex/dist/katex.min.css";
import { useParams, Link } from "react-router-dom";

import { useState, useEffect } from "react";

import { getProblem, Problem } from "./ProblemCard";

export interface TestCase {
  input?: string;
  output?: string;
}

export default function ProblemDetail() {
  const params = useParams();
  const id = params.id;

  const [info, setInfo] = useState<Problem>();
  const [sampleTestCases, setSampleTestCases] = useState<TestCase[]>([]);

  useEffect(() => {
    fetch(`/api/api-sample-by-problem-id/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setSampleTestCases(res);
      });

    getProblem(id as string).then((res) => {
      setInfo(res);
    });
  }, []);

  return (
    <>
      <Container className="mb-5">
        <Row className="mt-3 mb-4">
          <Col md={6}>
            <h1>{info?.name as string}</h1>
          </Col>
          <Col className="pt-3">Time limit: {info?.time_limit as number}ms</Col>
          <Col className="pt-3">Mem. limit: {info?.mem_limit as number}Mb</Col>
          <Col className="pt-3" md={2}>
            <Link to={"/problems/submit/" + id}>
              <Button className="float-end">Submit</Button>
            </Link>
          </Col>
        </Row>

        <Card className="mb-3">
          <Card.Header as="h4">Description</Card.Header>
          <Card.Body>
            <ReactMarkdown
              children={info?.description as string}
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
            />
          </Card.Body>
        </Card>

        <Card className="mb-3">
          <Card.Header as="h4">Input</Card.Header>
          <Card.Body>
            <ReactMarkdown
              children={info?.input as string}
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
            />
          </Card.Body>
        </Card>

        <Card className="mb-3">
          <Card.Header as="h4">Output</Card.Header>
          <Card.Body>
            <ReactMarkdown
              children={info?.output as string}
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
            />
          </Card.Body>
        </Card>

        {sampleTestCases.map((test, index) => {
          return (
            <Row key={index}>
              <h3>Sample #{index + 1}</h3>
              <CardGroup>
                <Card>
                  <Card.Header as="h4">Input</Card.Header>
                  <Card.Body>{test.input}</Card.Body>
                </Card>
                <Card>
                  <Card.Header as="h4">Output</Card.Header>
                  <Card.Body>{test.output}</Card.Body>
                </Card>
              </CardGroup>
            </Row>
          );
        })}
      </Container>
    </>
  );
}
