import React, { useEffect, useState } from "react";
import {
  ProgressBar,
  Col,
  Row,
  Card,
  Table,
  Button,
  ButtonGroup,
  Form,
  Badge,
  Modal,
  Container,
  Dropdown,
} from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

import axios from "axios";
// import widget as custom components
import { API_BASE_URL } from "../constants/apiPath";
import FlashError from "../components/FlashError";
import avatar1 from "/public/images/avatar/avatar-1.jpg"; // Ensure it's in /public
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  Monitor,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
} from "react-feather";

const Communication = (searchParams) => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = useState();
  const [department, setDepartment] = useState();
  const [site, setSite] = useState([]);
  const [managerlist, setManagerList] = useState([]);
  const [depratmentText, setDepartmentText] = useState();
  const [departmentId, setDepartmentId] = useState();
  const [insertedId, setInsertedId] = useState();
  const [editedUser, setEditedUSer] = useState();
  const roleaddbtn = ["hr", "hr appointment", "manager", "chief manager"];
  const intailvalue = {
    firstname: "",
    lastname: "",
    dob: "",
    email: "",
    sipID: "",
    department: "",
    bloodGroup: "",
    manager: "",
    address: "",
    designation: "",
    contactNo: "",
  };
  const [form, setForm] = useState(intailvalue);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [subDepartments, setSubDepartments] = useState([]);
  const [role, setRole] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [listofSote, setListofsite] = useState();
  const [roleid, setRoleid] = useState();
  const [listofDepartment, setListofDepartment] = useState();
  const [error, setError] = useState("");
  const [type, setType] = useState("error");
  const [isEdit, setIsEdit] = useState(false);
  const [tableview, setTableView] = useState("list");
  const [roleCount, setRolecount] = useState();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  //const [filteredData, setFilteredData] = useState();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name == "manger") {
      siteList(value);
    }
  };
  const [selected, setSelected] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    site: "",
    department: "",
  });
  const handleChangeFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    console.log("name", name);
    console.log("value", value);
    if (name == "name") {
      applyFiltername(value);
    }
  };
  const [filteredData, setFilteredData] = useState([]);

  const applyFiltername = (val) => {
    const result = users.filter(
      (item) =>
        !users || item.userFname.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredData(result);
  };

  const applyFilter = () => {
    const { name, site, department } = filters;
    const result = users.filter(
      (item) =>
        (!name || item.userFname.toLowerCase().includes(name.toLowerCase())) &&
        (!site || item.v_siteID == site) &&
        (!department || item.departmentID == department)
    );
    setFilteredData(result);
  };

  const clearFilter = () => {
    setFilters({ name: "", site: "", department: "" });
    setFilteredData(users);
  };
  const sortTable = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...filteredData].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      } else {
        return direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      }
    });
    setFilteredData(sortedData);
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ChevronUp size={14} className="ms-2 text-muted" />;
    if (sortConfig.direction === "asc")
      return <ArrowUp size={14} className="ms-2" />;
    return <ArrowDown size={14} className="ms-2" />;
  };

  const editUser = (value) => {
    setIsEdit(true);
    setShowModal(true);
    setEditedUSer(value);
    let firllvalue = {
      firstname: value.userFname || "",
      lastname: value.userLName || "",
      dob: value.DOB || "",
      email: value.email || "",
      department: value.department || "",
      address: value.address || "",
      bloodGroup: value.BloodGroup || "",
      //designation: "",
      contactNo: value.contactNo || "",
    };

    setDepartmentId(value.departmentID);
    setDepartmentText(value.department);
    console.log("line no 129", firllvalue);
    setForm(firllvalue);
    loadRole(value.departmentID, value.department);
    if (value.sites) {
      let stiearry = value.sites?.split(",");
      console.log("stiearry", stiearry);
      let matchedIds = site
        .filter((sitelItem) => stiearry.includes(sitelItem.siteName))
        .map((sitelItem) => sitelItem.id);
      setSelected(matchedIds);
    }
    setRoleid(value.roleID);
  };
  const handleCheckboxChange = (id) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };
  const handleSwitchChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    console.log("Switch toggled:", checked);
  };
  useEffect(() => {
    const today = new Date();
    const mindCdate = new Date();
    mindCdate.setFullYear(today.getFullYear() - 100);

    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    const min = formatDate(mindCdate);
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() - 16);
    const max = formatDate(nextYear);

    setMinDate(min);
    setMaxDate(max);
    let storedUser = localStorage.getItem("authUser");
    const jonsUser = JSON.parse(storedUser);
    setLoginUser(jonsUser);
    axios
      .get(API_BASE_URL + "user?mode=SELECTUSERS&userID=" + jonsUser.userID) // replace with your actual API
      .then((res) => {
        setUsers(res.data.result), setFilteredData(res.data.result);
        const roleCount = {};
        res.data.result.forEach((user) => {
          const role = user.roles || "Unknown";
          roleCount[role] = (roleCount[role] || 0) + 1;
        });
        setRolecount(roleCount);
      })
      .catch((err) => console.error("Error fetching users", err));
    axios
      .get(API_BASE_URL + "user?mode=SELECTDEPARTMENT") // replace with your actual API
      .then((res) => {
        setDepartment(res.data.result), setListofDepartment(res.data.result);
      })
      .catch((err) => console.error("Error fetching users", err));
    axios
      .get(API_BASE_URL + "sitemap?mode=SELECTSITES") // replace with your actual API
      .then((res) => {
        setSite(res.data.result), setListofsite(res.data.result);
      })
      .catch((err) => console.error("Error fetching users", err));
    getManager();
  }, [roleid, depratmentText]);

  const loadUser = async () => {
    let storedUser = localStorage.getItem("authUser");
    var jonsUser = JSON.parse(storedUser);
    axios
      .get(API_BASE_URL + "user?mode=SELECTUSERS&userID=" + jonsUser.userID) // replace with your actual API
      .then((res) => {
        setUsers(res.data.result), setFilteredData(res.data.result);
      })
      .catch((err) => console.error("Error fetching users", err));
  };

  const siteList = async (selectedManagerID) => {
    //String url = "http://" + FunctionList.IP_ADDRESS + ":3001/mining/sitemap?mode=SHOWSITE&userID="+selectedManagerID; // Replace with actual URL
    if (roleid && depratmentText) {
      console.log("siteList line no 115");
      axios
        .get(API_BASE_URL + "sitemap?mode=SHOWSITE&userID=" + selectedManagerID) // replace with your actual API
        .then((res) => setSite(res.data.result))
        .catch((err) => console.error("Error fetching users", err));
    }
  };

  const getSubdirection = async (e) => {
    let selectedDepartmentID = e.target.value;
    let text = e.target.options[e.target.selectedIndex].text;
    setDepartmentId(e.target.value);
    setDepartmentText(text);
    axios
      .get(
        API_BASE_URL + "user?mode=SELECTROLE&department=" + selectedDepartmentID
      ) // replace with your actual API
      .then((res) => setRole(res.data.result))
      .catch((err) => console.error("Error fetching users", err));
  };

  const loadRole = (selectedDepartmentID, departmentTest) => {
    axios
      .get(
        API_BASE_URL + "user?mode=SELECTROLE&department=" + selectedDepartmentID
      ) // replace with your actual API
      .then((res) => setRole(res.data.result))
      .catch((err) => console.error("Error fetching users", err));
  };

  const addTeammanger = async (val) => {
    try {
      let storedUser = localStorage.getItem("authUser");
      var jonsUser = JSON.parse(storedUser);
      let data = new FormData();
      const { manager } = form;
      if (!manager) {
        return true;
      }
      data.append("mode", "INSERTTEAM");
      data.append("teamleaderID", manager);
      data.append("teammemberID", val);
      data.append("assignedBy", jonsUser.userID);
      const res = await axios.post(API_BASE_URL + "teammgmt", data);
      let repsonse = res.data;
      console.log("line line 217", repsonse);
      if (res.status === 200 && repsonse?.result) {
        setType("success");
        setError("User added sucessfully");
        setShowModal(false);
      } else {
        setType("error");
        setError("Please check details, duplicate values are not allowed.");
      }
    } catch (e) {
      setType("error");
      setError("Please check details, duplicate values are not allowed.");
    }
  };

  const addSaddSites = async (userid) => {
    try {
      let storedUser = localStorage.getItem("authUser");
      var jonsUser = JSON.parse(storedUser);
      let data = new FormData();
      if (selected) {
        data.append("mode", "INSERTSITEMAP");
        data.append("siteID", selected.join(", "));
        data.append("userID", userid);
        data.append("assignedBy", jonsUser.userID);
        const res = await axios.post(API_BASE_URL + "sitemap", data);
        let repsonse = res.data;
        if (res.status === 200 && repsonse?.result) {
          setType("success");
          setError("User added sucessfully");
          setShowModal(false);
        } else {
          setType("error");
          setError("Please check details, duplicate values are not allowed.");
        }
      }
    } catch (e) {
      setType("error");
      setError("Please check details, duplicate values are not allowed.");
    }
  };

  const getManager = async (roleId, departMent) => {
    try {
      const response = await axios.get(API_BASE_URL + "user", {
        params: {
          mode: "SELECTMANAGER",
          roleID: roleid,
          department: depratmentText,
        },
      });
      console.log("manager list", response.data.result);
      setManagerList(response.data.result); // Adjust based on actual response structure
    } catch (err) {
      console.error("Error fetching managers:", err);
    }
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      let data = new FormData();
      if (isEdit) {
        data.append("mode", "UPDATEUSER");
        data.append("sipID", editedUser.sipID);
        data.append("contactNo", editedUser.contactNo);
        data.append("userID", editedUser.userID);
      } else {
        data.append("mode", "INSERTUSER");
        data.append("sipID", e.target.contactNo.value);
        data.append("contactNo", e.target.contactNo.value);
        data.append("password", e.target.contactNo.value);
      }
      data.append("firstname", e.target.firstname.value);
      data.append("lastname", e.target.lastName.value);
      data.append("address", e.target.address.value);
      data.append("bloodGroup", e.target.bloodGroup.value);
      data.append("roleID", e.target?.role?.value);
      data.append("dob", e.target.dob.value);
      data.append("department", depratmentText);

      const res = await axios.post(API_BASE_URL + "user", data);
      let repsonse = res.data;
      if (res.status === 200 && repsonse?.result) {
        let presult = repsonse.result[0];
        setInsertedId(presult.userID || editedUser.userID);
        console.log("repons handlesubmit", repsonse.result);
        if (roleid !== "1") {
          addTeammanger(presult.userID || editedUser.userID);
          addSaddSites(presult.userID || editedUser.userID);
        }
        setType("success");
        setError(
          isEdit ? "User Updated sucessfully" : "User added sucessfully"
        );

        setTimeout(function () {
          loadUser();
          setShowModal(false);
        }, 500);
      } else {
        setType("error");
        setError("Record are duplicate.");
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  return (
    <div>
      <div class="bg-primary pt-10 pb-21 mt-n6 mx-n4"></div>
      <Container fluid className="container-fluid mt-n22">
        <Row className="mb-4">
          <Col lg={12} md={12} xs={12}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="mb-0 text-white">Communication</h3>
            </div>
          </Col>
        </Row>
        <Row className="mb-5">
          {/* Projects */}
          <Col xl={3} lg={6} md={12} xs={12} className="mb-5">
            <Card className="h-100 card-lift">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Users</h4>
                  <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-users"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                </div>
                <div className="lh-1">
                  <h1 className="mb-1 fw-bold">{users?.length}</h1>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={3} lg={6} md={12} xs={12} className="mb-5">
            <Card className="h-100 card-lift">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Active Department</h4>
                  <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-list"
                    >
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  </div>
                </div>
                <div className="lh-1">
                  <h1 className="mb-1 fw-bold">{department?.length}</h1>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={3} lg={6} md={12} xs={12} className="mb-5">
            <Card className="h-100 card-lift">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Sites List</h4>
                  <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-map"
                    >
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                      <line x1="8" y1="2" x2="8" y2="18" />
                      <line x1="16" y1="6" x2="16" y2="22" />
                    </svg>
                  </div>
                </div>
                <div className="lh-1">
                  <h1 className="mb-1 fw-bold">{listofSote?.length}</h1>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={3} lg={6} md={12} xs={12} className="mb-5">
            <Card className="h-100 card-lift">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h4 className="mb-0">Active Role</h4>
                  <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-target"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  </div>
                </div>
                <div
                  className="lh-1 custom-scroll border p-2"
                  style={{
                    height: "80px", // Set fixed height
                    overflowY: "auto", // Enable vertical scroll
                    border: "1px solid #ccc", // Optional styling
                    padding: "5px",
                  }}
                >
                  {roleCount &&
                    Object.entries(roleCount).map(([role, count]) => (
                      <p
                        className="mb-0 border-secondary	border-bottom p-2"
                        key={role}
                      >
                        <span className="text-success me-2">{role}</span>{" "}
                        {count}
                      </p>
                    ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-6">
          <Col md={12} xs={12}>
            <Card>
              <Card.Header className="bg-white  py-4 px-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form style={{ width: "100%" }}>
                    <Row className="mb-3">
                      <Col md={3} className="widthfilter">
                        <Form.Group controlId="name">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={filters.name}
                            onChange={handleChangeFilter}
                            placeholder="Enter name"
                          />
                        </Form.Group>
                      </Col>
                      {listofSote && (
                        <Col md={3} className="widthfilter">
                          <Form.Group controlId="Listsite">
                            <Form.Label>Site</Form.Label>
                            <Form.Select
                              name="site"
                              value={filters.site}
                              onChange={handleChangeFilter}
                            >
                              <option value="">-- Select Site --</option>
                              {listofSote.map((sitearr) => (
                                <option
                                  key={sitearr.id}
                                  value={sitearr.siteName}
                                >
                                  {sitearr.siteName}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      )}
                      {department && (
                        <Col md={3} className="widthfilter">
                          <Form.Group controlId="departmentList">
                            <Form.Label>Department</Form.Label>
                            <Form.Select
                              name="department"
                              value={filters.department}
                              onChange={handleChangeFilter}
                              required
                            >
                              <option>Select Department</option>
                              {department.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.DepartmentName}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      )}
                      <Col md={2} className="pt-6 widthfilter18">
                        <Button variant="primary" onClick={applyFilter}>
                          Apply Filter
                        </Button>{" "}
                        <Button variant="secondary" onClick={clearFilter}>
                          Clear Filter
                        </Button>
                      </Col>

                      <Col md={2} className="pt-6 widthfilter13">
                        <Button
                          variant={
                            tableview === "grid" ? "primary" : "outline-primary"
                          }
                          onClick={() => setTableView("grid")}
                        >
                          <i className="fe fe-grid"></i>
                        </Button>
                        <Button
                          className="mx-2"
                          variant={
                            tableview === "list" ? "primary" : "outline-primary"
                          }
                          onClick={() => setTableView("list")}
                        >
                          <i className="fe fe-list"></i>
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </Card.Header>
              {tableview == "list" ? (
                <Table responsive bordered hover className="text-nowrap mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Sr.no</th>
                      <th>Image</th>
                      <th
                        onClick={() => sortTable("userLName")}
                        style={{ cursor: "pointer" }}
                      >
                        Name {getSortIcon("userLName")}
                      </th>
                      <th
                        onClick={() => sortTable("department")}
                        style={{ cursor: "pointer" }}
                      >
                        Department {getSortIcon("department")}
                      </th>
                      <th
                        onClick={() => sortTable("roles")}
                        style={{ cursor: "pointer" }}
                      >
                        Role {getSortIcon("roles")}
                      </th>
                      <th
                        onClick={() => sortTable("contactNo")}
                        style={{ cursor: "pointer" }}
                      >
                        Contact No. {getSortIcon("contactNo")}
                      </th>
                      {/* <th>Sites</th> */}
                      <th></th>
                      {/* <th>Team Count</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? "#f1f5f9" : "#ffffff",
                          }}
                        >
                          <td className="align-middle">
                            <div className="d-flex align-items-center">
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
                            <div className="d-flex align-items-center">
                              <div
                                className={`icon-shape icon-md border p-4 rounded-1 ${item.id}`}
                              >
                                {item.pic ? (
                                  <Image
                                    src={API_BASE_URL + item.pic}
                                    alt=""
                                    width={40}
                                    height={40}
                                    className="rounded-circle"
                                  />
                                ) : (
                                  <Image
                                    src={avatar1}
                                    alt=""
                                    width={40}
                                    height={40}
                                    className="rounded-circle"
                                  />
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="align-middle">
                            {item.userFname + " " + (item.userLName || "")}
                          </td>
                          <td className="align-middle">{item.department}</td>
                          <td className="align-middle">{item.roles}</td>
                          <td className="align-middle">{item.contactNo}</td>
                          {/* <td className="align-middle">{item.sites}</td> */}
                          {/* <td className="align-middle">
                        {item.memCount > 0 ? (
                          <Link
                            href={{
                              pathname: "/users/teams",
                              query: {
                                id: item.id,
                              },
                            }}
                          >
                            View ({item.memCount})
                          </Link>
                        ) : (
                          0
                        )}
                      </td> */}
                          <td>
                            <Link
                              href="#"
                              className="btn btn-outline-primary"
                              style={{
                                background: "#fbb11d",
                                color: "#090b0c",
                              }}
                            >
                              <i className="fe fe-headphones"></i>
                            </Link>{" "}
                            <Link
                              href="#"
                              className="btn btn-outline-primary"
                              style={{
                                background: "#090b0c",
                                color: "#fff",
                              }}
                            >
                              <i className="fe fe-video"></i>
                            </Link>{" "}
                            <Link
                              href="#"
                              className="btn btn-outline-primary"
                              style={{
                                background: "#fbb11d",
                                color: "#090b0c",
                              }}
                            >
                              <i className="fe fe-message-square"></i>
                            </Link>{" "}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <Row>
                  {filteredData?.length > 0 &&
                    filteredData.map((item, index) => (
                      <Col lg={3} sm={6} className="my-3" key={index}>
                        <div className="hover-top-in text-center">
                          <div
                            className="overflow-hidden z-index-9 position-relative px-5"
                            style={{ zIndex: 99 }}
                          >
                            {item.pic ? (
                              <Image
                                src={API_BASE_URL + item.pic}
                                alt=""
                                width={100}
                                height={100}
                                className="rounded-circle"
                              />
                            ) : (
                              <Image
                                src={avatar1}
                                alt=""
                                width={100}
                                height={100}
                                className="rounded-circle"
                              />
                            )}
                          </div>
                          <Col
                            style={{ minHeight: "200px" }}
                            className="mx-2 mx-xl-3 shadow rounded-3 position-relative mt-n4 bg-white p-4 pt-6 mx-4 text-center"
                          >
                            <h5 className="mb-1">{item.UserName}</h5>
                            <p className="mb-1 text-muted">
                              <User size={16} className="me-1" />
                              {item.roles || "—"} | {item.department}
                            </p>
                            <p className="mb-1">
                              <Phone size={16} className="me-1" />
                              {item.contactNo}
                            </p>
                            {/* <p className="mb-1">
                              <Calendar size={16} className="me-1" />
                              DOB: {item.DOB}
                            </p> */}
                            {/* <p className="mb-1">
                              <Droplet size={16} className="me-1" />
                              Blood Group:{" "}
                              <Badge bg="danger">{item.BloodGroup}</Badge>
                            </p>
                            {item.address && (
                              <p className="mb-0">
                                <MapPin size={16} className="me-1" />
                                {item.address}
                              </p>
                            )}
                            <p className="mb-1">
                              <Monitor size={16} className="me-1" />
                              Site : {item.sites}
                            </p> */}
                            <ButtonGroup>
                              <Link
                                href="#"
                                className="btn btn-outline-primary"
                                style={{
                                  background: "#fbb11d",
                                  color: "#090b0c",
                                }}
                              >
                                <i className="fe fe-headphones"></i>
                              </Link>{" "}
                              <Link
                                href="#"
                                className="btn btn-outline-primary"
                                style={{
                                  background: "#090b0c",
                                  color: "#fff",
                                }}
                              >
                                <i className="fe fe-video"></i>
                              </Link>{" "}
                              <Link
                                href="#"
                                className="btn btn-outline-primary"
                                style={{
                                  background: "#fbb11d",
                                  color: "#090b0c",
                                }}
                              >
                                <i className="fe fe-message-square"></i>
                              </Link>
                            </ButtonGroup>
                          </Col>
                        </div>
                      </Col>
                    ))}
                </Row>
              )}
            </Card>
            <Modal show={showModal} onHide={handleClose} size="xl">
              <FlashError
                message={error}
                type={type}
                onClose={() => setError("")}
                duration={4000} // optional
              />
              <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                  <Modal.Title>{isEdit ? "Update" : "Add"} User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row className="mb-5">
                    <Col md={6}>
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
                    </Col>
                    <Col md={6}>
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
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Label>Email</Form.Label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="E-mail"
                        id="email"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </Col>
                    {/* contact */}
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Contact Number</Form.Label>
                        {isEdit ? (
                          <Form.Control
                            type="text"
                            name="contactNo"
                            id="contactNo"
                            placeholder="Contact Number"
                            readOnly
                            pattern="[1-9]{1}[0-9]{9}"
                            title="Invalid Contact Number"
                            value={form.contactNo}
                          />
                        ) : (
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
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Address"
                      style={{ height: "100px" }}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group
                        className="mb-3"
                        controlId="bloodgroup"
                        name="bloodgroup"
                      >
                        <Form.Label>Blood Group</Form.Label>
                        <Form.Select
                          name="bloodGroup"
                          controlId="bloodGroup"
                          value={form.bloodGroup}
                          onChange={handleChange}
                        >
                          <option value={""}>Select Blood Group</option>
                          {[
                            "A+",
                            "A-",
                            "B+",
                            "B-",
                            "AB+",
                            "AB-",
                            "O+",
                            "O-",
                          ].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Label>Date of Birth</Form.Label>
                      <input
                        type="Date"
                        className="form-control"
                        name="dob"
                        placeholder="Date of Birth"
                        value={form.dob}
                        min={minDate}
                        max={maxDate}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                  {department && (
                    <Form.Group className="mb-3" controlId="department">
                      <Form.Label>Department</Form.Label>
                      <Form.Select
                        name="department"
                        id="department"
                        required
                        value={departmentId}
                        onChange={getSubdirection}
                      >
                        <option value={""}>Select Department</option>
                        {department.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.DepartmentName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  )}
                  {role && (
                    <Form.Group className="mb-3" controlId="role">
                      <Form.Label>Role</Form.Label>
                      <Form.Select
                        name="role"
                        required
                        value={roleid}
                        onChange={(e) => setRoleid(e.target.value)}
                      >
                        <option>Select role</option>
                        {role.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.roles}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  )}
                  {roleid !== "1" && (
                    <fieldset style={{ padding: "10px", border: "1px groove" }}>
                      <legend style={{ textAlign: "center", fontSize: "18px" }}>
                        Do you want to assign manager ?
                      </legend>
                      <Form.Group controlId="assignmanger">
                        <Form.Check
                          type="switch"
                          id="assingmanager"
                          checked={isChecked}
                          onChange={handleSwitchChange}
                          label="Check For Yes"
                        />
                      </Form.Group>
                      {isChecked && (
                        <Form.Group className="mb-3 pt-2" controlId="manager">
                          <Form.Label>Select Manager</Form.Label>
                          <Form.Select
                            name="manager"
                            required={isChecked}
                            onChange={handleChange}
                          >
                            <option value={""}>Select Manager</option>
                            {managerlist.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.UserName}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      )}
                    </fieldset>
                  )}
                  {site && roleid !== "1" && (
                    <Form.Group className="mb-3" controlId="site" name="site">
                      <Form.Label>Site</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="secondary"
                          id="dropdown-checkbox"
                        >
                          {selected.length > 0
                            ? `${selected.length} selected`
                            : "Select site"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu
                          style={{ maxHeight: "300px", overflowY: "auto" }}
                        >
                          {site.map((option) => (
                            <Form.Check
                              key={option.id}
                              type="checkbox"
                              id={`subdept-${option.id}`}
                              label={option.siteName}
                              checked={
                                selected.includes(option.id) ||
                                selected.includes(option.siteName)
                              }
                              onChange={() => handleCheckboxChange(option.id)}
                              style={{ padding: "5px 1px 0px 38px" }}
                            />
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  {loading == false ? (
                    <Button variant="primary" type="submit">
                      {isEdit ? "Update" : "Add"}
                    </Button>
                  ) : (
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                </Modal.Footer>
              </Form>
            </Modal>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Communication;
