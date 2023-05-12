import SubmissionTable from "./SubmissionTable";

import Container from "react-bootstrap/Container";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Card from "react-bootstrap/Card";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";
import { useParams } from "react-router-dom";

import { useState, useEffect } from "react";

// const exampleUserInfo = `
// Some random info:
// - a
// - b
// - $\\sum_{1}^{n}$
// `;

export interface User {
  _id?: string;
  user_name?: string;
  password?: string;
  user_type?: boolean;
  avatar_link?: string;
  email?: string;
  about?: string;
  organization?: string;
  solved?: string;
}

export default function UserDetail() {
  const params = useParams();

  const id = params.id;

  const [userInfo, setUserInfo] = useState<User>();

  useEffect(() => {
    fetch(`/api/api-user/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setUserInfo(res[0]);
      });
  }, []);

  return (
    <>
      <p>{id}</p>
      <Container className="mt-3">
        <Row>
          <Col md={3}>
            <Card>
              <Card.Header as="h3">{userInfo?.user_name}</Card.Header>
              <div className="d-flex justify-content-center mt-5">
                <Card.Img style={{ width: 200, height: 200 }}></Card.Img>
              </div>
              <Card.Body>
                <ReactMarkdown
                  children={"About: " + userInfo?.about}
                  remarkPlugins={[remarkMath, remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <SubmissionTable idUser={id} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
