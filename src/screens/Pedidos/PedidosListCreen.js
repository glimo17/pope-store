import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Store } from "../../Store";
import { getError } from "../../screens/utils";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
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
        page: action.payload.page,
        pages: action.payload.pages,
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
export default function PedidosListCreen() {
  debugger;
  const handleClose = () => setShowModalPedido(false);
  const handleShow = () => setShowModalPedido(true);
  const [showModalPedido, setShowModalPedido] = useState(false);
  const [showModalPago, setShowModalPago] = useState(false);
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;
  const [product, setProduct] = useState("");
  const [cant, setCant] = useState("");
  const [accountId, setAccountId] = useState("");
  const [ammount, setAmount] = useState("");
  const [status, setStatus] = useState("Ingresado");

  const [
    { loading, error, users, pedidos, pages, loadingDelete, successDelete },
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

  const onchangeFilter = async (choice) => {
    setStatus(choice.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(url + `api/pedidos/filter/` + status, {
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
  }, [userInfo, successDelete, status]);

  return users ? (
    <div>
      {" "}
      <Button type="button" onClick={() => navigate(`/admin/pedidos/add`)}>
        Agregar Pedido
      </Button>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <div className="col-9">
            <Form.Group className="mb-5" controlId="phone">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="canton"
                onChange={(choice) => onchangeFilter(choice)}
                aria-label="Frequencias de pago"
              >
                <option value="Ingresado">Ingresado</option>
                <option value="Comprado">Comprado</option>
                <option value="Entregar">Entregar</option>
                <option value="Entregado">Entregado</option>
              </Form.Select>
            </Form.Group>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Articulo</th>
                <th>Fecha creacion</th>
                <th>Estado</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.accountId.customerId.name}</td>
                  <td>{user.product}</td>
                  <td>{user.date}</td>
                  <td>{user.status}</td>
                  <td>
                    <Button
                      type="button"
                      variant="success"
                      // onClick={async () => setIdCustomerHandle(user)}
                    >
                      Continuar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {[...Array(pages).keys()].map((x) => (
        <Link
          className={x + 1 === Number(page) ? "btn text-bold" : "btn"}
          key={x + 1}
          to={`/admin/products?page=${x + 1}`}
        >
          {x + 1}
        </Link>
      ))}
      <Modal
        dialogClassName="modal-width"
        show={showModalPedido}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar nuevo pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-9" controlId="phone">
              <Form.Label>Lugar de compra</Form.Label>
              <Form.Select
                name="canton"
                // onChange={(choice) => onchangeHandle(choice)}
                aria-label="Frequencias de pago"
              >
                <option>Seleccione</option>
                <option value="San Jose">San Jose</option>
                <option value="Panama">Panama</option>
                <option value="USA">USA</option>
                <option value="Nicoya">Nicoya</option>
                <option value="Pueblo viejo">Pueblo viejo</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-6" controlId="name">
              <Form.Label>Cliente</Form.Label>
              <Form.Control
                // value={nameCustomer}
                // onChange={(e) => setNameCustomer(e.target.value)}
                required
              />
              <Button
                variant="primary"
                // onClick={handleShow}
              >
                Sellecione el cliente
              </Button>
            </Form.Group>
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
