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
  const [lugar, setLugar] = useState("San Jose");
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

  const onchangeLugar = async (choice) => {
    debugger;
    setLugar(choice.target.value);
  };
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

  const handleStatusC = async (user, status) => {
    debugger;
    if (window.confirm("Esta seguro de cambiar de estado al pedido?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.post(
          url + `api/pedidos/status`,
          {
            id: user,
            status: status,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success("Estado actualizado en el pedido");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        alert(getError(error));
        toast.error(getError(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };
  const { state } = useContext(Store);
  const { userInfo } = state;

  const onchangeFilter = async (choice) => {
    setStatus(choice.target.value);
  };
  const onchangeFilter2 = async (choice) => {
    setLugar(choice.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          url + `api/pedidos/lugar/` + status + `/` + lugar,
          {
            headers: { Authorization: `Bearer userInfo.token` },
          }
        );
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
  }, [userInfo, successDelete, status, lugar]);

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
          <div className="row">
            <div className="col-4">
              <Form.Group className="mb-5" controlId="phone">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  name="canton"
                  value={status}
                  onChange={(choice) => onchangeFilter(choice)}
                  aria-label="Frequencias de pago"
                >
                  <option value="Ingresado">Ingresado</option>
                  <option value="Por Comprar">Por Comprar</option>
                  <option value="Comprado">Comprado</option>
                  <option value="Por Entregar">Por Entregar</option>
                  <option value="Entregado">Entregado</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-5" controlId="phone">
                <Form.Label>Lugar de compra</Form.Label>
                <Form.Select
                  name="canton"
                  value={lugar}
                  reaonly
                  onChange={(choice) => onchangeFilter2(choice)}
                  aria-label="Frequencias de pago"
                >
                  <option>Selecciones</option>
                  <option value="San Jose">San Jose</option>
                  <option value="Panama">Panama</option>
                  <option value="USA">USA</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Articulo</th>
                <th>Fecha creacion</th>
                <th>Fecha entrega</th>
                <th>Monto venta</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.accountId.customerId.name}</td>
                  <td>{user.product}</td>
                  <td>{user.date ? user.date.substring(0, 10) : ""}</td>
                  <td>
                    {user.dateEntrega ? user.dateEntrega.substring(0, 10) : ""}
                  </td>
                  <td>{user.montoVenta}</td>
                  <td>{user.status}</td>
                  {user.status === "Ingresado" && (
                    <>
                      <td>
                        <Button
                          type="button"
                          variant="success"
                          onClick={() => navigate(`/admin/pedidos/${user._id}`)}
                        >
                          Continuar
                        </Button>
                      </td>
                      <td>
                        <Button
                          type="button"
                          variant="success"
                          onClick={() => handleStatusC(user._id, "Por Comprar")}
                        >
                          Por Comprar
                        </Button>
                      </td>
                    </>
                  )}
                  {user.status === "Por Comprar" && (
                    <>
                      <td>
                        <Button
                          type="button"
                          variant="success"
                          onClick={() => navigate(`/admin/pedidos/${user._id}`)}
                        >
                          Continuar
                        </Button>
                      </td>
                      {user.montoVenta > 0 && (
                        <>
                          <td>
                            <Button
                              type="button"
                              variant="success"
                              onClick={() =>
                                handleStatusC(user._id, "Comprado")
                              }
                            >
                              Comprado
                            </Button>
                          </td>
                        </>
                      )}
                    </>
                  )}
                  {user.status === "Comprado" && (
                    <>
                      <td>
                        <Button
                          type="button"
                          variant="success"
                          onClick={() => navigate(`/admin/pedidos/${user._id}`)}
                        >
                          Continuar
                        </Button>
                      </td>
                      {user.dateEntrega && (
                        <>
                          <td>
                            <Button
                              type="button"
                              variant="success"
                              onClick={() =>
                                handleStatusC(user._id, "Por Entregar")
                              }
                            >
                              Por Entregar
                            </Button>
                          </td>
                        </>
                      )}
                    </>
                  )}
                  {user.status === "Por Entregar" && (
                    <>
                      <td>
                        <Button
                          type="button"
                          variant="success"
                          onClick={() => navigate(`/admin/pedidos/${user._id}`)}
                        >
                          Continuar
                        </Button>
                      </td>
                      <td>
                        <Button
                          type="button"
                          variant="success"
                          onClick={() => handleStatusC(user._id, "Entregado")}
                        >
                          Entregado
                        </Button>
                      </td>
                    </>
                  )}

                  {user.status === "Entregado" && (
                    <>
                      <td>
                        <Button
                          type="button"
                          variant="success"
                          onClick={() => navigate(`/admin/pedidos/${user._id}`)}
                        >
                          Ver Pedido
                        </Button>
                      </td>
                    </>
                  )}
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
    </div>
  );
}
