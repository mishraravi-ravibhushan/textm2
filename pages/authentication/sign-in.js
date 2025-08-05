// import node module libraries
import { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "../../constants/apiPath";
import FlashError from "../../components/FlashError";
// import authlayout to override default layout
import AuthLayout from "../../layouts/AuthLayout";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const SignIn = () => {
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
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    let data = new FormData();
    data.append("mode", "VERIFY");
    data.append("userID", email);
    data.append("extra", "web");
    data.append("password", password);

    const res = await axios.post(API_BASE_URL + "verify", data);
    console.log(res);
    let repsonse = res.data;
    if (res.status === 200 && repsonse.result[0]?.Flag == "Success") {
      setType("success");
      setError("You have login sucessfully");
      //localStorage.setItem("userData", repsonse.result[0]);
      login(repsonse.result[0]);
    } else {
      setType("error");
      setError("Your Credentials is not valid");
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
              {/* Username */}
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username or email</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter address here"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="**************"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Checkbox */}
              <div className="d-lg-flex justify-content-between align-items-center mb-4">
                <Form.Check type="checkbox" id="rememberme">
                  <Form.Check.Input type="checkbox" />
                  <Form.Check.Label>Remember me</Form.Check.Label>
                </Form.Check>
              </div>
              <div>
                {/* Button */}
                <div className="d-grid">
                  {loading == false ? (
                    <Button type="submit" variant="primary">
                      <i class="fe fe-unlock"></i> Login{" "}
                    </Button>
                  ) : (
                    <div className="spinner-border text-success" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                </div>
                <div className="d-md-flex justify-content-between mt-4">
                  <div className="mb-2 mb-md-0">
                    <Link href="/authentication/sign-up" className="fs-5">
                      Create An Account{" "}
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

SignIn.Layout = AuthLayout;

export default SignIn;
