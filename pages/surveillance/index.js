// import node module libraries
import React, { useEffect, useState } from "react";
import { Col, Row, Card, Container, Form, Button } from "react-bootstrap";
// import widget as custom components
import { PageHeading, SubPageHeading } from "widgets";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL } from "constants/apiPath";
import HLSPlayer from "components/HLSPlayer";
//import video from "../../public/images/cam1.mp4";
// import sub components
import axios from "axios";
const Home = () => {
  const [users, setUsers] = useState();
  const [site, setSite] = useState([]);
  const [isviblestart, setIsvisibleStart] = useState(true);
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");
  useEffect(() => {
    let storedUser = localStorage.getItem("authUser");
    const jonsUser = JSON.parse(storedUser);
    const pid = searchParams.get("id") || jonsUser.userID;
    const url = `${API_BASE_URL}user?mode=SELECTUSER&userID=${pid}`;
    console.log("url", url);
    axios
      .get(API_BASE_URL + "sitemap?mode=SELECTSITES") // replace with your actual API
      .then((res) => setSite(res.data.result))
      .catch((err) => console.error("Error fetching users", err));
  }, []);

  const handleStartStream = () => {
    const encoded = encodeURIComponent(document.getElementById("rtsp").value);
    setUrl(`http://localhost:8888/${encoded}/index.m3u8`);
  };
  return (
    <Container fluid className="p-6">
      {/* Page Heading */}
      <PageHeading heading="Surveillance" />
      <div className="row servilance">
        <Col xl={8} lg={12} md={12} xs={12} className="mb-6">
          {/* card */}
          <Card>
            {/* card body */}
            <Card.Body>
              <Row>
                <Col xs={12} sm={6} className="mb-5">
                  <Form.Select name="department" id="department">
                    <option>Select Site</option>
                    {site.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.siteName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col xs={12} sm={6} className="mb-5">
                  <Form.Select name="department" id="department">
                    <option>Pit</option>
                    {site.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.siteName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={4} className="mb-5">
                  <Card style={{ border: "1px" }}>
                    <SubPageHeading heading="Cam - 1 (Site - 1 Pit - 1)" />
                    <video width="auto" height="auto" controls>
                      <source src="/cam1.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Card>
                </Col>
                <Col xs={12} sm={4} className="mb-5">
                  <Card>
                    <SubPageHeading heading="Cam - 2 (Site - 1 Pit - 1)" />
                    <video width="auto" height="auto" controls>
                      <source src="/cam2.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Card>
                </Col>
                <Col xs={12} sm={4} className="mb-5">
                  <Card>
                    <SubPageHeading heading="Cam - 3 (Site - 1 Pit - 1)" />
                    <video width="auto" height="auto" controls>
                      <source src="/cam1.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Card>
                </Col>
                <Col xs={12} sm={4} className="mb-5">
                  <Card>
                    <SubPageHeading heading="Cam - 4 (Site - 1 Pit - 1)" />
                    <video width="auto" height="auto" controls>
                      <source src="/cam2.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Card>
                </Col>
                <Col xs={12} sm={4} className="mb-5">
                  <Card>
                    <SubPageHeading heading="Cam - 5 (Site - 1 Pit - 1)" />
                    <video width="auto" height="auto" controls>
                      {/* <source
                        src="rtsp://admin:Texmin@123@192.168.31.181:554/cam/realmonitor?channel=1&subtype=0"
                        type="video/mp4"
                      /> */}
                      Your browser does not support the video tag.
                    </video>
                  </Card>
                </Col>
                <Col xs={12} sm={4} className="mb-5">
                  <Card>
                    <SubPageHeading heading="Cam - 4 (Site - 1 Pit - 1)" />
                    <video width="auto" height="auto" controls>
                      <source src="/cam2.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={4} lg={6} md={12} xs={12} className="mb-6">
          <Card>
            {/* card body */}
            <Card.Body>
              <PageHeading heading="Operate Drone" />
              <Row>
                <Col xs={12} sm={12} className="mb-5">
                  <Form.Select name="department" id="department">
                    <option>Select Dron</option>
                    {site.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.siteName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col xs={12} sm={12} className="mb-5">
                  <Form.Select name="department" id="department">
                    <option>Select Area</option>
                    {site.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.siteName}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  className="mb-5"
                  style={{ "text-align": "center" }}
                >
                  {isviblestart ? (
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => {
                        setIsvisibleStart(!isviblestart),
                          handleStartStream(
                            "rtsp://rtspstream:rgt8sA6-uQC0qpMJmNi0q@zephyr.rtsp.stream/people"
                          );
                      }}
                    >
                      Start <i className="fe fe-play"></i>
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => setIsvisibleStart(!isviblestart)}
                    >
                      Stop <i className="fe fe-pause"></i>
                    </Button>
                  )}
                </Col>
                {/* {!isviblestart && (
                  <Col
                    xs={12}
                    sm={2}
                    className="mb-5"
                    style={{ "text-align": "center" }}
                  >
                    <HLSPlayer streamUrl={url} />
                  </Col>
                )} */}
                <div>
                  <h2>Dynamic RTSP Stream</h2>
                  <input
                    id="rtsp"
                    placeholder="Enter RTSP URL"
                    style={{ width: "80%" }}
                  />
                  <button onClick={handleStartStream}>Play</button>

                  {url && <HLSPlayer streamUrl={url} />}
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </div>
    </Container>
  );
};
export default Home;
