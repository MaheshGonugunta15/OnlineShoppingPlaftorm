import { useEffect, useState } from "react";
import UserHead from "./UserHead";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const rest = require("../../EndPoints")

function UserHome() {
    const navigate = useNavigate("")
    const [shoes, setShoes] = useState([])
    const [categoryId, setCategoryId] = useState("")
    const [searchKeword, setSearchKeword] = useState("")
    const [categories2, setCategories2] = useState([])
    const header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }

  
    useEffect(() => {
        axios.get(rest.endPointViewShoes + "?searchKeword=" + searchKeword, header)
            .then(response => {
                console.log(response.data);
                setShoes(response.data.shoes)
            })
            .catch(e => {
                console.log(e);
            })
    }, [categoryId, searchKeword])

    const getShoeDetails = (productId, categoryId) => {
        navigate("/getshoeDetails?productId=" + productId + "&categoryId=" + categoryId)
    }
    const WishLists = e => {
        e.preventDefault();
        navigate("/wishLists")
    }
    const SearchShoe = e =>{
        e.preventDefault();
        let searchKeword = document.getElementById("searchKeword").value;
        setSearchKeword(searchKeword)
    }

    const Cart = e =>{
        e.preventDefault();
        navigate("/userCart")
    }
    return (
        <>
            <UserHead />
            <div className="container-fluid" style={{ marginTop: "px" }}>
                
                    <div className="row card" style={{background:"#F8F8FF"}}>
                    <form onSubmit={SearchShoe}>
                        <div className="col s2">
                            <input placeholder="Size/Color/Name/Brand" id="searchKeword" type="text" className="validate " style={{ color: "#cccc", padding: "1px", border: "1px solid #cccc" }} />
                        </div>
                       
                        <div className="col s2">
                        <input  type="submit"  className="btn" value={"Search"} style={{width:"100%",marginTop:"5px",background:"#2196f3"}} />

                        </div>
                        </form>
                        <div className="col s2"></div>
                        <div className="col s2">
                            <form onSubmit={WishLists}>
                                <input type="submit" value={"WishList"} className="btn" style={{width:"50%",marginTop:"5px",background:"#FA8072"}}></input>
                            </form>
                        </div>
                        <div className="col s2">
                            <form onSubmit={Cart}>
                                <input type="submit" value={"Cart"} className="btn" style={{width:"50%",marginTop:"5px",background:"#FA8072"}}></input>
                            </form>
                        </div>
                    </div>
               
                <div className="row" style={{marginTop:"60px"}}>
                    {shoes.map((shoe, index) =>
                        <div className="col s2">
                            <div class="card" >
                                <div class="card-image">
                                    <div className="image-container" >
                                        <img src={'data:image/jpeg;base64,' + shoe['image']} style={{ maxWidth: "100%", height: "130px", display: "block" }} alt="image" />
                                        <div class="overlay-text" style={{ position: "absolute", top: "70%", left: "50%", transform: "translate(-50%, -50%)", background: "black", color: "white", padding: "5px", fontSize: "20px", width: "80%", textAlign: "center", fontWeight: "15px" }}><button onClick={() => { getShoeDetails(shoe['shoeId'], shoe['categoryId']) }} style={{ textDecoration: "none", background: "white" }}><b>{shoe['name']}</b></button></div>
                                    </div>
                                </div>
                                <div class="card-content">
                                    <div className="row">
                                        <div className="col s6">
                                            <div className="">$ <b>{shoe['price']}</b></div>
                                        </div>
                                        <div className="col s6">
                                            <div className=""><b>{shoe['brand']}</b></div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
export default UserHome;