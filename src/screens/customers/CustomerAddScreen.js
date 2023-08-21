import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
import { Store } from "../../Store";
import { getError } from ".././utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function CustomerAddScreen() {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [canton, setCanton] = useState("");
  const [direc, setDirec] = useState("");
  const [oficio, setOficio] = useState("");
  const [tipo, setTipo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const url = "http://localhost:5000";
  // const url = "https://pope-api.vercel.app";
  useEffect(() => {});

  const onchangeHandle = async (choice) => {
    setTipo(choice.target.value);
  };

  const onchangeHandleLugar = async (choice) => {
    setCanton(choice.target.value);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axios.post(
        url + "/api/customers",
        {
          name: name,
          email: email,
          phone: phone,
          canton: canton,
          direc: direc,
          oficio: oficio,
          fechaNacimiento: fechaNacimiento,
          tipo: tipo,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({
        type: "UPDATE_SUCCESS",
      });
      toast.success("User updated successfully");
      navigate("/admin/customers");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Crear </title>
      </Helmet>
      <h1>Crear Cliente</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>Telefono</Form.Label>
          <Form.Control
            type="phone"
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>Lugares</Form.Label>
          <Form.Select
            name="canton"
            onChange={(choice) => onchangeHandleLugar(choice)}
            aria-label="Frequencias de pago"
          >
            <option>Seleccione</option>
            <option value="San Joaquin">San Joaquin</option>
            <option value="Alajuela">Alajuela</option>
            <option value="Nandayure">Nandayure</option>
            <option value="Nicoya">Nicoya</option>
            <option value="Pueblo viejo">Pueblo viejo</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>Tipo de cliente </Form.Label>
          <Form.Select
            name="canton"
            onChange={(choice) => onchangeHandle(choice)}
            aria-label="Frequencias de pago"
          >
            <option>Seleccione</option>
            <option value="nuevo">nuevo</option>
            <option value="Regular">Regular</option>
            <option value="Limitado">Limitado</option>
            <option value="Premium">Premium</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>Fecha Nacimieto</Form.Label>
          <Form.Control
            type="date"
            onChange={(e) => setFechaNacimiento(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="phone">
          <Form.Label>Oficio</Form.Label>
          <Form.Control onChange={(e) => setOficio(e.target.value)} required />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit" variant="outline-primary">
            Agregar
          </Button>
        </div>
      </Form>
    </Container>
  );
}
