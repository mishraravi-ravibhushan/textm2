// import node module libraries
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { API_BASE_URL } from "../../constants/apiPath";
import FlashError from "../../components/FlashError";
import Link from "next/link";

// import authlayout to override default layout
import AuthLayout from "layouts/AuthLayout";

const SignUp = () => {
  useEffect(() => {
    // Add class
    document.body.classList.add("login");

    // Cleanup function to remove class on unmount or update
    return () => {
      document.body.classList.remove("login");
    };
  }, [true]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState("error");
  const router = useRouter();
  const [checkcpass, setCheckcpass] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    let data = new FormData();
    data.append("mode", "INSERTUSER");
    data.append("firstname", e.target.firstname.value);
    data.append("lastname", e.target.lastName.value);
    data.append("sipID", e.target.contactno.value);
    data.append("contactNo", e.target.contactno.value);
    data.append("password", e.target.password.value);
    // if (checkcpass == false) {
    //   setType("error");
    //   setError("Password and confirm that it is not valid.");
    //   //return true;
    // }

    if (e.target.password.value !== e.target.confirmpassword.value) {
      setType("error");
      setError("Password and confirm that it is not valid.");
      setLoading(false);
      return true;
    }

    const res = await axios.post(API_BASE_URL + "user", data);
    let repsonse = res.data;
    if (res.status === 200 && repsonse?.result) {
      setType("success");
      setError("You have login sucessfully");
      router.push("/authentication/sign-in");
    } else {
      setType("error");
      setError("You have already logged in or tried using other credentials.");
    }
    setLoading(false);
  };
  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <FlashError
          message={error}
          type={type}
          onClose={() => setError("")}
          duration={4000} // optional
        />
        {/* Card */}
        <Card className="smooth-shadow-md">
          {/* Card body */}
          <Card.Body className="p-6">
            <div className="mb-4">
              <Link href="/">
                <Image src="/images/logo/logo.jpeg" className="mb-2" alt="" />
              </Link>
              <p className="mb-6">Please enter your user information.</p>
            </div>
            {/* Form */}
            <Form onSubmit={handleSubmit}>
              <Row className="mb-2">
                <div className="col-sm-6 mb-3 mb-lg-0">
                  <Form.Label>First name</Form.Label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstname"
                    placeholder="First name"
                    id="firstname"
                    pattern="\s*(\S\s*){3,}"
                    title="First Name should have at least 3 characters."
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <Form.Label>Last name</Form.Label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    placeholder="Last name"
                    pattern="\s*(\S\s*){3,}"
                    title="Last Name should have at least 3 characters."
                    id="lastName"
                    required
                  />
                </div>
              </Row>
              {/* contact */}
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  type="text"
                  name="contactno"
                  id="contactno"
                  placeholder="Contact Number"
                  required
                  pattern="[1-9]{1}[0-9]{9}"
                  title="Invalid Contact Number"
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
                />
              </Form.Group>

              {/* Confirm Password */}
              <Form.Group className="mb-3" controlId="confirm-password">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmpassword"
                  placeholder="**************"
                  minlength="6"
                  required
                />
              </Form.Group>

              {/* Checkbox */}
              {/* <div className="mb-3">
                <Form.Check type="checkbox" id="check-api-checkbox">
                  <Form.Check.Input type="checkbox" />
                  <Form.Check.Label>
                    I agree to the <Link href="#"> Terms of Service </Link> and{" "}
                    <Link href="#"> Privacy Policy.</Link>
                  </Form.Check.Label>
                </Form.Check>
              </div> */}

              <div>
                {/* Button */}
                <div className="d-grid">
                  {loading == false ? (
                    <Button variant="primary" type="submit">
                      <i className="fe fe-user-check"></i> Register{" "}
                    </Button>
                  ) : (
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                </div>
                <div className="d-md-flex justify-content-between mt-4">
                  <div className="mb-2 mb-md-0">
                    <Link href="/authentication/sign-in" className="fs-5">
                      Already member? Login{" "}
                    </Link>
                  </div>
                  <div>
                    <Link
                      href="/authentication/forget-password"
                      className="text-inherit fs-5"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

SignUp.Layout = AuthLayout;

export default SignUp;
