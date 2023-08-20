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
import Modal from "react-bootstrap/Modal";
import { getError } from ".././utils";
import DatePicker from "react-datepicker";

const reducer = (state, action) => {
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

export default function PedidosAddScreen() {
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();
  const [product, setProduct] = useState("");
  const [cant, setCant] = useState("");
  const [accountId, setAccountId] = useState("");
  const [ammount, setAmount] = useState("");
  const [startDate, setStartDate] = useState(new Date());

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);
  const [value, setValue] = useState("");
  const [idCustomer, setIdCustomer] = useState("");
  const [nameCustomer, setNameCustomer] = useState("");
  const [show, setShow] = useState(false);
  const setIdCustomerHandle = async (value) => {
    debugger;
    setIdCustomer(value._id);
    setNameCustomer(value.name);
    setShow(false);
  };
  //   const url = "http://localhost:5000/";
  const url = "https://pope-api.vercel.app/";
  useEffect(() => {
    debugger;
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(url + `api/customers`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
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

  const onchangeHandle = async (choice) => {
    // setCanton(choice.target.value);
  };
  //   const submitHandler = async (e) => {
  //     e.preventDefault();
  //     try {
  //       dispatch({ type: "UPDATE_REQUEST" });
  //       const { data } = await axios.post(
  //         url + "/api/customers",
  //         {
  //         //   name: name,
  //         //   email: email,
  //         //   phone: phone,
  //         //   canton: canton,
  //         //   direc: direc,
  //         },
  //         {
  //           headers: {
  //             authorization: `Bearer ${userInfo.token}`,
  //           },
  //         }
  //       );
  //       dispatch({
  //         type: "UPDATE_SUCCESS",
  //       });
  //       toast.success("User updated successfully");
  //       navigate("/admin/customers");
  //     } catch (error) {
  //       toast.error(getError(error));
  //       dispatch({ type: "UPDATE_FAIL" });
  //     }
  //   };
  return (
    <div>
      <div>
        <Helmet>
          <title>Crear </title>
        </Helmet>
        <h1>Crear nuevo pedido</h1>
        <Form>
          <div className="row">
            <div className="col-3">
              <Form.Group className="mb-5" controlId="phone">
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
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-3">
              <Form.Group className="mb-5" controlId="name">
                <Form.Label>Cliente</Form.Label>
                <Form.Control value={nameCustomer} required />
              </Form.Group>
            </div>
            <div className="col-3">
              <Form.Group className="mb-5" controlId="name">
                <Form.Label></Form.Label>
                <Button variant="primary" onClick={handleShow}>
                  Sellecione el cliente
                </Button>
              </Form.Group>
            </div>
            <div className="col-3">
              <Form.Group controlId="name">
                <Form.Label>Fecha creacion</Form.Label>
              </Form.Group>
              <DatePicker
                selected={startDate}
                readOnly
                onChange={(date) => setStartDate(date)}
              />
            </div>
          </div>
          <h2>Detalle pedido</h2>
          <div className="row">
            <div className="col-4">
              <Form.Check // prettier-ignore
                type="switch"
                id="custom-switch"
                label="Conozco el producto"
              />
            </div>
            <div className="col-4">
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Articulo</Form.Label>
                <Form.Control
                  onChange={(e) => setProduct(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-4" controlId="email">
                <Form.Label>Marca</Form.Label>
                <Form.Control
                  type="email"
                  onChange={(e) => setCant(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Talla-Capacidad</Form.Label>
                <Form.Control
                  onChange={(e) => setProduct(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Precio costo</Form.Label>
                <Form.Control
                  onChange={(e) => setProduct(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-4" controlId="email">
                <Form.Label>Precio venta</Form.Label>
                <Form.Control
                  type="email"
                  onChange={(e) => setCant(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Proveedor</Form.Label>
                <Form.Control
                  onChange={(e) => setProduct(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Codigo</Form.Label>
                <Form.Control
                  onChange={(e) => setProduct(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-4" controlId="email">
                <Form.Label>Detalle</Form.Label>
                <Form.Control
                  type="email"
                  onChange={(e) => setCant(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Num factura</Form.Label>
                <Form.Control
                  onChange={(e) => setProduct(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Monto prima</Form.Label>
                <Form.Control
                  onChange={(e) => setProduct(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-4" controlId="email">
                <Form.Label>Tipo de pago</Form.Label>
                <Form.Control
                  type="email"
                  onChange={(e) => setCant(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Num factura</Form.Label>
                <Form.Control
                  onChange={(e) => setProduct(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Monto prima</Form.Label>
                <Form.Control
                  onChange={(e) => setProduct(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-4" controlId="email">
                <Form.Label>Tipo de pago</Form.Label>
                <Form.Control
                  type="email"
                  onChange={(e) => setCant(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
          </div>
        </Form>
      </div>
      <div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Lista de CLientes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>PHONE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <Button
                          type="button"
                          variant="success"
                          onClick={async () => setIdCustomerHandle(user)}
                        >
                          <i className="fas fa-user-edit"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
