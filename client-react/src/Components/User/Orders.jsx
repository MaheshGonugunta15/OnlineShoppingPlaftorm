import UserHead from "./UserHead";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import AdminHead from "../Admin/AdminHead";
import { useNavigate } from "react-router-dom";
const rest = require("../../EndPoints")
function Orders() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let status = params.get('status');
    const [orders, setOrders] = useState([])
    const [count, setCount] = useState(0)
    const navigate = useNavigate([])
    const[order_status,getStatus] = useState([])

    const header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }

    useEffect(() => {
        axios.get(rest.endPointUserOrders + "?status=" + status+"&order_status="+order_status+"&role="+Cookies.get("role"), header)
            .then(response => {
                console.log(response.data.orders);
                setOrders(response.data.orders)
            })
            .catch(e => {
                console.log(e);
            })
    }, [status, count,order_status])

    const DispatchOrder = e => {
        e.preventDefault();
        let orderId = e.target[0].value;
        axios.get(rest.endPointUserOrderStatus + "?orderId=" + orderId + "&type=" + "dispatch", header).then(response => {
            alert(response.data.message)
            setCount(count + 1)
        })
            .catch(e => {
                console.log(e);
            })
    }

    const OrderReceived = e => {
        e.preventDefault();
        let orderId = e.target[0].value;
        axios.get(rest.endPointUserOrderStatus + "?orderId=" + orderId + "&type=" + "received", header).then(response => {
            alert(response.data.message)
            setCount(count + 1)
        })
            .catch(e => {
                console.log(e);
            })
    }

    const giveRating = (productId, orderItemId) => {
        navigate("/giveRating?productId=" + productId + "&orderItemId=" + orderItemId)

    }

    const getTransaction = (orderId)=>{
        navigate("/transactions?orderId="+orderId)
    }

    const ReturnItem = e =>{
        e.preventDefault();
        let orderItemId = e.target[0].value;
        axios.get(rest.endPointReturnOrder + "?orderItemId=" + orderItemId, header).then(response => {
            alert(response.data)
            setCount(count + 1)
        })
            .catch(e => {
                console.log(e);
            })
    }

    return (
        <>

            {Cookies.get("role") === 'user' ? <><UserHead /></> : <></>}
            {Cookies.get("role") === 'admin' ? <><AdminHead /></> : <></>}
            <div className="container-fluid" style={{ marginTop: "5px" }}>
                <div className="h6" style={{ fontSize: "13px", textAlign: "center" }}> Order Details</div>
                <div className="row">
                    <div className="col s4"></div>
                    <div className="col s4"></div>
                    {status=='ordered'?<>
                        <div className="col s4 card" style={{padding:'10px'}}>
                    <select name="order_status" id="status" class="browser-default" style={{ color: "black" }} onChange={e=>{getStatus(e.target.value)}}>
                        <option value="">---Order Status---</option>
                        <option value="ordered">Ordered</option>
                        <option value="dispatched">Dispatched</option>
                    </select>
                    </div>
                    </>:<></>}
                   
                    
                </div>
                <div className="row">
                    {orders.map((order, index) =>
                        <div className="col s12">
                            <div className="card " style={{ padding: "15px" }}>
                                <div className="row">
                                    <div className="col s3">
                                        <div className="" style={{ fontSize: "10px" }}>Order Status</div>
                                        <div className="" style={{ fontSize: "15px" }}><h5>{order['cart'][0][1]}</h5></div>
                                    </div>
                                    <div className="col s3">
                                        <div className="" style={{ fontSize: "10px" }}>Order Date</div>
                                        <div className="" style={{ fontSize: "14px" }}><h6>{order['cart'][0][2].split(".")[0].replace("T", " ").substring(0, 16)}</h6></div>
                                    </div>
                                    <div className="col s3">
                                        <div className="" style={{ fontSize: "10px" }}>Order By (User)</div>
                                        <div className="h6" ><h6>{order['user']}</h6></div>
                                    </div>
                                    {Cookies.get("role") == 'admin' ? <>
                                        {order['cart'][0][1] === 'Ordered' ? <>
                                            <div className="col s3">
                                                <form onSubmit={DispatchOrder}>
                                                    <input type="hidden" id="orderId" value={order['cart'][0][0]}></input>
                                                    <input type="submit" value={"Disptch Order"} className="btn" style={{ marginTop: "12px" }}></input>
                                                </form>
                                            </div>
                                        </> : <></>}
                                    </> : <></>}
                                    {Cookies.get("role") == 'user' ? <>
                                        {order['cart'][0][1] === 'Dispatched' ? <>
                                            <div className="col s3">
                                                <form onSubmit={OrderReceived}>
                                                    <input type="hidden" id="orderId" value={order['cart'][0][0]}></input>
                                                    <input type="submit" value={"Received"} className="btn" style={{ marginTop: "12px" }}></input>
                                                </form>
                                            </div>
                                        </> : <></>}
                                        {/* {order['orderModel']['status'] === 'Received' ? <>
                                            <div className="col s3">
                                                <form onSubmit={OrderReceived}>
                                                    <input type="hidden" id="orderId" value={order['orderModel']['orderId']}></input>
                                                    <input type="submit" value={"Return Order"} className="btn" style={{ marginTop: "12px" }}></input>
                                                </form>
                                            </div>
                                        </> : <></>} */}
                                    </> : <></>}


                                </div>
                                <div className="">
                                    <table className="table" style={{ border: "1px solid black" }}>
                                        <thead style={{ border: "1px solid black" }}>
                                            <tr style={{ border: "1px solid black" }}>
                                                <th style={{ border: "1px solid black" }}>Name</th>
                                                <th style={{ border: "1px solid black" }}>Brand</th>
                                                <th style={{ border: "1px solid black" }}>Size</th>
                                                <th style={{ border: "1px solid black" }}>Price</th>
                                                <th style={{ border: "1px solid black" }}>Ordered Quantity</th>
                                                <th style={{ border: "1px solid black" }}>Total Price (P * O)</th>
                                                {order['cart'][1] == 'Cart' ? <div><th>Remove Cart</th></div> : <></>}
                                                {Cookies.get("role")==='user'?<>
                                                    {order['cart'][1] == 'Received' ? <div><th>Action</th></div> : <></>}

                                                </>:<></>}
                                                {Cookies.get("role")==='admin'?<>
                                                    {order['cart'][1] == 'Received'  ? <div><th>Action</th></div> : <></>}

                                                </>:<></>}

                                            </tr>
                                        </thead>
                                        <tbody style={{ border: "1px solid black" }}>

                                            {order['orders_list'].map((orderItem, index) =>

                                                <tr  style={{ border: "1px solid black" }}>
                                                    <td>
                                                        <img src={'data:image/jpeg;base64,' + orderItem['image']} style={{ height: '80px', maxWidth: '100%' }} /><br></br>
                                                        {orderItem['name']}
                                                        {orderItem['status'] == 'Received'? <div><th><button className="btn" onClick={() => { giveRating(orderItem['shoeId'], orderItem['cartItemId']) }} style={{ fontSize: "10px", background: "blue" }}>Give Rating</button></th></div> : <></>}
                                                    </td>
                                                    <td style={{ border: "1px solid black" }}>{orderItem['brand']}</td>
                                                    <td style={{ border: "1px solid black" }}>{orderItem['size']}</td>
                                                    <td style={{ border: "1px solid black" }}>${orderItem['price']}</td>
                                                    <td style={{ border: "1px solid black" }}>{orderItem['order_quantity']}</td>
                                                    <td style={{ border: "1px solid black" }}>${orderItem['price']}</td>
                                                    
                                                        
                                                        
                                                       
                                                        {/* {orderItem['status'] == 'Shoe Returned' ? <div>
                                                        <td >
                                                            <form onSubmit={"AcceptReturn"}>
                                                                <input type="hidden" id="orderItemId" value={orderItem["orderItemId"]} />
                                                                <input type="submit" value={"Return"} className="btn" style={{ width: '100%', background: "red" }}></input>
                                                            </form>
                                                            <form onSubmit={"RejectReturn"}>
                                                                <input type="hidden" id="orderItemId" value={orderItem["orderItemId"]} />
                                                                <input type="submit" value={"Return"} className="btn" style={{ width: '100%', background: "red" }}></input>
                                                            </form>
                                                        </td></div> : <></>} */}
                                                </tr>
                                            )}
                                            <tr>
                                                <td colspan="5"></td>
                                                <td>Grand Total : <b>$ {order['totalPrice']}</b></td>
                                            </tr>
                                        </tbody>

                                    </table>
                                </div>


                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
export default Orders;