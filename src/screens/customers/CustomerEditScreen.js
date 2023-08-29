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
// const url = "http://localhost:5000";
const url = "https://pope-api.vercel.app";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
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

export default function CustomerEditScreen() {
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
  const [frec, setFrec] = useState("");
  const [dateConfig, setDateConfig] = useState("");
  const [dayPay, setDayPay] = useState("");
  const [dateFirstPay, setDateFirstPay] = useState("");
  const [dayString, setDayString] = useState("");

  const onchangeHandleLugar = async (choice) => {
    setCanton(choice.target.value);
  };

  const onchangeHandleConfig = async (choice) => {
    setFrec(choice.target.value);
  };
  const onchangeHandleConfigDay = async (choice) => {
    setDayString(choice.target.value);
  };

  const onchangeHandle = async (choice) => {
    setCanton(choice.target.value);
  };

  useEffect(() => {
    debugger;

    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(url + `/api/customers/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        debugger;
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setCanton(data.canton);
        setDirec(data.direc);
        setDateConfig(data.dateConfig);
        setDateFirstPay(data.dateFirstPay);
        setDayPay(data.dayPay);
        setDayString(data.dayString);
        setFrec(data.frec);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        url + `/api/customers/${userId}`,
        { _id: userId, name, email, phone, canton, direc },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
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
        <title>Actualizar Cliente</title>
      </Helmet>
      <h1>Actualizar Cliente</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
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
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Canton</Form.Label>
            <Form.Select
              name="canton"
              value={canton}
              onChange={(choice) => onchangeHandle(choice)}
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
            <Form.Label>Telefono</Form.Label>
            <Form.Control
              value={phone}
              type="phone"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </Form.Group>
          <h2>Configuración de pago</h2>
          <div className="row">
            <div className="col">
              <Form.Group controlId="name">
                <Form.Label>Frequencias de pago</Form.Label>
                <Form.Select
                  onChange={(choice) => onchangeHandleConfig(choice)}
                  aria-label="Frequencias de pago"
                  value={frec}
                >
                  <option>Seleccione</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Bi-Semanal">Bi Semanal</option>
                  <option value="Quincenal">Quincenal</option>
                  <option value="Mensual">Mensual</option>
                </Form.Select>
              </Form.Group>
              {}
              {frec === "Mensual" && (
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Día de Pago</Form.Label>

                  <Form.Control
                    value={dayPay}
                    onChange={(e) => setDayPay(e.target.value)}
                    type="Ammount"
                  />
                </Form.Group>
              )}
            </div>
            <div className="col">
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Fecha Configuración</Form.Label>
                <Form.Control
                  onChange={(e) => setDateConfig(e.target.value)}
                  type="date"
                  value={dateConfig}
                />
              </Form.Group>
            </div>
            <div className="col">
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Fecha Primer pagos</Form.Label>
                <Form.Control
                  value={dateFirstPay}
                  onChange={(e) => setDateFirstPay(e.target.value)}
                  type="date"
                />
              </Form.Group>
            </div>
          </div>
          {frec === "Semanal" && (
            <div className="col">
              <Form.Group controlId="name">
                <Form.Label>Dia de la semana</Form.Label>
                <Form.Select
                  value={dayString}
                  onChange={(choice) => onchangeHandleConfigDay(choice)}
                  aria-label="Frequencias de pago"
                >
                  <option>Seleccione</option>
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miercoles">Miercoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                  <option value="Sabado">Sabado</option>
                  <option value="Domingo">Domingo</option>
                </Form.Select>
              </Form.Group>
            </div>
          )}
          <div className="mb-3">
            <Button
              disabled={loadingUpdate}
              type="submit"
              variant="outline-primary"
            >
              Actualizar
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}
