import Cookies from "js-cookie"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHead from "./AdminHead";
import axios from "axios";
const rest = require("../../EndPoints")

function ReturnShoes(){
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
        axios.get(rest.endPointUserOrders2 + "?status=" + status+"&order_status="+order_status, header)
            .then(response => {
                console.log(response.data);
                setOrders(response.data)
            })
            .catch(e => {
                console.log(e);
            })
    }, [status, count,order_status])

    const AcceptReturnShoe = e =>{
        e.preventDefault();
        let orderItemId = e.target[0].value;
        let orderId = e.target[1].value;
        axios.get(rest.endPointAceeptReturnOrder + "?orderItemId=" + orderItemId+"&orderId="+orderId, header)
            .then(response => {
                console.log(response.data);
                alert(response.data)
            })
            .catch(e => {
                console.log(e);
            })
    }
    const RejectReturnShoe = e =>{
        e.preventDefault();
        let orderItemId = e.target[0].value;
        axios.get(rest.endPointRejectReturnOrder + "?orderItemId=" + orderItemId, header)
            .then(response => {
                console.log(response.data);
                alert(response.data)
            })
            .catch(e => {
                console.log(e);
            })
    }
    return(
        <>
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
                                        <div className="" style={{ fontSize: "15px" }}><h5>{order['orderModel']['status']}</h5></div>
                                    </div>
                                    <div className="col s3">
                                        <div className="" style={{ fontSize: "10px" }}>Order Date</div>
                                        <div className="" style={{ fontSize: "14px" }}><h6>{order['orderModel']['order_date'].split(".")[0].replace("T", " ").substring(0, 16)}</h6></div>
                                    </div>
                                    <div className="col s3">
                                        <div className="" style={{ fontSize: "10px" }}>Order By (User)</div>
                                        <div className="h6" ><h6>{order['orderModel']['userModel']['name']}({order['orderModel']['userModel']['phone']})</h6></div>
                                    </div>
                                    
                                       


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
                                                {Cookies.get("role")==='admin'?<>
                                                    {order['orderModel']['status'] == 'Received' ? <div><th>Action</th></div> : <></>}

                                                </>:<></>}

                                            </tr>
                                        </thead>
                                        <tbody style={{ border: "1px solid black" }}>

                                            {order['orderItemModelsList'].map((orderItem, index) =>

                                                <tr key={orderItem["orderItemId"]} style={{ border: "1px solid black" }}>
                                                    <td>
                                                        <img src={'data:image/jpeg;base64,' + orderItem['productModel']['image2']} style={{ height: '80px', maxWidth: '100%' }} /><br></br>
                                                        {orderItem['productModel']['name']}
                                                    </td>
                                                    <td style={{ border: "1px solid black" }}>{orderItem['productModel']['brand']}</td>
                                                    <td style={{ border: "1px solid black" }}>{orderItem['productModel']['size']}</td>
                                                    <td style={{ border: "1px solid black" }}>${orderItem['productModel']['price']}</td>
                                                    <td style={{ border: "1px solid black" }}>{orderItem['quantity']}</td>
                                                    <td style={{ border: "1px solid black" }}>${orderItem['price']}</td>
                                                    {orderItem['status']==='Shoe Returned'?<>
                                                        <td >
                                                        <form onSubmit={AcceptReturnShoe}>
                                                            <input type="hidden" id="orderItemId" value={orderItem["orderItemId"]} />
                                                            <input type="hidden" id="orderId" value={order['orderModel']["orderId"]} />
                                                            <input type="submit" value={"Accept"} className="btn" style={{ width: '100%', background: "green" }}></input>
                                                        </form>
                                                        <form onSubmit={RejectReturnShoe}>
                                                            <input type="hidden" id="orderItemId" value={orderItem["orderItemId"]} />
                                                            <input type="submit" value={"Reject"} className="btn" style={{ width: '100%', background: "red",marginTop:"10px" }}></input>
                                                        </form>
                                                        </td>
                                                    </>:<>
                                                      <td><b style={{fontSize:"25px"}}>Order {orderItem['status']}</b></td>
                                                    </>}
                                                   
                                                        
                                                       
                                                        
                                                </tr>
                                            )}
                                            <tr>
                                                <td colspan="5"></td>
                                                <td>Grand Total : <b>$ {order['orderModel']['totalPrice']}</b></td>
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
export default ReturnShoes;