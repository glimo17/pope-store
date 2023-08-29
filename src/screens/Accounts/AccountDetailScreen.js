import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";
import { Store } from "../../Store";
import { getError } from "../utils";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DatePicker from "react-datepicker";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-bootstrap/Modal";
import Pedidos from "../../components/Pedidos";
import Pagos from "../../components/Pagos";
const url = "https://pope-api.vercel.app/";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "REQUEST2":
      return { ...state, loading: true };
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case "REQUEST2_SUCCESS":
      debugger;
      return {
        ...state,
        pedidos: action.payload,
        loading: false,
      };
    case "FETCH_FAIL2":
      return { ...state, loading: false, error: action.payload };
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

export default function AccountDetailScreen() {
  const navigate = useNavigate();
  const [
    { loading, error, users, pedidos, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const params = useParams();
  const { id: userId } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [idCustomer, setIdCustomer] = useState("");
  const [freq, setFreq] = useState("");
  const [date, setDate] = useState("");
  const [dateinit, setDateInit] = useState("");
  const [day, setDay] = useState("");
  const [idAccount, setIdAccount] = useState(userId);

  const [nameCustomer, setNameCustomer] = useState("");
  const [num, setNum] = useState("");
  const [ammount, setAmount] = useState("");
  const [limit, setLimit] = useState(false);
  const [showModalPedido, setShowModalPedido] = useState(false);
  const [showModalPago, setShowModalPago] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [value, setValue] = useState("");
  const handleClose = () => setShowModalPedido(false);
  const handleShow = () => setShowModalPedido(true);
  const handleClosePago = () => setShowModalPago(false);
  const handleShowPago = () => setShowModalPago(true);

  const handleSelect = (e) => {
    console.log(e);
    setValue(e);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(url + `api/accounts/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        debugger;
        setNameCustomer(data.customerId.name);
        setNum(data.num);
        setAmount(data.ammount);
        setLimit(data.limit);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userId, userInfo, idAccount]);

  const deleteHandler = async (user) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(url + `api/customers/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("user deleted successfully");
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
        <title>Creditos</title>
      </Helmet>
      <div class="container">
        <div class="row">
          <div class="col-sm">
            {" "}
            <h1>Informacion del Credito</h1>
            <Form>
              <div className="row">
                <div className="col">
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Numero del prestamo</Form.Label>
                    <Form.Control value={num} readOnly />
                  </Form.Group>
                </div>
                <div className="col">
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Cliente</Form.Label>

                    <Form.Control
                      type="Ammount"
                      value={nameCustomer}
                      readOnly
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                {/* <div className="col">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Cliente</Form.Label>
              <Form.Control value={nameCustomer} readOnly />
            </Form.Group>
          </div> */}
                <div className="col">
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Saldo</Form.Label>
                    <Form.Control value={ammount} readOnly />
                  </Form.Group>
                </div>
                <div className="col">
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Limite</Form.Label>
                    <Form.Control value={limit} readOnly />
                  </Form.Group>
                </div>
              </div>
            </Form>
          </div>
          {/* <div class="col-sm">One of three columns</div> */}
        </div>
      </div>

      <h1>Detalle de credito</h1>
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="home" title="Pedidos">
          {idAccount ? <Pedidos accountId={idAccount} /> : <div></div>}
        </Tab>
        <Tab eventKey="profile" title="Pagos">
          {idAccount ? <Pagos accountId={idAccount} /> : <div></div>}
        </Tab>
        <Tab eventKey="profile2" title="Configurar frequencia de pagos ">
          <table className="table">
            <thead>
              <tr>
                <th>Frequencia</th>
                <th>Num credito</th>
                <th>Monto de cobro</th>
                <th>Monto de pago</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {/* {users.map((user) => (
            <tr key={user._id}>
              <td>{user.accountId.customerId.name}</td>
              <td>{user.accountId.num}</td>
              <td>{user.ammount}</td>
              <td>{user.ammountPay}</td>
              <td>{user.status}</td>

            </tr>
          ))} */}
            </tbody>
          </table>
          <Form></Form>
        </Tab>
        {/* 
        <Tab eventKey="contact" title="Confifurar Pagos">
          <Form>
           
              <div className="col-3">
                <Form.Group controlId="name">
                  <Form.Label>Fecha de Inicio</Form.Label>
                </Form.Group> 
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
              <div className="col-3">
                <Form.Group controlId="name">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <DropdownButton title="Selecione" onSelect={handleSelect}>
                    <Dropdown.Item eventKey="option-1">Semanal</Dropdown.Item>
                    <Dropdown.Item eventKey="option-2">
                      Bi Semanal
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="option-3">Quincenal</Dropdown.Item>
                    <Dropdown.Divider />
                  </DropdownButton>
                  <Form.Control value={value} readOnly />
                </Form.Group>
              </div>
              <Button type="button" variant="success">
                Guardar
              </Button>
              {/* <div className="col">

              </div>
              <div className="col">
                <Form.Group className=" mb-3" controlId="phone">
                  <Form.Label>Limite</Form.Label>
                  <Form.Control type="limit" value={limit} readOnly />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Cliente</Form.Label>
                  <Form.Control value={nameCustomer} readOnly />
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Saldo</Form.Label>
                  <Form.Control value={nameCustomer} readOnly />
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Monto</Form.Label>
                  <Form.Control value={nameCustomer} readOnly />
                </Form.Group>
              </div> */}
        {/* </div>
          </Form>
        </Tab> */}{" "}
      </Tabs>
      <Modal show={showModalPago} onHide={handleClosePago}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                // onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                // onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Telefono</Form.Label>
              <Form.Control
                type="phone"
                // onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
