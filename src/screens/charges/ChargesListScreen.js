import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
import { Store } from "../../Store";
import Form from "react-bootstrap/Form";
import { getError } from "../utils";
import Modal from "react-bootstrap/Modal";
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
export default function ChargesListScreen() {
  debugger;
  const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [show, setShow] = useState(false);
  const [ammount, setAmount] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const setAmmountHandle = async (value) => {
    setAmount(value);
  };
  const url = "https://pope-api.vercel.app/";
  useEffect(() => {
    debugger;
    debugger;
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(url + `api/charges`, {
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

  const deleteHandler = async (user) => {
    if (window.confirm("Esta seguro de borrar el cliente?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(url + `api/customers/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("Cliente borrado");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };
  return (
    <div>
      <Helmet>
        <title>Pagos</title>
      </Helmet>
      <h1>Pagos de la semana</h1>
      <Button
        type="button"
        variant="success"
        onClick={() => navigate(`/admin/customerAdd/`)}
      >
        <i className="fas fa-user-edit"></i>Nuevo
      </Button>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Num credito</th>
              <th>Monto de pago</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.accountId.customerId.name}</td>
                <td>{user.accountId.num}</td>
                <td>{user.ammount}</td>
                <td>
                  <Button
                    type="button"
                    variant="success"
                    onClick={() => setShow(true)}
                  >
                    <i className="fas fa-user-edit"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>Agregar monto de pago</h1>

          <Form>
            <Form.Group className="mb-6" controlId="ammount">
              <Form.Label>Monto</Form.Label>
              <Form.Control
                value={ammount}
                onChange={(e) => setAmmountHandle(e.target.value)}
                required
              />
            </Form.Group>

            <div className="mb-3">
              <Button onClick={(e) => setShow(false)} variant="outline-primary">
                Agregar
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
