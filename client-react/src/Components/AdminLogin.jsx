import { useState } from "react";
import Head from "./Head";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const rest = require("../EndPoints")
function AdminLogin(){
    const[email,getEmail] = useState([])
    const[password,getPassword] = useState([])
    const navigate = useNavigate([])
    
    const AdminLoginAction = e=>{
        e.preventDefault();

        let header = {
            headers: {
                "Content-type": "Application/json"
            }
        }

        let data = {
            "email":email,
            "password":password
        }
        axios.post(rest.endPointAdminLogin,data,header).then(response=>{
            console.log(response.data.token);
            if(response.data.message==='Invalid Login Details'){
                alert("Invalid Login Details");
                return;
            }else{
                Cookies.set("role","admin")
                Cookies.set("token",response.data.token)
                navigate("/adminHome")
            }
        })
        .catch(e=>{
            console.log(e);
            alert("Start  Backend Server")
        })
    }
    return(
        <>
        <div className="login-img">
        <Head/>
        
        <div className="container-fluid" style={{marginTop:"70px"}}>
             <div className="row">
                <div className="col s4"></div>
                <div className="col s4">
                    <div className="card" style={{padding:"40px"}}>
                        <div className="" style={{textAlign:"center",fontSize:"30px"}}><b>Admin Login</b></div>
                        <form onSubmit={AdminLoginAction}>
                        <div class="input-field" >
                            <input placeholder="Enter Email" name="email" onChange={e=>{getEmail(e.target.value)}} id="email" type="email" className="validate" style={{color:"black"}} required/>
                         </div>
                         <div class="input-field" >
                            <input  placeholder="Enter Password" name="password" onChange={e=>{getPassword(e.target.value)}} id="password" type="password" className="validate" style={{color:"black",marginTop:"2px"}} required/>
                         </div>
                         <input type="submit" value={"Login"} className="btn " style={{backgroundColor:"#00b0ff",width:"100px"}}></input>
                        </form>
                    </div>
                </div>
             </div>
        </div>
        </div>
        </>
    )
}
export default AdminLogin;