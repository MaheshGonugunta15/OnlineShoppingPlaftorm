import AdminHead from "./AdminHead";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const rest = require("../../EndPoints")
function EditProduct(){
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let productId = params.get('productId');
    const navigate = useNavigate([])
    const [shoes, setShoes] = useState([])
    const header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }

    useEffect(() => {
        axios.get(rest.endPointGetProductByCategory+"?productId="+productId, header)
            .then(response => {
                console.log(response.data);
                
                document.getElementById("price").value=response.data.shoes[0][3];
                document.getElementById("quantity").value=response.data.shoes[0][4];
                setShoes(response.data.shoes)
            })
            .catch(e => {
                console.log(e);
            })
    }, [])

    const EditProductAction =e=>{
        e.preventDefault();
        let price  = document.getElementById("price").value;
        let quantity = document.getElementById("quantity").value;
        axios.get(rest.endPointUpdateProduct+"?price="+price+"&quantity="+quantity+"&productId="+productId, header)
        .then(response => {
           alert(response.data.message)
           
           navigate("/shoes")
        })
        .catch(e => {
            console.log(e);
        })



    }
    return(
        <>
        <AdminHead/>
        <div className="container-fluid" style={{marginTop:"50px"}}>
            <div className="row">
                <div className="col s4"></div>
                <div className="col s4">
                    <div className="card" style={{padding:"20px"}}>
                        <div className="" style={{textAlign:"center"}}>Edit </div>
                    <form onSubmit={EditProductAction}>
                                <div class="input-field" >
                                    <input placeholder="Price" name="price" id="price" type="number" min={1} className="validate " style={{ color: "black", border: "1 px solid #ccc" }} required />
                                </div>
                                <div class="input-field" >
                                    <input placeholder="Quantity" name="Quantity" id="quantity" type="number" min={1} className="validate " style={{ color: "black", border: "1 px solid #ccc" }} required />
                                </div>
                               
                                <input type="submit" value={"Update"} className="btn " style={{ backgroundColor: "#00b0ff", width: "100%" }}></input>

                            </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default EditProduct;