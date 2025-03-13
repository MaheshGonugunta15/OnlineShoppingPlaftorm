import { useNavigate } from "react-router-dom";
import UserHead from "./UserHead";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
const rest = require("../../EndPoints")

function UserCart(){
    const navigate = useNavigate([])
    const [orders, setOrders] = useState([])
    const[count,setCount] = useState(0)
    const header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }
    useEffect(() => {
        axios.get(rest.endPointUserCart, header)
            .then(response => {
                console.log(response.data.orders);
                setOrders(response.data.orders)
            })
            .catch(e => {
                console.log(e);
            })
    }, [count])

    const OrderNow = e =>{
        e.preventDefault();
        let orderId = e.target[0].value;
        let totalPrice = e.target[1].value;
        navigate("/orderNow?orderId="+orderId+"&totalPrice="+totalPrice)

    }

    const RemoveCart = e=>{
        e.preventDefault();
        let orderItemId = e.target[0].value;
        let orderId = e.target[1].value;
        axios.get(rest.endPointRemoveCart+"?orderItemId="+orderItemId+'&orderId='+orderId, header)
        .then(response => {
            alert(response.data.message)
            setCount(count+1)
            
        })
        .catch(e => {
            console.log(e);
        })

        

    }
    
    const removeItem = (orderItemId) =>{
        axios.get(rest.endPointRemoveQuantity+"?orderItemId="+orderItemId,header)
        .then(response=>{
           console.log(response.data.message);
           alert(response.data)
           setCount(count+1)

        }).catch(e=>{
            console.log(e);
        })
        
    }
    const addItem = (orderItemId)=>{
        axios.get(rest.endPointAddQuantity+"?orderItemId="+orderItemId,header)
        .then(response=>{
           console.log(response.data);
           alert(response.data.message)
           setCount(count+1)

        }).catch(e=>{
            console.log(e);
        })
    }
 
 

   
    return(
        <>
        <UserHead/>
        <div className="container-fluid" style={{marginTop:"5px"}}>
        <div className=" h6" style={{fontSize:"13px",textAlign:"center"}}> Cart Details</div>

            <div className="row">
               {orders.map((order,index)=>
               <div className="col s12">
                  <div className="card " style={{padding:"15px"}}>
                    <div className="row">
                        <div className="col s3">
                           <div className="" style={{fontSize:"10px"}}>Order Status</div>
                           <div className="" style={{fontSize:"15px"}}><h5>{order['cart'][1]}</h5></div>
                        </div>
                        <div className="col s3">
                                <div className="" style={{fontSize:"10px"}}>Order Date</div>
                                <div className="" style={{fontSize:"14px"}}><h6>{order['cart'][2].split(".")[0].replace("T", " ").substring(0, 16)}</h6></div>
                            </div>
                           <div className="col s3">
                                <div className="" style={{fontSize:"10px"}}>Order By (User)</div>
                                <div className="h6" ><h6>{order['user']}</h6></div>
                            </div>
                            <div className="col s3">
                                <form onSubmit={OrderNow}>
                                    <input type="hidden" id="orderId" value={order['cart'][0]}></input>
                                    <input type="hidden" id="totalPrice" value={order['totalPrice']}></input>
                                    <input type="submit" value={"Order Now"} className="btn" style={{marginTop:"12px"}}></input>
                                </form>
                            </div>
                           
                        </div>
                        <div className="">
                            <table className="table" style={{border:"1px solid black"}}>
                                    <thead style={{border:"1px solid black"}}>
                                        <tr style={{border:"1px solid black"}}>
                                            <th style={{border:"1px solid black"}}>Name</th>
                                            <th style={{border:"1px solid black"}}>Brand</th>
                                            <th style={{border:"1px solid black"}}>Size</th>
                                            <th style={{border:"1px solid black"}}>Price</th>
                                            <th style={{border:"1px solid black"}}>Ordered Quantity</th>
                                            <th style={{border:"1px solid black"}}>Total Price (P * O)</th>
                                            {order['cart'][1] == 'Cart'?<div><th>Remove Cart</th></div>:<></>}
                                            
                                        </tr>
                                    </thead>
                                    <tbody style={{border:"1px solid black"}}>

                                        {order['orders_list'].map((orderItem,index)=>
                                        
                                        <tr  style={{border:"1px solid black"}}>
                                            <td>
                                            <img src={'data:image/jpeg;base64,'+orderItem['image']}  style={{height:'80px',maxWidth:'100%'}} /><br></br>
                                                {orderItem['name']}
                                            </td>
                                            <td style={{border:"1px solid black"}}>{orderItem['brand']}</td>
                                            <td style={{border:"1px solid black"}}>{orderItem['size']}</td>
                                            <td style={{border:"1px solid black"}}>${orderItem['price']}</td>
                                            <td style={{border:"1px solid black"}}>{orderItem['order_quantity']}</td>
                                            <td style={{border:"1px solid black"}}>${parseFloat(orderItem['price'])*parseFloat(orderItem['order_quantity'])}</td>
                                            {order['cart'][1] == 'Cart'?<div>
                                            <td >
                                              <div className="row">
                                                <div className="col s4">
                                                    {parseInt(orderItem['quantity'])===1?<>
                                                        <button onClick={()=>{removeItem(orderItem['cart_item_Id'])}} style={{width:"30px"}} disabled><b style={{textDecoration:"none"}}>-</b></button>


                                                    </>:<>
                                                    <button onClick={()=>{removeItem(orderItem['cart_item_Id'])}} style={{width:"30px"}}><b style={{textDecoration:"none"}}>-</b></button>

                                                    </>}
                                                </div>
                                                <div className="col s4"><b>{orderItem['order_quantity']}</b></div>
                                                <div className="col s4">
                                                    {parseInt(orderItem['quantity'])>0?<>
                                                        <button onClick={()=>{addItem(orderItem['cart_item_Id'])}} >+</button>

                                                    </>:<>
                                                    <button onClick={()=>{addItem(orderItem['cart_item_Id'])}} disabled>+</button>

                                                    </>}
                                                </div>
                                                
                                                
                                              </div>
                                            <form  onSubmit={RemoveCart} style={{marginTop:"70px"}}>
                                                <input type="hidden" id="orderItemId" value={orderItem["cart_item_Id"]}  />
                                                <input type="hidden" id="orderId" value={order['cart'][0]}  />
                                                <input type="hidden" id="totalPrice" value={order['totalPrice']}  />
                                                <input type="submit" value={"Remove"} className="btn" style={{width:'100%',background:"red"}}></input>
                                                </form>
                                            </td></div>:<></>}
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
export default UserCart;