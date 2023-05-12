import Container from "react-bootstrap/Container";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Card from "react-bootstrap/Card";

import Button from "react-bootstrap/Button";

import Form from "react-bootstrap/Form";

import { Link, useSearchParams } from "react-router-dom";

import { useEffect, useState } from "react";

import { Problem, getProblem } from "./ProblemCard";

export interface ContestMeta {
  _id?: string;
  name?: string;
  date?: string;
  time?: string;
  desc?: string;
  duration?: string;
  public?: boolean;
}

export function getProblemsInContest(id: string) {
  return fetch(`/api/contests/contest-problems/${id}`)
    .then((res) => res.json())
    .then((res) => {
      var tmp: Promise<any>[] = [];
      for (var p of res) tmp.push(getProblem(p.id_problem));
      return Promise.all(tmp);
    });
}

export default function Contests({
  isMyContests = false,
}: {
  isMyContests?: boolean;
}) {
  const [contestsMeta, setContestsMeta] = useState<ContestMeta[]>([]);

  useEffect(() => {
    fetch("/api/contests")
      .then((res) => res.json())
      .then((info) => {
        setContestsMeta(info);
      });
  }, []);

  function createContest() {
    var reqBody = {
      name: "Test",
      date: "00-00-00",
      time: "00-00-00",
      duration: "0",
      id_author: "",
      desc: "Blank",
      public: true,
    };

    fetch("/api/contests", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      window.location.reload();
    });
  }

  function deleteContest(id: string) {
    console.log(id);
    fetch(`/api/contests/${id}`, { method: "DELETE" }).then((res) => {
      window.location.reload();
    });
  }

  function handleFilter() {}

  return (
    <>
      <Container className="mt-3">
        <Row>
          <Col>
            <Card>
              <Card.Header as="h3">
                Contests
                {isMyContests ? (
                  <Button
                    className="float-end"
                    variant="success"
                    onClick={createContest}
                  >
                    Create contest
                  </Button>
                ) : (
                  <Link to="/contests/my">
                    <Button className="float-end">My contests</Button>
                  </Link>
                )}
              </Card.Header>
              <Card.Body>
                {contestsMeta.map((contest, index) => {
                  return (
                    <>
                      {index > 0 && <hr />}
                      <Card.Title key={index}>
                        {contest.name}
                        {isMyContests && (
                          <Link to={`/contests/edit/${contest._id}`}>
                            <Button className="float-end">Edit</Button>
                          </Link>
                        )}
                      </Card.Title>
                      <Card.Text className="mb-1">
                        Date: {contest.date}
                      </Card.Text>
                      <Card.Text>Duration: {contest.duration}</Card.Text>
                      <Link to={`/contests/detail/${contest._id}`}>
                        <Button>Enter</Button>
                      </Link>
                      {isMyContests && (
                        <Button
                          variant="danger"
                          className="float-end"
                          onClick={() => {
                            deleteContest(contest._id as string);
                          }}
                        >
                          Delete contest
                        </Button>
                      )}
                    </>
                  );
                })}
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Header as="h5">Filter</Card.Header>
              <Card.Body>
                <Form onSubmit={handleFilter}>
                  <Form.Control
                    className="mb-2"
                    placeholder="Contest's name"
                    aria-label="Contest's name"
                    required
                  />

                  {/* <Form.Control
                  className="mb-3"
                  placeholder="Organizer"
                  aria-label="Organizer"
                /> */}

                  <Button type="submit" variant="outline-dark">
                    Search
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
