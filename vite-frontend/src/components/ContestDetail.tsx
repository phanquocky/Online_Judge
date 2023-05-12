import Container from "react-bootstrap/Container";
import ProblemsCard, { Problem } from "./ProblemCard";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Link, useSearchParams, useParams } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import Table from "react-bootstrap/Table";

import Pagination from "react-bootstrap/Pagination";

import { useEffect, useState } from "react";

import { ContestMeta, getProblemsInContest } from "./Contests";

import Card from "react-bootstrap/Card";

export default function ContestDetail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [problems, setProblems] = useState<Problem[]>();
  const params = useParams();

  const contestId = params.id;

  const [info, setInfo] = useState<null | ContestMeta>();

  function handleSelect(eventKey) {
    setSearchParams({ tab: eventKey });
  }

  useEffect(() => {
    fetch(`/api/contests/${contestId}`)
      .then((res) => res.json())
      .then((contest) => setInfo(contest[0]));

    getProblemsInContest(contestId as string).then((res) => {
      setProblems(res);
    });
  }, []);

  return (
    <>
      <Container>
        <Tabs
          onSelect={handleSelect}
          defaultActiveKey={searchParams.get("tab") || "info"}
          className="mt-3"
        >
          <Tab eventKey="info" title="Information">
            <ReactMarkdown
              className="mt-3"
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {info ? (info.desc as string) : ""}
            </ReactMarkdown>
          </Tab>
          <Tab eventKey="problems" title="Problems">
            <Row className="mt-3">
              <Col>
                <Card>
                  <Card.Header></Card.Header>
                  <ProblemsCard
                    inContest={true}
                    problems={problems}
                    isMyProblems={false}
                  />
                </Card>
              </Col>
            </Row>
          </Tab>
          {/* <Tab eventKey="ranking" title="Ranking">
            <Table className="mt-3" bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Penalty</th>
                  {["A", "B", "C", "D", "E"].map((problem, index) => {
                    return <th key={index}>{problem}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {Array.from(Array(10), (num, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <Link to="/users/detail/admin">abcdef</Link>
                      </td>
                      <td>123321</td>
                      {["A", "B", "C", "D", "E"].map((problem, index) => {
                        return (
                          <td
                            key={index}
                            style={{ backgroundColor: "#48C9B0" }}
                          >
                            {1}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Pagination>
              <Pagination.Item key={1}>1</Pagination.Item>
              <Pagination.Item key={2}>2</Pagination.Item>
              <Pagination.Item key={3}>3</Pagination.Item>
            </Pagination>
          </Tab> */}
        </Tabs>
      </Container>
    </>
  );
}
