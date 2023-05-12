import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { Fragment } from "react";

export interface Problem {
  _id?: string;
  name?: string;
  difficulty?: number;
  solved?: number;
  time_limit?: number;
  mem_limit?: number;
  description?: string;
  input?: string;
  output?: string;
  public?: boolean;
}

export function getProblem(problemID: string) {
  return fetch(`/api/api-problem-by-id/${problemID}`)
    .then((res) => res.json())
    .then((res) => res[0]);
}

export default function ProblemsCard({
  inContest = false,
  problems = null,
  isMyProblems = false,
}: {
  inContest?: boolean;
  problems?: null | Problem[];
  isMyProblems?: boolean;
}) {
  function deleteProblem(id: string) {
    fetch(`/api/api-delete-problem/${id}`).then(() => {
      window.location.reload();
    });
  }

  return (
    //<Card>
    <Card.Body>
      {problems?.map((problem, index) => {
        return (
          <Fragment key={index}>
            {index > 0 && <hr />}
            <Card.Title>
              {problem?.name}
              {isMyProblems && (
                <Link to={`/problems/edit/${problem._id}`}>
                  <Button className="float-end">Edit</Button>
                </Link>
              )}
            </Card.Title>
            {!inContest && (
              <Card.Text className="mb-1">
                Difficulty: {problem?.difficulty}
              </Card.Text>
            )}
            <Card.Text>Solved: {problem?.solved}</Card.Text>
            <Link to={`/problems/detail/${problem?._id}`}>
              <Button>Read problem</Button>
            </Link>
            {isMyProblems && (
              <Button
                variant="danger"
                className="float-end"
                onClick={() => {
                  deleteProblem(problem?._id as string);
                }}
              >
                Delete problem
              </Button>
            )}
          </Fragment>
        );
      })}
    </Card.Body>
    //</Card>
  );
}
