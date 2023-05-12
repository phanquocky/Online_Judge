import { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import Badge from "react-bootstrap/Badge";

import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

import FloatingLabel from "react-bootstrap/FloatingLabel";

import ProblemCard, { Problem } from "./ProblemCard";

import Pagination from "react-bootstrap/Pagination";

import { Link, Navigate, useNavigate } from "react-router-dom";

export interface Tag {
  _id: string;
  name: string;
}

export function getAllTags() {
  return fetch("/api/get-all-tags").then((res) => res.json());
}

export function getProblemTags(id: string) {
  return fetch(`/api/get-name-tag/${id}`).then((res) => res.json());
}

export default function ProblemsPage({
  isMyProblems = false,
}: {
  isMyProblems?: boolean;
}) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemName, setProblemName] = useState<string>();
  const [author, setAuthor] = useState<string>();
  const [difficulty, setDifficulty] = useState<number>();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>();

  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      isMyProblems
        ? `/api/api-my-problem/${localStorage.getItem("id_user")}`
        : "/api/api-all-problems"
    )
      .then((res) => res.json())
      .then((problemsList) => {
        console.log("Dit");
        setProblems(problemsList);
      });

    getAllTags().then((res) => {
      setAvailableTags(res);
    });
  }, []);

  if (isMyProblems && !localStorage.getItem("username")) {
    navigate("/login");
  }

  function createProblem() {
    fetch(`/api/post-problem/${localStorage.getItem("id_user")}`, {
      method: "POST",
      body: JSON.stringify({
        name: "Untitled",
        public: false,
        difficulty: 1600,
        time_limit: 0,
        mem_limit: 0,
        input: "",
        output: "",
        description: "",
        solved: 0,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      window.location.reload();
    });
  }

  function searchProblem() {
    const searchParams = new URLSearchParams();
    if (problemName) searchParams.append("name", problemName as string);
    if (difficulty) searchParams.append("diff", difficulty.toString());
    if (author) searchParams.append("author", author as string);
    for (var tag of selectedTags) {
      searchParams.append("tag", tag.name);
    }

    fetch(`/api/api-search-problem?${searchParams.toString()}`)
      .then((res) => res.json())
      .then((res) => {
        setProblems(res);
      });
  }

  useEffect(() => {
    console.log(problems);
  }, [problems]);

  return (
    <>
      <Container className="mt-3 mb-5">
        <Row>
          <Col>
            <Card>
              <Card.Header as="h3">
                Problems
                {isMyProblems ? (
                  <Button
                    className="float-end"
                    variant="success"
                    onClick={createProblem}
                  >
                    Create problem
                  </Button>
                ) : (
                  <Link to="/problems/my">
                    <Button className="float-end">My problems</Button>
                  </Link>
                )}
              </Card.Header>
              <ProblemCard problems={problems} isMyProblems={isMyProblems} />
            </Card>
            <Pagination className="mt-3">
              <Pagination.Item key={1}>1</Pagination.Item>
              <Pagination.Item key={2}>2</Pagination.Item>
              <Pagination.Item key={3}>3</Pagination.Item>
            </Pagination>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Header as="h5">Filter</Card.Header>
              <Card.Body>
                <InputGroup className="mb-2">
                  <Form.Control
                    placeholder="Problem's name"
                    aria-label="Problem's name"
                    aria-describedby="basic-addon2"
                    onChange={(e) => {
                      setProblemName(e.target.value);
                    }}
                  />
                </InputGroup>

                <InputGroup className="mb-2">
                  <Form.Control
                    placeholder="Author's name"
                    aria-label="Author's username"
                    aria-describedby="basic-addon2"
                    onChange={(e) => {
                      setAuthor(e.target.value);
                    }}
                  />
                </InputGroup>

                <Form.Label>Min. difficulty: {difficulty}</Form.Label>
                <Form.Range
                  min={1500}
                  max={3000}
                  step={100}
                  defaultValue={1600}
                  onChange={(e) => setDifficulty(parseInt(e.target.value))}
                />

                <Form.Label>Selected </Form.Label>
                <Button
                  variant="outline-dark"
                  className="float-end"
                  onClick={() => setSelectedTags([])}
                >
                  Clear
                </Button>

                <Container className="mb-3">
                  {selectedTags.map((tag, index) => {
                    return (
                      <Badge bg="info" className="me-1" key={index}>
                        {tag.name}
                      </Badge>
                    );
                  })}
                </Container>

                <FloatingLabel label="Pick a tag">
                  <Form.Select
                    className="mb-3"
                    onChange={(e) => {
                      var toAddedTag = JSON.parse(e.target.value);

                      for (var tag of selectedTags)
                        if (tag._id === toAddedTag._id) return;
                      setSelectedTags((prev) => [...prev, toAddedTag]);
                    }}
                  >
                    {availableTags?.map((tag, index) => {
                      return (
                        <option key={index} value={JSON.stringify(tag)}>
                          {tag.name}
                        </option>
                      );
                    })}
                  </Form.Select>
                </FloatingLabel>

                <Button variant="outline-dark" onClick={searchProblem}>
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
