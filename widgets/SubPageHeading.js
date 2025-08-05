// import node module libraries
import { Row, Col } from "react-bootstrap";

const SubPageHeading = (props) => {
  const { heading } = props;
  return (
    <Row>
      <Col lg={12} md={12} xs={12}>
        {/* Page header */}
        <div
          className="border-bottom pb-2 mb-4 "
          style={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          <h5
            className="mb-0 fw-bold"
            style={{ textAlign: "center", marginBottom: "0px" }}
          >
            {heading}
          </h5>
        </div>
      </Col>
    </Row>
  );
};

export default SubPageHeading;
