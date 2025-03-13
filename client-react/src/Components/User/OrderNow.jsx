import { useNavigate } from "react-router-dom";
import UserHead from "./UserHead";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
const rest = require("../../EndPoints")

function OrderNow(){
    
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let orderId = params.get('orderId');
    let totalPrice = params.get('totalPrice');
    const[user,setUser] = useState([])
    const navigate = useNavigate([])
    const header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }

   

    const PayAmountAction  =e =>{
        e.preventDefault();
        let card_name = document.getElementById("card_name").value;
        let card_number = document.getElementById("card_number").value;
        let expire_date  =document.getElementById("expire_date").value;
        let cvv = document.getElementById("cvv").value;


       
        if(card_number.length!=16){
            alert("Card Number Should be 16")
            e.preventDefault();
            return 
        }

        if(expire_date.length!=5){
            alert("Invalid Expire Date")
            e.preventDefault();
            return 
        }

        if(cvv.length!=3){
            alert("Invalid CVV")
            e.preventDefault();
            return 
        }


       
        
        let payment = {
            "cardName":card_name,
            "cardNumber":card_number,
            "expDate":expire_date,
            "cvv":cvv,

        }
        axios.get(rest.endPointPayAmount+"?orderId="+orderId+"&totalPrice="+totalPrice,header).then(response=>{
            alert(response.data.message)
            navigate("/orders?status=ordered")
        })
        .catch(e=>{
            console.log(e);
        })



    }
    return(
        <>
        <UserHead/>
        <div className="container-fluid" style={{marginTop:"5px"}}>
            
            <div className="row " style={{marginTop:'30px'}}>
                <div className="col s4">
                    <div className="card" style={{padding:"15px"}}>
                       <div className="">Total Price : <b>${parseFloat(totalPrice)}</b></div>
                    </div>
                </div>
                <div className="" >
                <div className="col s4 card" style={{padding:"20px"}}>
                <form onSubmit={PayAmountAction}>
                    <div class="h4 mt-3" style={{textAlign:'center'}}>Payable Amount : <b><h5>${parseFloat(totalPrice)}</h5></b></div>
                    <div class="mt-3">
                        <label>Name On Card</label>
                        <input type="text" name="card_name" id="card_name" placeholder="Card holder_name" class="form-control"/>
                    </div>
                    <div class="mt-3">
                        <label>Card Number</label>
                        <input type="number" name="card_number" id="card_number" placeholder="Card Number" class="form-control" />
                    </div>
                    <div class="mt-3">
                        <label>Expire Date</label>
                        <input type="text" name="expire_date" id="expire_date" class="form-control" placeholder="Expire Date"/>
                    </div>
                    <div class="mt-3">
                        <label>CVV</label>
                        <input type="text" name="cvv" id="cvv" class="form-control" placeholder="Enter CVV"/>
                    </div>
                    
                    <div class="mt-3">
                        <input type="submit" value="Pay & Order" class="btn " style={{background:"blue",width:"100%"}} />
                    </div>
                </form>
                </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default OrderNow;