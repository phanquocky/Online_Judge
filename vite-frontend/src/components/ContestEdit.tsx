import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

import ToggleButton from "react-bootstrap/ToggleButton";

import Button from "react-bootstrap/Button";

import { ContestMeta, getProblemsInContest } from "./Contests";

import { Problem } from "./ProblemCard";

import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

export default function ContestEdit() {
  const params = useParams();
  const id = params.id;

  const [problems, setProblems] = useState<Problem[]>([]);
  const [info, setInfo] = useState<ContestMeta>({ _id: id });
  const [toBeAdded, setToBeAdded] = useState("");

  useEffect(() => {
    fetch(`/api/contests/${id}`)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setInfo(res[0]);
      });

    getProblemsInContest(id as string).then((res) => {
      setProblems(res);
    });
  }, []);

  function handleChange(e) {
    var key = e.target.name;
    var value = e.target.value;
    setInfo((preInfo) => {
      return { ...preInfo, [key]: value };
    });
  }

  function save() {
    fetch(`/api/contests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    })
      .then((res) => res.json())
      .then((res) => {
        window.location.reload();
      });
  }

  function deleteProblem(problemID: string) {
    fetch(`/api/contests/contest-problems/${id}/${problemID}`, {
      method: "DELETE",
    }).then((res) => {
      getProblemsInContest(id as string).then((res) => {
        setProblems(res);
      });
    });
  }

  function addProblem(problemID: string) {
    fetch(`/api/contests/contest-problems`, {
      method: "POST",
      body: JSON.stringify({ id_contest: id, id_problem: problemID }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      getProblemsInContest(id as string).then((res) => {
        setProblems(res);
      });
    });
  }

  return (
    <>
      <Container className="mt-3 mb-5">
        <h4>General information</h4>

        <InputGroup className="mb-2">
          <InputGroup.Text>Contest's title</InputGroup.Text>
          <Form.Control
            name="name"
            defaultValue={info?.name}
            onChange={handleChange}
          ></Form.Control>
          <Form.Select
            onChange={(e) => {
              var option = e.target.value === "true" ? true : false;

              setInfo((preInfo) => {
                return { ...preInfo, public: option };
              });
            }}
          >
            <option value="true" selected={info?.public}>
              Public
            </option>
            <option value="false" selected={!info?.public}>
              Private
            </option>
          </Form.Select>
        </InputGroup>

        <InputGroup>
          <InputGroup.Text>Start date</InputGroup.Text>
          <Form.Control
            name="date"
            placeholder="dd-mm-yyyy"
            defaultValue={info?.date}
            onChange={handleChange}
          ></Form.Control>
          <InputGroup.Text className="ms-1">Start time</InputGroup.Text>
          <Form.Control
            name="time"
            placeholder="hh-mm-ss"
            defaultValue={info?.time}
            onChange={handleChange}
          ></Form.Control>
          <InputGroup.Text className="ms-1">Duration</InputGroup.Text>
          <Form.Control
            name="duration"
            defaultValue={info?.duration}
            onChange={handleChange}
          ></Form.Control>
          <InputGroup.Text>minutes</InputGroup.Text>
        </InputGroup>

        <h4 className="mt-3">Contest description</h4>
        <Form.Control
          name="desc"
          as="textarea"
          rows={20}
          value={info?.desc}
          onChange={handleChange}
        ></Form.Control>

        <h4 className="mt-3">Problems</h4>

        <InputGroup className="mb-2">
          <InputGroup.Text>Problem's ID</InputGroup.Text>
          <Form.Control
            onChange={(e) => setToBeAdded(e.target.value)}
          ></Form.Control>
          <Button
            onClick={() => {
              addProblem(toBeAdded);
            }}
          >
            Add
          </Button>
        </InputGroup>

        {problems.map((problem, index) => {
          return (
            <React.Fragment key={index}>
              <InputGroup className="mb-1">
                <Form.Control readOnly value={problem?.name}></Form.Control>
                <Button
                  variant="warning"
                  onClick={() => {
                    deleteProblem(problem._id as string);
                  }}
                >
                  Remove
                </Button>
              </InputGroup>
            </React.Fragment>
          );
        })}

        <Button className="mt-5 me-1" onClick={save}>
          Save
        </Button>
        <Button variant="danger" className="mt-5">
          Delete
        </Button>
      </Container>
    </>
  );
}
