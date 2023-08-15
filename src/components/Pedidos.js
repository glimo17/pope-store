import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import { getError } from "../screens/utils";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DatePicker from "react-datepicker";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import Autocomplete from "./Autocomplete";
import React, { useContext, useEffect, useReducer, useState } from "react";

// const url = "http://localhost:5000/";
const url = "https://pope-api.vercel.app/";
const reducer = (state, action) => {
  debugger;
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};
export default function Pedidos({ accountId }) {
  debugger;
  const handleClose = () => setShowModalPedido(false);
  const handleShow = () => setShowModalPedido(true);
  const [showModalPedido, setShowModalPedido] = useState(false);
  const [showModalPago, setShowModalPago] = useState(false);
  const navigate = useNavigate();
  const [product, setProduct] = useState("");
  const [cant, setCant] = useState("");

  const [ammount, setAmount] = useState("");
  const [
    { loading, error, users, pedidos, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const deleteHandler = async (user) => {
    setShowModalPedido(false);
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.post(
        url + `api/pedidos`,
        {
          accountId: accountId,
          product: product,
          cant: cant,
          ammount: ammount,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success("Pedido agregado");
      dispatch({ type: "DELETE_SUCCESS" });
    } catch (error) {
      alert(getError(error));
      toast.error(getError(error));
      dispatch({
        type: "DELETE_FAIL",
      });
    }
  };
  const { state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(url + `api/pedidos/` + accountId, {
          headers: { Authorization: `Bearer userInfo.token` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  return users ? (
    <div>
      {" "}
      <Button type="button" onClick={(e) => setShowModalPedido(true)}>
        Agregar Pedido
      </Button>
      <table className="table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Articulos</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.date}</td>
              <td>{user.product}</td>
              <td>{user.cant}</td>
              <td>{user.ammount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {loadingDelete && <LoadingBox></LoadingBox>}
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
     
          )} */}
      <Modal show={showModalPedido} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Articulos</Form.Label>
              {/* <Autocomplete
                suggestions={[
                  "Alabama",
                  "Alaska",
                  "American Samoa",
                  "Arizona",
                  "Arkansas",
                  "California",
                  "Colorado",
                  "Connecticut",
                  "Delaware",
                  "District Of Columbia",
                  "Federated States Of Micronesia",
                  "Florida",
                  "Georgia",
                  "Guam",
                  "Hawaii",
                  "Idaho",
                  "Illinois",
                  "Indiana",
                  "Iowa",
                  "Kansas",
                  "Kentucky",
                  "Louisiana",
                  "Maine",
                  "Marshall Islands",
                  "Maryland",
                  "Massachusetts",
                  "Michigan",
                  "Minnesota",
                  "Mississippi",
                  "Missouri",
                  "Montana",
                  "Nebraska",
                  "Nevada",
                  "New Hampshire",
                  "New Jersey",
                  "New Mexico",
                  "New York",
                  "North Carolina",
                  "North Dakota",
                  "Northern Mariana Islands",
                  "Ohio",
                  "Oklahoma",
                  "Oregon",
                  "Palau",
                  "Pennsylvania",
                  "Puerto Rico",
                  "Rhode Island",
                  "South Carolina",
                  "South Dakota",
                  "Tennessee",
                  "Texas",
                  "Utah",
                  "Vermont",
                  "Virgin Islands",
                  "Virginia",
                  "Washington",
                  "West Virginia",
                  "Wisconsin",
                  "Wyoming",
                ]}
              /> */}
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => setCant(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type="phone"
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={deleteHandler}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  ) : (
    <div>
      {" "}
      <div>
        <Button type="button" onClick={(e) => setShowModalPedido(true)}>
          Agregar Pedido
        </Button>
        <h1>No hay datos asociados</h1>
      </div>
      <Modal show={showModalPedido} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Articulos</Form.Label>
              <Form.Control
                onChange={(e) => setProduct(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => setCant(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type="phone"
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={deleteHandler}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
