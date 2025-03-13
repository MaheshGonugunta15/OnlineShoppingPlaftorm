import axios from "axios";
import Head from "./Head";
import { useNavigate } from "react-router-dom";
const rest = require("../EndPoints")
function UserRegistration(){

    const navigate = useNavigate([])

    const UserRegistrationAction = e =>{
        e.preventDefault();
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let phone = document.getElementById("phone").value;
        let password = document.getElementById("password").value;
        let address = document.getElementById("address").value;
        

        let header = {
            headers: {
                "Content-type": "Application/json"
            }
        }

        let data = {
            "name":name,
            "email":email,
            "phone":phone,
            "password":password,
            "address":address
        }
        console.log(rest.endPointUserRegistration);
        axios.post(rest.endPointUserRegistration,data,header)
        .then(response=>{
            alert(response.data.message)
            console.log(response.data.message);
            
            navigate("/userLogin")
        }).catch(e=>{
            console.log(e);
        })

    }
    return(
        <>
        <Head/>
        <div className="container-fluid" style={{marginTop:"70px"}}>
             <div className="row">
                <div className="col s4"></div>
                <div className="col s4">
                    <div className="card" style={{padding:"40px"}}>
                        <div className="" style={{textAlign:"center",fontSize:"25px"}}><b>User Registration</b></div>
                        <form onSubmit={UserRegistrationAction}>
                        <div class="input-field" >
                            <input placeholder="Enter Name" name="name"  id="name" type="text" className="validate" style={{color:"black"}} required/>
                         </div>
                        <div class="input-field" >
                            <input placeholder="Enter Email" name="email"  id="email" type="email" className="validate" style={{color:"black"}} required/>
                         </div>
                         <div class="input-field" >
                            <input placeholder="Enter Phone" name="phone"  id="phone" type="tel" className="validate" style={{color:"black"}} required/>
                         </div>
                         <div class="input-field" >
                            <input  placeholder="Enter Password" name="password"  id="password" type="password" className="validate" style={{color:"black",marginTop:"2px"}} required/>
                         </div>
                         <div class="input-field" >
                            <textarea  placeholder="Enter Address" name="address"  id="address"  className="materialize-textarea" style={{color:"black",marginTop:"2px"}} required></textarea>
                         </div>
                         <div className="" style={{textAlign:"center"}}>
                         <input type="submit" value={"Register"} className="btn " style={{backgroundColor:"#00b0ff",width:"120px"}}></input>
                         </div>
                         
                        </form>
                    </div>
                </div>
             </div>
        </div>
        </>
    )
}
export default UserRegistration;