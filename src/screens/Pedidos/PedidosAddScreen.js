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
import Cliente from "../../components/Clientes";

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
  const [customerId, setIdCustomer] = useState("");
  const [nameCustomer, setNameCustomer] = useState("");
  const [show, setShow] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState("");
  const [fechaCompra, setFechaCompra] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [montoDolar, setmontoDolar] = useState(0);
  const [montoGanancia, setMontoGanancia] = useState(0);
  const [descuento, setMontDescuento] = useState(0);
  const [talla, settalla] = useState("");
  const [proveedor, setproveedor] = useState("");
  const [detalle, setDetalle] = useState("");
  const [status, setStatus] = useState("");
  const [codigo, setCodigo] = useState("");
  const [montoPrima, setMontoPrima] = useState(0);
  const [tipoPago, setTipoPago] = useState("");
  const [numFactura, setNumFactura] = useState("");
  const [marca, setMarca] = useState("");
  const [montoCosto, setMontoCosto] = useState(0);
  const [montoVenta, setMontoVenta] = useState(0);
  const [lugar, setLugar] = useState(0);
  const [tcNum, setTcNum] = useState("");
  const [tipoCliente, setTipoCliente] = useState("");
  const [isSanJose, setIsSanJose] = useState({
    id: "divOne3",
  });

  const [isTc, setIsTc] = useState({
    id: "divOne3",
  });

  const [isModalProcut, setIsModalProcut] = useState({
    id: "divOne",
  });

  const setIdCustomerHandle = async (value) => {
    setIdCustomer(value._id);
    setNameCustomer(value.name);
    setShow(false);
    setTipoCliente(" El ciente es " + value.tipo);
  };

  // const url = "http://localhost:5000/";
  const url = "https://pope-api.vercel.app/";

  const onchangeGanancia = async (value) => {
    let x = value - montoCosto;
    setMontoGanancia(x);
  };
  const onchangeDescuento = async (value) => {
    let v = (montoCosto * value) / 100;
    let y = Number(montoGanancia) + Number(v);
    setMontoGanancia(y);
    setMontDescuento(value);
  };
  const onchangeLugar = async (choice) => {
    setLugar(choice.target.value);
    if (choice.target.value == "San Jose") {
      setIsSanJose({
        id: "divOne3",
      });
    } else {
      setIsSanJose({
        id: "divOne",
      });
    }
  };

  const onchangeModalProuct = async (choice) => {
    debugger;
    setLugar(choice.target.value);
    if (choice.target.value == "1") {
      setIsModalProcut({
        id: "divOne3",
      });
    } else {
      setIsSanJose({
        id: "divOne",
      });
    }
  };

  const onchangeTipoPago = async (choice) => {
    setTipoPago(choice.target.value);
    if (choice.target.value == "Tarjeta") {
      setIsTc({
        id: "divOne3",
      });
    } else {
      setIsTc({
        id: "divOne",
      });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      debugger;
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
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axios.post(
        url + "api/pedidos",
        {
          customerId: customerId,
          product: product,
          proveedor: proveedor,
          detalle: detalle,
          talla: talla,
          lugar: lugar,
          marca: marca,
          codigo: codigo,
          tipoPago: tipoPago,
          numFactura: numFactura,
          montoCosto: montoCosto,
          descuento: descuento,
          montoPrima: montoPrima,
          montoVenta: montoVenta,
          montoGanancia: montoGanancia,
          cant: cant,
          tcNum: tcNum,
          fechaCreacion: fechaCreacion,
          fechaEntrega: fechaEntrega,
          fechaCompra: fechaCompra,
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
      navigate("/admin/pedidos");
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "UPDATE_FAIL" });
    }
  };
  return (
    <div>
      <div>
        <Helmet>
          <title>Crear </title>
        </Helmet>
        <h1>Crear nuevo pedido</h1>
        <Form onSubmit={submitHandler}>
          <div className="row">
            <div className="col-3">
              <Form.Group className="mb-5" controlId="lugar">
                <Form.Label>Lugar de compra</Form.Label>
                <Form.Select
                  name="canton"
                  onChange={(choice) => onchangeLugar(choice)}
                  aria-label="Frequencias de pago"
                >
                  <option>Seleccione</option>
                  <option value="San Jose">San Jose</option>
                  <option value="Panama">Panama</option>
                  <option value="USA">USA</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-5">
              <Form.Group className="mb-5">
                <Form.Label>Cliente</Form.Label>
                <Form.Control onClick={handleShow} value={nameCustomer} />
              </Form.Group>

              <h2> {tipoCliente}</h2>
            </div>
            <div className="col-3"></div>
            <div className="col-3">
              <Form.Group>
                <Form.Label>Fecha creacion</Form.Label>

                <Form.Control
                  type="date"
                  onChange={(e) => setFechaCreacion(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
          </div>
          <h2>Detalle Articulo</h2>
          <div className="row">
            {/* <div className="col-4">
              <Form.Group className="mb-5" controlId="lugar">
                <Form.Label>Conozco el producto</Form.Label>
                <Form.Select
                  name="canton"
                  onChange={(choice) => onchangeModalProuct(choice)}
                  aria-label="Frequencias de pago"
                >
                  <option>Seleccione</option>
                  <option value="1">Si</option>
                  <option value="2">No</option>
                </Form.Select>
              </Form.Group>
            </div> */}

            <div className="col-4">
              <Form.Group className="mb-3" controlId="namee">
                <Form.Label>Articulo</Form.Label>
                <Form.Control onChange={(e) => setProduct(e.target.value)} />
              </Form.Group>
            </div>

            <div className="col-4">
              <Form.Group className="mb-4" controlId="email">
                <Form.Label>Marca</Form.Label>
                <Form.Control onChange={(e) => setMarca(e.target.value)} />
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <Form.Group className="mb-3">
                <Form.Label>Talla-Capacidad</Form.Label>
                <Form.Control onChange={(e) => settalla(e.target.value)} />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-3">
                <Form.Label>Proveedor</Form.Label>
                <Form.Control onChange={(e) => setproveedor(e.target.value)} />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-3">
                <Form.Label>Codigo</Form.Label>
                <Form.Control onChange={(e) => setCodigo(e.target.value)} />
              </Form.Group>
            </div>
          </div>
          <h2>Detalle Montos</h2>
          <div className="row">
            <div className="col-4">
              <Form.Group className="mb-3">
                <Form.Label>Precio costo</Form.Label>
                <Form.Control
                  onChange={(e) => setMontoCosto(e.target.value)}
                  value={montoCosto}
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-4" controlId="email">
                <Form.Label>Precio venta</Form.Label>
                <Form.Control
                  onChange={(e) => onchangeGanancia(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-3">
                <Form.Label>Monto prima</Form.Label>
                <Form.Control
                  onChange={(e) => setMontoPrima(e.target.value)}
                  value={montoPrima}
                />
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div
              className={isSanJose.id === "divOne" ? `divOne` : "divOne d-none"}
            >
              {" "}
              <div className="col-4">
                <Form.Group>
                  <Form.Label>Precio Dolar</Form.Label>
                  <Form.Control
                    onChange={(e) => setmontoDolar(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="col-4">
              {" "}
              <Form.Group className="mb-3" controlId="namerr">
                <Form.Label>Margen de ganancia</Form.Label>
                <Form.Control value={montoGanancia} />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-3">
                <Form.Label>Descuento</Form.Label>
                <Form.Control
                  onChange={(e) => onchangeDescuento(e.target.value)}
                />
              </Form.Group>
            </div>
          </div>
          <h2>Detalle fechas</h2>
          <div className="row">
            <div className="col-4">
              <Form.Group className="mb-3">
                <Form.Label>Num factura</Form.Label>
                <Form.Control onChange={(e) => setNumFactura(e.target.value)} />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-4">
                <Form.Label>Detalle</Form.Label>
                <Form.Control onChange={(e) => setDetalle(e.target.value)} />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group className="mb-4" controlId="email">
                <Form.Label>Tipo de pago</Form.Label>

                <Form.Select
                  name="tipoPago"
                  onChange={(choice) => onchangeTipoPago(choice)}
                >
                  <option>Seleccione</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className={isTc.id === "divOne" ? `divOne` : "divOne d-none"}>
              {" "}
              <div className="col-4">
                <Form.Group>
                  <Form.Label>Tc </Form.Label>
                  <Form.Control onChange={(e) => setTcNum(e.target.value)} />
                </Form.Group>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <Form.Group>
                <Form.Label>Fecha compra</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => setFechaCompra(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="col-4">
              <Form.Group>
                <Form.Label>Fecha entrega</Form.Label>

                <Form.Control
                  type="date"
                  onChange={(e) => setFechaEntrega(e.target.value)}
                />
              </Form.Group>
            </div>
          </div>
          <div className="mb-3">
            <Button type="submit" variant="outline-primary">
              Agregar
            </Button>
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
