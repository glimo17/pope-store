import React, { useContext, useEffect, useState } from "react";
import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "./utils";

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectUrl ? redirectUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const url = "https://pope-api.vercel.app/";
  const submitHandler = async (e) => {
    debugger;
    e.preventDefault();
    try {
      const { data } = await Axios.post(url + "api/users/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (error) {
      toast.error(getError(error));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container className="small-container">
      <Helmet>
        <title>Ingresar</title>
      </Helmet>
      <h1 className="my-3">Ingresar</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Correo</Form.Label>
          <Form.Control
            type="email"
            autoComplete="abc@example.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Clave</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3 d-grid">
          <Button type="submit" variant="outline-primary">
            Ingresar
          </Button>
        </div>
        <div className="mb-3">
          <Link to={`/signup?redirect=${redirect}`}>Registrarse</Link>
        </div>
      </Form>
    </Container>
  );
}
