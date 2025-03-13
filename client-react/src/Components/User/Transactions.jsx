import { useEffect, useState } from "react";
import AdminHead from "../Admin/AdminHead";
import UserHead from "./UserHead";
import Cookies  from "js-cookie";
import axios from "axios";
const rest = require("../../EndPoints")

function Transactions(){
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let orderId = params.get('orderId');
    const[payment,setPayments] = useState([])
    const header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }

    useEffect(() => {
        axios.get(rest.endPointUserPayments + "?orderId=" + orderId, header)
            .then(response => {
                console.log(response.data);
                setPayments(response.data)
            })
            .catch(e => {
                console.log(e);
            })
    }, [])
    return(
        <>
        {Cookies.get("role")==='admin'?<><AdminHead /></>:<></>}
        {Cookies.get("role")==='user'?<><UserHead /></>:<></>}
         <div className="container" style={{marginTop:'50px'}}>
         <table className="highlight" style={{border:"1px solid #ccc"}}>
                            <thead>
                                <tr>
                                    <th>Payment Id</th>
                                    <th>Amount</th>
                                    <th>Transaction Date</th>
                                    <th>Status</th>
                                    <th>Paid By</th>
                                   
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{payment['paymentId']}</td>
                                    <td>${payment['amount']}</td>
                                    <td>{payment['date']}</td>
                                    <td>{payment['status']}</td>
                                    {payment['orderModel']!=undefined?<>
                                        <td>{payment['orderModel']['userModel']['name']}</td>
                                    </>:<></>}
                                    
                                   
                                </tr>
                            </tbody>
                        </table>
         </div>
        </>
    )
}
export default Transactions;