import React, { useEffect, useState } from "react";
import {
  ProgressBar,
  Col,
  Row,
  Card,
  Table,
  Image,
  Button,
  Form,
  Modal,
  Container,
} from "react-bootstrap";
import Link from "next/link";
import axios from "axios";
// import widget as custom components
import { PageHeading } from "widgets";
import { API_BASE_URL } from "../../constants/apiPath";
import { useSearchParams } from "next/navigation";

import FlashError from "../../components/FlashError";

// import sub components
import { BillingAddress, CurrentPlan } from "sub-components";

const Teams = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = useState();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    sipID: "",
    password: "",
    department: "",
    designation: "",
    contactNo: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    let storedUser = localStorage.getItem("authUser");
    const jonsUser = JSON.parse(storedUser);
    setLoginUser(jonsUser);
    console.log(jonsUser);
    const pid = searchParams.get("id") || jonsUser.userID;

    const url = `${API_BASE_URL}teammgmt?mode=SHOWTEAM&pid=${pid}`;
    console.log("url", url);
    axios
      .get(url) // replace with your actual API
      .then((res) => setUsers(res.data.result))
      .catch((err) => console.error("Error fetching users", err));
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <Container fluid className="p-6">
      {/* Page Heading */}
      <PageHeading heading="User list" />

      <Row className="mt-6">
        <Col md={12} xs={12}>
          <Card>
            <Card.Header className="bg-white  py-4">
              <h4 className="mb-0" style={{ float: "left" }}>
                Team List
              </h4>
              <Button
                variant="primary"
                type="button"
                onClick={() => setShowModal(true)}
                style={{ float: "right" }}
              >
                Add User <i className="fe fe-user-plus"></i>
              </Button>
            </Card.Header>
            <Table responsive className="text-nowrap mb-0">
              <thead className="table-light">
                <tr>
                  <th>Sr.no</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Contact No.</th>
                  <th>Email</th>
                  <th>Team Count</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          {/* <div>
                            <div
                              className={`icon-shape icon-md border p-4 rounded-1 ${item.id}`}
                            >
                              <Image src={item.brandLogo} alt="" />
                            </div>
                          </div> */}
                          <div className="ms-3 lh-1">
                            <h5 className=" mb-1">
                              <Link href="#" className="text-inherit">
                                {index + 1}
                              </Link>
                            </h5>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        {item.userFname + " " + item.userLName}
                      </td>
                      <td className="align-middle">{item.department}</td>
                      <td className="align-middle">{item.roles}</td>
                      <td className="align-middle">{item.contactNo}</td>
                      <td className="align-middle">{item.email}</td>
                      <td className="align-middle">{item.memCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </Col>
        <Modal show={showModal} onHide={handleClose}>
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title> Add User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <Form.Label>First Name</Form.Label>
                <input
                  type="text"
                  className="form-control"
                  name="firstname"
                  placeholder="First name"
                  id="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  pattern="\s*(\S\s*){3,}"
                  title="First Name should have at least 3 characters."
                  required
                />
              </div>
              <div className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <input
                  type="text"
                  className="form-control"
                  name="lastname"
                  placeholder="Last name"
                  pattern="\s*(\S\s*){3,}"
                  title="Last Name should have at least 3 characters."
                  id="lastName"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <Form.Label>Email</Form.Label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="E-mail"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* contact */}
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  name="contactNo"
                  id="contactNo"
                  placeholder="Contact Number"
                  required
                  pattern="[1-9]{1}[0-9]{9}"
                  title="Invalid Contact Number"
                  value={form.contactNo}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  id="password"
                  placeholder="**************"
                  required
                  minlength="6"
                  value={form.password}
                  onChange={handleChange}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              {loading == false ? (
                <Button variant="primary" type="submit">
                  Add
                </Button>
              ) : (
                <div className="spinner-border text-success" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </Modal.Footer>
          </Form>
        </Modal>
        {/* {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "8px",
                width: "400px",
                position: "relative",
              }}
            >
              <h2>Add User</h2>
              <form onSubmit={handleSubmit}>
                <input
                  name="firstname"
                  placeholder="First Name"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                />
                <br />
                <br />
                <input
                  name="lastname"
                  placeholder="Last Name"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                />
                <br />
                <br />
                <input
                  name="sipID"
                  placeholder="SIP ID"
                  value={form.sipID}
                  onChange={handleChange}
                  required
                />
                <br />
                <br />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <br />
                <br />
                <input
                  name="department"
                  placeholder="Department"
                  value={form.department}
                  onChange={handleChange}
                  required
                />
                <br />
                <br />
                <input
                  name="designation"
                  placeholder="Designation"
                  value={form.designation}
                  onChange={handleChange}
                  required
                />
                <br />
                <br />
                <input
                  name="contactNo"
                  placeholder="Contact Number"
                  value={form.contactNo}
                  onChange={handleChange}
                  required
                />
                <br />
                <br />

                <Button type="submit">Save</Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => setShowModal(false)}
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </Button>
              </form>
            </div>
          </div>
        )} */}
      </Row>
    </Container>
  );
};

export default Teams;
