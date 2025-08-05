// import node module libraries
import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Container, Modal, Form, Button } from "react-bootstrap";
import { Mic, MicOff, PhoneOff, PhoneIncoming } from "react-feather";
// import widget as custom components
import { PageHeading } from "widgets";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL } from "constants/apiPath";
// import sub components
import {
  AboutMe,
  ActivityFeed,
  MyTeam,
  ProfileHeader,
  ProjectsContributions,
  RecentFromBlog,
} from "sub-components";
import axios from "axios";
import FlashError from "components/FlashError";
const Home = () => {
  const [users, setUsers] = useState();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [type, setType] = useState("error");
  const [pic, setPic] = useState();
  const [showModal, setShowModal] = useState(false);
  const videoRemoteRef = useRef(null);
  const videoLocalRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const [sipStack, setSipStack] = useState(null);
  const [session, setSession] = useState(null);
  const [iscall, setIsCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [incomingSession, setIncomingSession] = useState();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    email: "",
    sipID: "",
    department: "",
    address: "",
    bloodGroup: "",
    designation: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const SIP_CONFIG = {
    realm: "43.244.140.123:5066", // SIP domain
    impi: "webrtc_client1", // SIP username
    impu: "sip:webrtc_client1@143.244.140.123:5066", // SIP URI
    password: "webrtc_client1",
    websocket_proxy_url: "wss://143.244.140.123:8089/ws",
    enable_video: true,
  };

  const startSip = () => {
    const stack = new SIPml.Stack({
      realm: SIP_CONFIG.realm,
      impi: SIP_CONFIG.impi,
      impu: SIP_CONFIG.impu,
      password: SIP_CONFIG.password,
      display_name: "React User",
      websocket_proxy_url: SIP_CONFIG.websocket_proxy_url,
      outbound_proxy_url: null,
      enable_rtcweb_breaker: false,
      events_listener: {
        events: "*",
        listener: (e) => {
          console.log("Stack event:", e);
          if (e.type === "started") {
            const registerSession = stack.newSession("register", {
              events_listener: {
                events: "*",
                listener: (e) => console.log("Register:", e),
              },
            });
            registerSession.register();
          }
          console.log("line no 130", e.type);
          if (e.type === "i_new_call") {
            console.log("incommingcall");
            const incomingSession = e.newSession;
            setShowCallPopup(true);
            // Store this in React state or ref
            setIncomingSession(incomingSession);
          }
          if (e.type === "terminated" || e.type === "hangup") {
            alert("rrt");
            setIsCall(false);
            //setSession(null);
          }
        },
      },
      enable_early_ims: true,
      media_constraints: { audio: true, video: true },
      enable_media_stream_cache: false,
      video_local: videoLocalRef.current,
      video_remote: videoRemoteRef.current,
      audio_remote: remoteAudioRef.current,
    });

    stack.start();
    setSipStack(stack);
  };

  const toggleMute = () => {
    if (isMuted) {
      session.unmute("audio");
    } else {
      session.mute("audio");
    }
    setIsMuted(!isMuted);
  };

  const call = (number) => {
    setIsCall(true);
    setTimeout(() => {
      try {
        if (!sipStack) return;
        const sess = sipStack.newSession("call-audiovideo", {
          video_local: videoLocalRef.current,
          video_remote: videoRemoteRef.current,
          audio_local: remoteAudioRef.current,
          events_listener: {
            events: "*",
            listener: (e) => {
              console.log("Call Event:", e);

              // 💥 Close modal if remote hangs up or call ends
              if (e.type === "terminated" || e.type === "hangup") {
                setIsCall(false);
                setSession(null);
              }
            },
          },
        });
        console.log("call by line 105", `sip:${number}@${SIP_CONFIG.realm}`);
        sess.call(`sip:${number}@${SIP_CONFIG.realm}`);
        setSession(sess);
      } catch (error) {
        console.log(error);
      }
    }, 500);
  };

  const rejectCall = () => {
    if (!incomingSession) {
      console.warn("No incoming session to reject");
      return;
    }

    incomingSession.reject({
      status_code: 486, // Busy Here (standard SIP code for rejection)
      reason_phrase: "Busy",
    });

    setShowCallPopup(false); // Close the popup
    setIncomingSession(null); // Clear state
  };
  const acceptCall = () => {
    setIsCall(true);
    setShowCallPopup(false);
    setTimeout(() => {
      incomingSession.accept({
        video_local: videoLocalRef.current,
        video_remote: videoRemoteRef.current,
        audio_remote: remoteAudioRef.current,
        media_constraints: { audio: true, video: true },
      });

      setSession(incomingSession);
      setIncomingSession(null);
    }, 500);
  };

  const hangup = () => {
    if (session) session.hangup();
    setIsCall(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(API_BASE_URL + "uploadfile?file", formData);
    let repsonse = res.data;
    setPic(repsonse?.path);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    let data = new FormData();
    data.append("mode", "UPDATEUSERFIRST");
    data.append("userID", users?.userID);
    data.append("firstname", e.target.firstname.value);
    data.append("lastname", e.target.lastname.value);
    data.append("email", e.target.email.value);
    data.append("contactNo", users?.contactNo);
    data.append("address", e.target.address.value);
    data.append("bloodGroup", e.target.bloodGroup.value);
    if (pic) {
      data.append("pic", pic);
    }
    const res = await axios.post(API_BASE_URL + "user", data);
    console.log(res);
    let repsonse = res.data;
    if (res.status === 200 && repsonse.result[0]?.Flag == "Success") {
      setType("success");
      setError("You have login sucessfully");
      //localStorage.setItem("userData", repsonse.result[0]);
      getUSer();
      setShowModal(false);
      setLoading(false);
    } else {
      setType("error");
      setError("Your Credentials is not valid");
    }
    setLoading(false);
  };

  const getUSer = async () => {
    let storedUser = localStorage.getItem("authUser");
    const jonsUser = JSON.parse(storedUser);
    if (jonsUser?.userID) {
      const pid = searchParams.get("id") || jonsUser.userID;
      let id = searchParams.get("id");
      if (!id) {
        setEdit(true);
      }
      const url = `${API_BASE_URL}user?mode=SELECTUSER&userID=${pid}`;
      console.log("url", url);
      axios
        .get(url) // replace with your actual API
        .then((res) => setUsers(res.data.result[0]))
        .catch((err) => console.error("Error fetching users", err));
    }
  };

  useEffect(() => {
    setUsers([]);
    return () => {
      if (window.SIPml) {
        SIPml.init(() => startSip());
      } else {
        const script = document.createElement("script");
        script.src = "https://www.doubango.org/sipml5/SIPml-api.js";
        script.async = true;
        script.onload = () => SIPml.init(() => startSip());
        document.body.appendChild(script);
      }
      getUSer();
    };
  }, []);
  return (
    <Container fluid className="p-6">
      {/* Page Heading */}
      <PageHeading heading="Overview" />

      {/* Profile Header  */}
      <ProfileHeader
        profiledata={users}
        edit={isEdit}
        callEve={call}
        editfunction={() => {
          setShowModal(true);
        }}
      />

      {/* content */}
      <div className="py-6">
        <Row>
          {/* About Me */}
          <AboutMe profiledata={users} />
        </Row>
      </div>
      <Modal show={iscall} onHide={handleClose} size="xl">
        <Modal.Body>
          <div>
            <div className="modal-body d-flex gap-3 justify-content-center">
              <audio ref={remoteAudioRef} autoplay="autoPlay">
                {" "}
              </audio>
              <video
                ref={videoRemoteRef}
                autoPlay
                playsInline
                width="80%"
                height="60%"
              />
              <video
                ref={videoLocalRef}
                autoPlay
                muted
                playsInline
                width="100"
                height="80"
                style={{ position: "absolute", left: 0, bottom: 0 }}
              />
            </div>
            <div className="modal-footer d-flex gap-3 justify-content-center">
              <button
                className="btn btn-outline-secondary"
                onClick={toggleMute}
                title={isMuted ? "Un-mute" : "Mute"}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                className="btn btn-danger"
                onClick={hangup}
                title="Hang up"
              >
                <PhoneOff size={18} />
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {showCallPopup && (
        <Modal show={true} onHide={() => setShowCallPopup(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Incoming Call</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="d-flex gap-3 justify-content-center">
              You have an incoming call
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <button
                className="btn btn-success"
                onClick={acceptCall}
                title="Hang up"
              >
                <PhoneIncoming size={18} />
              </button>
              <button
                className="btn btn-danger"
                onClick={rejectCall}
                title="Hang up"
              >
                <PhoneOff size={18} />
              </button>
            </div>
          </Modal.Body>
        </Modal>
      )}
      {showModal && (
        <Modal show={showModal} onHide={handleClose}>
          <Form onSubmit={handleSubmit}>
            {/* <Modal.Header closeButton>
              <Modal.Title> </Modal.Title>
            </Modal.Header> */}
            <Modal.Body>
              <div className="mb-3">
                <Form.Label>First Name </Form.Label>
                <input
                  type="text"
                  className="form-control"
                  name="firstname"
                  placeholder="First name"
                  id="firstname"
                  value={form.firstname || users?.userFname}
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
                  value={form.lastname || users?.userLName}
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
                  value={form.email || users?.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* contact */}
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  name="contactNo"
                  id="contactNo"
                  placeholder="Contact Number"
                  required
                  pattern="[1-9]{1}[0-9]{9}"
                  title="Invalid Contact Number"
                  value={form.contactNo || users?.contactNo}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Select Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  name="address"
                  id="address"
                  value={form.address || users?.address}
                  onChange={handleChange}
                  placeholder="Address "
                  style={{ height: "100px" }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="department">
                <Form.Label>Blood Group</Form.Label>
                <Form.Select name="bloodGroup" id="bloodGroup" required>
                  <option>Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                        selected={option === users?.BloodGroup}
                      >
                        {option}
                      </option>
                    )
                  )}
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              {loading == false ? (
                <Button variant="primary" type="submit">
                  Update
                </Button>
              ) : (
                <div className="spinner-border text-success" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </Container>
  );
};
export default Home;
