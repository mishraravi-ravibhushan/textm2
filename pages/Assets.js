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
import { PageHeading, SubPageHeading } from "widgets";
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

const Assets = (searchParams) => {
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
  const ownership = ["Owned", "Leased", "Contract"];
  const [assetType, setAssetype] = useState([]);
  const [pic, setPic] = useState();
  const intailvalue = {
    assetName: "",
    AssetType: "",
    make: "",
    menufactureYear: "",
    model: "",
    ownership: "",
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
  const [LocalFile, setLocalFile] = useState();
  //const [filteredData, setFilteredData] = useState();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const getStatusColor = (status) => {
    switch (status) {
      case "Operational":
        return "success"; // Green
      case "Parked":
        return "primary"; // Blue
      case "Under Maintenance":
        return "warning"; // Yellow
      case "Decommissioned":
        return "danger"; // Red
      default:
        return "secondary"; // Gray fallback
    }
  };

  const assetData = [
    {
      type: "EXCAVATOR",
      name: "Excavator #1257",
      site: "SITE A",
      zone: "ZONE 1",
      status: "OPERATIONAL",
      color: "green",
      image: "https://i.imgur.com/2yaf2wb.jpg",
    },
    {
      type: "LOADER",
      name: "Loader #12",
      site: "SITE B",
      zone: "ZONE 1",
      status: "UNDER MAINTENANCE",
      color: "orange",
      image: "https://i.imgur.com/7QFD1le.jpg",
    },
    {
      type: "BLASTING",
      name: "Loader #12",
      site: "SITE A",
      zone: "ZONE 2",
      status: "DECOMMISSIONED",
      color: "red",
      image: "https://i.imgur.com/0KfFLGp.jpg",
    },
    {
      type: "VEHICLE",
      name: "INNOVA #1257",
      site: "SITE A",
      zone: "ZONE 1",
      status: "OPERATIONAL",
      color: "green",
      image: "https://i.imgur.com/Z7u3D0s.png",
    },
    {
      type: "CAMERA",
      name: "Hikvision #1254",
      site: "SITE B",
      zone: "ZONE 1",
      status: "UNDER MAINTENANCE",
      color: "orange",
      image: "https://i.imgur.com/fyElQnb.png",
    },
    {
      type: "LOADER",
      name: "Loader #157",
      site: "SITE B",
      zone: "ZONE 1",
      status: "OPERATIONAL",
      color: "green",
      image: "https://i.imgur.com/ECu58El.jpg",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name == "manger") {
      siteList(value);
    }
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(API_BASE_URL + "uploadfile?file", formData);
    let repsonse = res.data;
    setPic(repsonse?.path);
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
        !users || item.AssetName.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredData(result);
  };

  const applyFilter = () => {
    const { name, site, department } = filters;
    const result = users.filter(
      (item) =>
        (!name || item.AssetName.toLowerCase().includes(name.toLowerCase())) &&
        (!site || item.assetType == site) &&
        (!department || item.ownershipStatus == department)
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
      .get(API_BASE_URL + "asset?mode=SELECTASSET") // replace with your actual API
      .then((res) => {
        setUsers(res.data.result), setFilteredData(res.data.result);
        const roleCount = {};
        res.data.result.forEach((user) => {
          const role = user.ownershipStatus || "Unknown";
          roleCount[role] = (roleCount[role] || 0) + 1;
        });
        console.log("role count", roleCount);
        setRolecount(roleCount);
      })
      .catch((err) => console.error("Error fetching users", err));
    getAsset();
  }, [true]);

  const loadUser = async () => {
    let storedUser = localStorage.getItem("authUser");
    var jonsUser = JSON.parse(storedUser);
    axios
      .get(API_BASE_URL + "asset?mode=SELECTASSET") // replace with your actual API
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

  const getAsset = () => {
    axios
      .get(API_BASE_URL + "asset?mode=SELECTASSETTYPE") // replace with your actual API
      .then((res) => setAssetype(res.data.result))
      .catch((err) => console.error("Error fetching users", err));
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

  const getCustomColor = (status) => {
    switch (status) {
      case "Operational":
        return "#28a745"; // Green
      case "Parked":
        return "#007bff"; // Blue
      case "Under Maintenance":
        return "#ffc107"; // Yellow
      case "Decommissioned":
        return "#dc3545"; // Red
      default:
        return "#6c757d"; // Gray
    }
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

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      let data = new FormData();
      if (isEdit) {
        data.append("mode", "UPDATEUSER");
      } else {
        data.append("mode", "INSERTASSET");
      }
      data.append("assetName", e.target.assetName.value);
      data.append("AssetType", e.target.AssetType.value);
      if (pic) {
        data.append("image", pic);
      }
      data.append("make", e.target.make.value);
      data.append("model", e.target?.model.value);
      data.append("menufactureYear", e.target.menufactureYear.value);
      data.append("ownership", e.target?.ownership?.value);
      data.append("status", e.target.status.value);
      const res = await axios.post(API_BASE_URL + "asset", data);
      let repsonse = res.data;
      if (res.status === 200 && repsonse?.result) {
        let presult = repsonse.result[0];
        //setInsertedId(presult.userID || editedUser.userID);
        console.log("repons handlesubmit", repsonse.result);
        setType("success");
        setError(
          isEdit ? "Assets Updated sucessfully" : "Assets added sucessfully"
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
              <h3 className="mb-0 text-white">Assets List</h3>
              {/* {loginUser?.roleName &&
                roleaddbtn.includes(loginUser.roleName.toLowerCase()) && ( */}
              <Button
                className="btn btn-white"
                onClick={() => {
                  setShowModal(true);
                  setForm(intailvalue);
                  setIsEdit(false);
                }}
              >
                Add Assets{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-hammer"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.972 2.508a.5.5 0 0 0-.16-.556l-.178-.129a5 5 0 0 0-2.076-.783C6.215.862 4.504 1.229 2.84 3.133H1.786a.5.5 0 0 0-.354.147L.146 4.567a.5.5 0 0 0 0 .706l2.571 2.579a.5.5 0 0 0 .708 0l1.286-1.29a.5.5 0 0 0 .146-.353V5.57l8.387 8.873A.5.5 0 0 0 14 14.5l1.5-1.5a.5.5 0 0 0 .017-.689l-9.129-8.63c.747-.456 1.772-.839 3.112-.839a.5.5 0 0 0 .472-.334" />
                </svg>
              </Button>
              {/* )} */}
            </div>
          </Col>
        </Row>
        <Row className="mb-5">
          {/* Projects */}
          <Col xl={3} lg={6} md={12} xs={12} className="mb-5">
            <Card className="h-100 card-lift">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Total Record</h4>
                  <div className="icon-shape icon-md bg-primary-soft text-primary rounded-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-hammer"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9.972 2.508a.5.5 0 0 0-.16-.556l-.178-.129a5 5 0 0 0-2.076-.783C6.215.862 4.504 1.229 2.84 3.133H1.786a.5.5 0 0 0-.354.147L.146 4.567a.5.5 0 0 0 0 .706l2.571 2.579a.5.5 0 0 0 .708 0l1.286-1.29a.5.5 0 0 0 .146-.353V5.57l8.387 8.873A.5.5 0 0 0 14 14.5l1.5-1.5a.5.5 0 0 0 .017-.689l-9.129-8.63c.747-.456 1.772-.839 3.112-.839a.5.5 0 0 0 .472-.334" />
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
                  <h4 className="mb-0">Active Asset </h4>
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
                  <h1 className="mb-1 fw-bold">{assetType?.length}</h1>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xl={3} lg={6} md={12} xs={12} className="mb-5">
            <Card className="h-100 card-lift">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Ownership Status</h4>
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
                      {assetType && (
                        <Col md={3} className="widthfilter">
                          <Form.Group controlId="Listsite">
                            <Form.Label>Asset Type</Form.Label>
                            <Form.Select
                              name="site"
                              value={filters.site}
                              onChange={handleChangeFilter}
                            >
                              <option value="">-- Select Asset --</option>
                              {assetType.map((sitearr) => (
                                <option
                                  key={sitearr.id}
                                  value={sitearr.AssetType}
                                >
                                  {sitearr.AssetType}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      )}

                      <Col md={3} className="widthfilter">
                        <Form.Group controlId="departmentList">
                          <Form.Label>Ownership Status</Form.Label>
                          <Form.Select
                            name="department"
                            value={filters.department}
                            onChange={handleChangeFilter}
                            required
                          >
                            <option>Select Ownership</option>
                            {["Owned", "Leased", "Contract"].map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
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
                        onClick={() => sortTable("AssetName")}
                        style={{ cursor: "pointer" }}
                      >
                        Asset Name {getSortIcon("AssetName")}
                      </th>
                      <th
                        onClick={() => sortTable("assetType")}
                        style={{ cursor: "pointer" }}
                      >
                        Asset Type {getSortIcon("assetType")}
                      </th>
                      <th
                        onClick={() => sortTable("make")}
                        style={{ cursor: "pointer" }}
                      >
                        Make {getSortIcon("make")}
                      </th>
                      <th
                        onClick={() => sortTable("menufactureYear")}
                        style={{ cursor: "pointer" }}
                      >
                        Menufacture Year {getSortIcon("menufactureYear")}
                      </th>
                      <th
                        onClick={() => sortTable("ownershipStatus")}
                        style={{ cursor: "pointer" }}
                      >
                        Ownership Status {getSortIcon("ownershipStatus")}
                      </th>

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
                            <div className="align-items-center">
                              <div className="ms-2 lh-1">
                                <h5 className="mb-1">
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
                                {item.image ? (
                                  <Image
                                    src={API_BASE_URL + item.image}
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
                          <td className="align-middle">{item.AssetName}</td>
                          <td className="align-middle">{item.assetType}</td>
                          <td className="align-middle">{item.make}</td>
                          <td className="align-middle">
                            {item.menufactureYear}
                          </td>
                          <td className="align-middle">
                            {item.ownershipStatus}
                          </td>
                          <td>
                            <Link
                              href={{
                                pathname: "/",
                                query: {
                                  id: item.userID,
                                },
                              }}
                            >
                              <i className="fe fe-eye"></i>
                            </Link>
                            {loginUser?.roleName &&
                              roleaddbtn.includes(
                                loginUser?.roleName.toLowerCase()
                              ) && (
                                <Link
                                  className="ms-5"
                                  href={"#"}
                                  onClick={() => {
                                    editUser(item);
                                  }}
                                >
                                  <i className="fe fe-edit"></i>
                                </Link>
                              )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <Row className="px-5">
                  {filteredData.map((asset, index) => (
                    <Col xs={12} sm={4} md={3} key={index} className="mb-4">
                      <Card className="h-100 shadow-sm border-dark backgounddark">
                        <Card.Header className="bg-black text-warning text-center fw-bold">
                          {asset.assetType}
                        </Card.Header>
                        {asset.image && (
                          <div
                            style={{
                              position: "relative",
                              width: "100%",
                              textAlign: "center",
                              alignItems: "center",
                              height: "200px",
                            }}
                          >
                            <Image
                              src={API_BASE_URL + asset.image}
                              width={200}
                              height={200}
                              alt=""
                            />
                          </div>
                        )}
                        <Card.Body className="bg-black text-white">
                          <Card.Title className="text-danger">
                            {asset.AssetName}
                          </Card.Title>
                          <Card.Text className="mb-1">
                            {asset.menufactureYear}
                          </Card.Text>
                          <Card.Text className="mb-2">{asset.make}</Card.Text>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className={`status-dot`}
                              style={{
                                backgroundColor: getCustomColor(asset.status),
                              }}
                            ></span>
                            <span
                              className={`text-${
                                asset.color === "green"
                                  ? "success"
                                  : asset.color === "orange"
                                  ? "warning"
                                  : "danger"
                              }`}
                            >
                              {asset.status}
                            </span>
                          </div>
                        </Card.Body>
                      </Card>
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
                  <Modal.Title>{isEdit ? "Update" : "Add"} Assets </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row className="mb-5">
                    <Col md={6}>
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Select Image</Form.Label>
                        <Form.Control
                          required
                          accept=".jpg,.png,"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Label>Model</Form.Label>
                      <input
                        type="text"
                        className="form-control"
                        name="model"
                        placeholder="Model"
                        id="Model"
                        value={form.model}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-5">
                    <Col md={6}>
                      <Form.Label>Asset Name</Form.Label>
                      <input
                        type="text"
                        className="form-control"
                        name="assetName"
                        placeholder="Asset name"
                        id="assetName"
                        value={form.assetName}
                        onChange={handleChange}
                        pattern="\s*(\S\s*){3,}"
                        title="First Name should have at least 3 characters."
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label>Make</Form.Label>
                      <input
                        type="text"
                        className="form-control"
                        name="make"
                        placeholder="make"
                        pattern="\s*(\S\s*){3,}"
                        title="Make should have at least 3 characters."
                        id="make"
                        value={form.make}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Label>Menufacture Year</Form.Label>
                      <input
                        type="number"
                        className="form-control"
                        minLength={4}
                        maxLength={4}
                        min="1900"
                        max="2025"
                        name="menufactureYear"
                        placeholder="Menufacture Year"
                        id="menufactureYear"
                        value={form.menufactureYear}
                        onChange={handleChange}
                      />
                    </Col>
                    {assetType && (
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="AssetType">
                          <Form.Label>Asset Type</Form.Label>
                          <Form.Select
                            name="AssetType"
                            id="AssetType"
                            required
                            value={departmentId}
                            onChange={getSubdirection}
                          >
                            <option value={""}>Select Asset</option>
                            {assetType.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.AssetType}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    )}
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group
                        className="mb-3"
                        controlId="ownership"
                        name="ownershipg"
                      >
                        <Form.Label>Ownership</Form.Label>
                        <Form.Select
                          name="ownership"
                          controlId="ownership"
                          value={form.ownership}
                          onChange={handleChange}
                        >
                          <option value={""}>Select Ownership</option>
                          {["Owned", "Leased", "Contract"].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group
                        className="mb-3"
                        controlId="statusg"
                        name="statusg"
                      >
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          name="status"
                          controlId="status"
                          value={form.status}
                          onChange={handleChange}
                        >
                          <option value={""}>Select Status</option>
                          {[
                            "Parked",
                            "Operational",
                            "Under Maintenance",
                            "Decommissioned",
                          ].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
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

export default Assets;
