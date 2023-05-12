import Container from "react-bootstrap/Container";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";

import FormGroup from "react-bootstrap/FormGroup";

import Table from "react-bootstrap/Table";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import Badge from "react-bootstrap/Badge";

import FloatingLabel from "react-bootstrap/FloatingLabel";

import { Problem, getProblem } from "./ProblemCard";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Tag, getAllTags, getProblemTags } from "./ProblemsPage";

export interface TestCase {
  _id?: string;
  id_problem: string;
  input?: string;
  output?: string;
  is_eg?: string;
}

export default function ProblemEdit() {
  const params = useParams();
  const navigate = useNavigate();

  const id = params.id;

  const [info, setInfo] = useState<Problem>({ _id: id as string });
  const [tests, setTests] = useState<TestCase[]>([]);
  const [toBeUploadedTests, setToBeUploadedTests] = useState<FileList>();

  const [tags, setTags] = useState<Tag[]>();
  const [availableTags, setAvailableTags] = useState<Tag[]>(); // available tags to select from

  useEffect(() => {
    getProblem(id as string).then((res) => {
      setInfo(res);
    });

    getAllTests().then((res) => {
      setTests(res);
    });

    getAllTags().then((res) => {
      setAvailableTags(res);
    });

    getProblemTags(id as string).then((res) => {
      console.log(res);
      setTags(res);
    });
  }, []);

  function getAllTests() {
    return fetch(`/api/api-all-tests?id_problem=${id}`).then((res) =>
      res.json()
    );
  }

  function handleChange(key, value) {
    setInfo((preInfo) => {
      return { ...preInfo, [key]: value };
    });
  }

  function saveProblem(e) {
    e.preventDefault();
    var jsonBody = { ...info };
    delete jsonBody._id;

    fetch(`/api/api-update-problem?id=${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonBody),
    }).then((res) => {
      window.location.reload();
    });
  }

  function deleteProblem() {
    fetch(`/api/api-delete-problem/${id}`).then((res) => {
      navigate("/problems/my");
    });
  }

  function deleteAllTestCases() {
    var promises: Promise<any>[] = [];
    for (var test of tests)
      promises.push(fetch(`/api/api-delete-sample/${test._id}`));

    Promise.all(promises).then((res) => {
      getAllTests().then((res) => setTests(res));
    });
  }

  function deleteTestCase(id: string) {
    fetch(`/api/api-delete-sample/${id}`)
      .then((res) => res.json())
      .then((res) => {
        getAllTests().then((res) => setTests(res));
      });
  }

  function uploadTestCases() {
    if (!toBeUploadedTests) return;

    var sortedFiles = Array.from(toBeUploadedTests as FileList).sort();
    console.log(sortedFiles);

    var texts: Promise<any>[] = [];
    for (const file of sortedFiles) texts.push(file.text());

    Promise.all(texts).then((res) => {
      var testCases: Promise<any>[] = [];

      for (var i = 0; i < res.length; i += 2) {
        var currentTest: TestCase = {
          id_problem: id as string,
          input: res[i],
          output: res[i + 1],
          is_eg: "false",
        };

        testCases.push(
          fetch(`/api/api-add-sample`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentTest),
          })
        );
      }

      Promise.all(testCases).then((res) => {
        getAllTests().then((res) => {
          setTests(res);
        });
      });
    });
  }

  return (
    <>
      <Form onSubmit={saveProblem}>
        <Container className="mt-3 mb-5">
          <Tabs defaultActiveKey="info">
            <Tab className="mt-3" eventKey="info" title="Info">
              <h4>General information</h4>
              <Row className="mb-2">
                <InputGroup>
                  <InputGroup.Text>Problem's title</InputGroup.Text>
                  <Form.Control
                    required
                    name="name"
                    onChange={(e) => {
                      handleChange("name", e.target.value);
                    }}
                    defaultValue={info?.name}
                  ></Form.Control>
                  <Form.Select
                    onChange={(e) => {
                      var tmp = e.target.value === "true" ? true : false;
                      setInfo((preInfo) => {
                        return { ...preInfo, public: tmp };
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
              </Row>
              <Row className="mb-2">
                <InputGroup>
                  <InputGroup.Text>Time limit</InputGroup.Text>
                  <Form.Control
                    required
                    name="time_limit"
                    defaultValue={info?.time_limit}
                    onChange={(e) => {
                      handleChange("time_limit", parseInt(e.target.value));
                    }}
                  ></Form.Control>
                  <InputGroup.Text>ms</InputGroup.Text>
                  <InputGroup.Text className="ms-1">Mem. limit</InputGroup.Text>
                  <Form.Control
                    required
                    name="mem_limit"
                    defaultValue={info?.mem_limit}
                    onChange={(e) => {
                      handleChange("mem_limit", parseInt(e.target.value));
                    }}
                  ></Form.Control>
                  <InputGroup.Text>MB</InputGroup.Text>
                </InputGroup>
              </Row>

              <h4 className="mt-4">Checker</h4>
              <Form.Control type="file" />

              <h4 className="mt-4">Problem's description</h4>
              <Form.Control
                as="textarea"
                rows={12}
                name="description"
                value={info?.description}
                onChange={(e) => {
                  handleChange("description", e.target.value);
                }}
              />

              <h4 className="mt-4">Input's description</h4>
              <Form.Control
                as="textarea"
                rows={4}
                name="input"
                value={info?.input}
                onChange={(e) => {
                  handleChange("input", e.target.value);
                }}
              />

              <h4 className="mt-4">Output's description</h4>
              <Form.Control
                as="textarea"
                rows={4}
                name="output"
                value={info?.output}
                onChange={(e) => {
                  handleChange("output", e.target.value);
                }}
              />
            </Tab>
            <Tab className="mt-3" eventKey="tags" title="Difficulty & Tags">
              <h4>
                Difficulty <Badge bg="secondary">{info.difficulty}</Badge>
              </h4>
              <Form.Range
                min={1500}
                max={3000}
                step={100}
                defaultValue={info.difficulty}
                onChange={(e) => {
                  handleChange("difficulty", parseInt(e.target.value));
                }}
              />

              <h4 className="mt-3">
                Tags
                <Button
                  onClick={() => {
                    fetch(`/api/remove-all-tag/${id}`, { method: "DELETE" })
                      .then((res) => res.json())
                      .then((res) => {
                        console.log(res);
                      });
                  }}
                  variant="outline-dark"
                  className="ms-2"
                >
                  Clear
                </Button>
              </h4>
              {tags?.map((tag) => {
                return (
                  <Badge bg="info" className="me-1">
                    {tag.name}
                  </Badge>
                );
              })}

              <FloatingLabel className="mt-4" label="Pick a tag">
                <Form.Select
                  onChange={(e) => {
                    fetch(`/api/add-tag/${id}?tag_id=${e.target.value}`, {
                      method: "POST",
                    })
                      .then((res) => res.json())
                      .then((res) => {
                        console.log(res);
                      });
                  }}
                >
                  <option>...</option>
                  {availableTags?.map((tag, index) => {
                    return (
                      <option key={index} value={tag._id}>
                        {tag.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </FloatingLabel>
            </Tab>
            <Tab className="mt-3" eventKey="tests" title="Test cases">
              <h4>Upload test cases</h4>
              <FormGroup>
                <Form.Control
                  type="file"
                  multiple
                  onChange={(e) => {
                    setToBeUploadedTests(
                      (e.target as HTMLInputElement).files as FileList
                    );
                  }}
                />
                <Button
                  variant="outline-dark"
                  className="mt-2"
                  onClick={uploadTestCases}
                >
                  Upload
                </Button>
                <Button
                  variant="outline-dark"
                  className="mt-2 ms-2"
                  onClick={deleteAllTestCases}
                >
                  Remove all test cases
                </Button>
              </FormGroup>

              <h4 className="mt-3">Test cases</h4>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Input</th>
                    <th>Output</th>
                    <th>Sample?</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tests.length === 0 ? (
                    <tr>
                      <td>...</td>
                      <td>...</td>
                      <td>...</td>
                      <td>...</td>
                      <td>...</td>
                    </tr>
                  ) : (
                    tests.map((test, index) => {
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{test.input}</td>
                          <td>{test.output}</td>
                          <td>
                            <Form.Check
                              defaultChecked={
                                test.is_eg === "true" ? true : false
                              }
                              onChange={(e) => {
                                fetch(`/api/api-update-sample?id=${test._id}`, {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    is_eg: e.target.checked ? "true" : "false",
                                  }),
                                }).then((res) => {
                                  getAllTests().then((res) => setTests(res));
                                });
                              }}
                            ></Form.Check>
                          </td>
                          <td>
                            <Button
                              variant="warning"
                              onClick={(e) => {
                                deleteTestCase(test._id as string);
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </Tab>
          </Tabs>
          <Button type="submit" className="mt-5 me-1">
            Save
          </Button>
          <Button variant="danger" className="mt-5" onClick={deleteProblem}>
            Delete
          </Button>
        </Container>
      </Form>
    </>
  );
}
