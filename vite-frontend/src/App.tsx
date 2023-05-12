import "bootstrap/dist/css/bootstrap.min.css";

import { Link, Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import ProblemsPage from "./components/ProblemsPage";
import ProblemDetail from "./components/ProblemDetail";

import Submissions from "./components/Submissions";
import SubmissionDetail from "./components/SubmissionDetail";

import Users from "./components/Users";
import UserDetail from "./components/UserDetail";

import ProblemEdit from "./components/ProblemEdit";
import ProblemSubmit from "./components/ProblemSubmit";

import Contests from "./components/Contests";
import ContestDetail from "./components/ContestDetail";
import ContestEdit from "./components/ContestEdit";

import Register from "./components/Register";

import Login from "./components/Login";

function App() {
  function UserThumbnail() {
    if (!localStorage.getItem("username")) {
      return (
        <Nav>
          <Nav.Link as={Link} to="/login">
            Login
          </Nav.Link>
          <Nav.Link as={Link} to="/register">
            Register
          </Nav.Link>
        </Nav>
      );
    }

    var username = localStorage.getItem("username");

    return (
      <NavDropdown title={username}>
        <NavDropdown.Item href="#">Profile</NavDropdown.Item>
        <NavDropdown.Item href="#">Submissions</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Logout
        </NavDropdown.Item>
      </NavDropdown>
    );
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Nav.Link as={Link} to="/problems">
            <Navbar.Brand>RandomOJ</Navbar.Brand>
          </Nav.Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/problems">
                Problems
              </Nav.Link>
              <Nav.Link as={Link} to="/users">
                Users
              </Nav.Link>
              <Nav.Link as={Link} to="/submissions">
                Submissions
              </Nav.Link>
              <Nav.Link as={Link} to="/contests">
                Contests
              </Nav.Link>
            </Nav>
            <Nav>
              <UserThumbnail />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<ProblemsPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/problems">
          <Route path="" element={<ProblemsPage />} />
          <Route path="my" element={<ProblemsPage isMyProblems />} />

          <Route path="detail/:id" element={<ProblemDetail />} />
          <Route path="edit/:id" element={<ProblemEdit />} />
          <Route path="submit/:id" element={<ProblemSubmit />} />
        </Route>

        <Route path="/submissions">
          <Route path="" element={<Submissions />} />
          <Route path="detail/:id" element={<SubmissionDetail />} />
        </Route>

        <Route path="/users">
          <Route path="" element={<Users />} />
          <Route path="detail/:id" element={<UserDetail />} />
        </Route>

        <Route path="/contests">
          <Route path="" element={<Contests />} />
          <Route path="my" element={<Contests isMyContests />} />
          <Route path="detail/:id">
            <Route path="" element={<ContestDetail />} />
            <Route path="?tab=info" element={<ContestDetail />} />
            <Route path="?tab=problems" element={<ContestDetail />} />
            <Route path="?tab=ranking" element={<ContestDetail />} />
          </Route>
          <Route path="edit/:id" element={<ContestEdit />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
