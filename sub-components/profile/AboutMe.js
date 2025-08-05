// import node module libraries
import { useState } from "react";
import { Col, Row, Card, Modal, Button } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

const AboutMe = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState("https://example.com");

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [showModalmap, setShowModalMap] = useState(false);

  const handleOpenMap = () => setShowModalMap(true);
  const handleCloseMap = () => setShowModalMap(false);

  return (
    <Col xl={12} lg={12} md={12} xs={12} className="mb-6">
      {/* card */}
      <Card>
        {/* card body */}
        <Card.Body>
          {/* card title */}
          <Card.Title as="h4">About Me</Card.Title>
          {/* <span className="text-uppercase fw-medium text-dark fs-5 ls-2">
            Bio
          </span> */}
          {/* <p className="mt-2 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspen
            disse var ius enim in eros elementum tristique. Duis cursus, mi quis
            viverra ornare, eros dolor interdum nulla, ut commodo diam libero
            vitae erat.
          </p> */}
          <Row>
            <Col xs={12} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Address</h6>
              <p className="mb-0">{props.profiledata?.address}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Role</h6>
              <p className="mb-0">{props.profiledata?.roles}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Phone </h6>
              <p className="mb-0">{props.profiledata?.contactNo}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Date of Birth </h6>
              <p className="mb-0">{props.profiledata?.DOB}</p>
            </Col>
            <Col xs={6}>
              <h6 className="text-uppercase fs-5 ls-2">Email </h6>
              <p className="mb-0">{props.profiledata?.email}</p>
            </Col>
            <Col xs={6}>
              <h6 className="text-uppercase fs-5 ls-2">Blood Group</h6>
              <p className="mb-0">{props.profiledata?.BloodGroup}</p>
            </Col>
            <Col xs={6}>
              <h6 className="text-uppercase fs-5 ls-2">Department</h6>
              <p className="mb-0">{props.profiledata?.department}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">sipID</h6>
              <p className="mb-0">{props.profiledata?.sipID}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <h6 className="text-uppercase fs-5 ls-2">Team</h6>
              <p className="mb-0">{props.profiledata?.memCount}</p>
            </Col>
            <Col xs={6} className="mb-5">
              <p>
                <Link
                  className="ms-5"
                  href={"#"}
                  onClick={() => {
                    handleOpen();
                  }}
                >
                  <i className="fe fe-activity"></i> Health Record
                </Link>
              </p>
            </Col>
            <Col xs={6} className="mb-5">
              <p>
                <Link
                  className="ms-5"
                  href={"#"}
                  onClick={() => {
                    handleOpenMap();
                  }}
                >
                  <i className="fe fe-map-pin"></i> View Location
                </Link>
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Health Record</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "500px" }}>
          <iframe
            src={url}
            title="Iframe Example"
            style={{ width: "100%", height: "100%", border: "none" }}
          ></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModalmap} onHide={handleCloseMap} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>View Location</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "500px" }}>
          <iframe
            src="https://www.google.com/maps?q=IIT+(ISM)+Dhanbad&output=embed"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMap}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
  );
};

export default AboutMe;
