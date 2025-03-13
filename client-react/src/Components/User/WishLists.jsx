import { useNavigate } from "react-router-dom";
import UserHead from "./UserHead";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
const rest = require("../../EndPoints")

function WishLists() {
    const navigate = useNavigate("")
    const[count,setCount] = useState(0)
    const [wishLists, setWishLists] = useState([])
    const header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }
   

    useEffect(() => {
        axios.get(rest.endPointUserWishLists, header)
            .then(response => {
                setWishLists(response.data['wishLists'])
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            })
    }, [count])

    const AddToCart = e => {
        e.preventDefault();
        let quantity = e.target[0].value;
        let productId = e.target[1].value;

        axios.get(rest.endPointUserAddToCart + "?productId=" + productId + "&quantity=" + quantity, header)
            .then(response => {
                console.log(response.data);
                alert(response.data)
                navigate("/userCart")

            }).catch(e => {
                console.log(e);
            })


    }
    const RemoveWishListitem = e =>{
        e.preventDefault();
        let wishListId = e.target[0].value;
        axios.get(rest.endPointRemoveWishListItem + "?wishListId=" + wishListId, header)
        .then(response => {
            alert(response.data.message)
            setCount(count+1)

        }).catch(e => {
            console.log(e);
        })
    }
    return (
        <>
            <UserHead />
            <div className="container-fliud" style={{ marginTop: "5px" }}>
                <div className="" style={{ textAlign: "center" }}><h3>WishList Shoes</h3></div>
                <div className="row" style={{ marginTop: "60px" }}>
                    {wishLists.map((wishList, index) =>
                        <div className="col s3">
                            <div class="card" >
                                <div class="card-image">
                                    <div className="image-container" >
                                        <img src={'data:image/jpeg;base64,' + wishList['image']} style={{ maxWidth: "100%", height: "170px", display: "block" }} alt="image" />
                                        <div class="overlay-text" style={{ position: "absolute", top: "70%", left: "50%", transform: "translate(-50%, -50%)", background: "black", color: "white", padding: "5px", fontSize: "20px", width: "80%", textAlign: "center", fontWeight: "15px" }}><b>{wishList['name']}</b></div>
                                    </div>
                                    <div className="" style={{ textAlign: "center" }}>{wishList['categoryId']}</div>

                                </div>
                                <div class="card-content">
                                    <div className="row">
                                        <div className="col s6">
                                            <div className="">$ <b>{wishList['price']}</b></div>
                                        </div>
                                        <div className="col s6">
                                            <div className=""><b>{wishList['brand']}</b></div>
                                        </div>
                                        <div className="col s6">
                                            <div className="" style={{ marginTop: "5px" }}>Available : <b>{wishList['quantity']}</b></div>
                                        </div>
                                        <div className="col s6">
                                            <div className="" style={{ marginTop: "5px" }}>Size : <b>{wishList['size']}</b></div>
                                        </div>
                                        <div className="col s6">
                                            <div className="" style={{ marginTop: "5px" }}>Color : <b>{wishList['color']}</b></div>
                                        </div>
                                       
                                        
                                        
                                    </div>
                                    <form onSubmit={AddToCart}>
                                            <div className='row' >
                                            <div className="">
                                                <div className='col s5' style={{ marginTop: "25px" }}>
                                                    <input type='number' id='quantity' placeholder="Quantity" min={1} className='form-control' required max={wishList['quantity']}></input>
                                                    <input type='hidden' id='productId' value={wishList['shoeId']}></input>
                                                </div>
                                                <div className='col s5 mt-1' style={{ marginTop: "25px" }}>
                                                    <input type='submit' value={"Add To Cart"} className='btn' style={{ fontSize: "14px", background: "#ff1744", marginTop: "10px"}}></input>
                                                </div>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="">
                                            <form onSubmit={RemoveWishListitem}>
                                                <input type="hidden" value={wishList['wishListId']} id="wishListId"></input>
                                                <input type="submit" value={"Remove"} className="btn" style={{width:"100%",marginTop:"5px"}}></input>
                                            </form>
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
export default WishLists;