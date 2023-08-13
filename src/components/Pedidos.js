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
    debugger;
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(url + `api/pedidos`, {
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
            <th>Fecha</th>
            <th>Articulos</th>
            <th>Monto</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.product}</td>
              <td>{user.cant}</td>
              <td>{user.ammount}</td>
              <td>{user.date}</td>
              <td>
                <Button
                  type="button"
                  variant="success"
                  onClick={() => navigate(`/admin/customer/${user._id}`)}
                >
                  <i className="fas fa-user-edit"></i>
                </Button>
                &nbsp;
                <Button
                  type="button"
                  variant="danger"
                  //   onClick={() => deleteHandler(user)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </td>
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
  ) : (
    <div></div>
  );
}
