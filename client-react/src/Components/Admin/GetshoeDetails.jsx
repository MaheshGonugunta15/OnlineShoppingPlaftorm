import AdminHead from "./AdminHead";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserHead from "../User/UserHead";
import Rating from 'react-rating-stars-component';

const rest = require("../../EndPoints")

function GetshoeDetails() {
    const navigate = useNavigate([])
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let productId = params.get('productId');
    let categoryId = params.get("categoryId");
    const [shoes, setShoes] = useState([])
    const [shoes2, setShoes2] = useState([])
    const [rating, setRating] = useState([])
    const [wishListCounnt, setWishListCounnt] = useState([])

    function getProductDetails(productId, categoryId) {
        navigate("/getshoeDetails?productId=" + productId + "&categoryId=" + categoryId)
    }



    const header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }


   



    useEffect(() => {
        axios.get(rest.endPointGetShoe + "?productId=" + productId, header)
            .then(response => {
                console.log(response.data.shoes);
                
                setShoes(response.data.shoes)
            })
            .catch(e => {
                console.log(e);
            })
    }, [productId, categoryId])
   

    const AddToWishList = e => {
        e.preventDefault();
        let productId = e.target[0].value;
        axios.get(rest.endPointAddToWishList + "?productId=" + productId, header)
            .then(response => {
                alert(response.data.message)
                navigate("/wishLists")
            })
            .catch(e => {
                console.log(e);
            })

    }


    const AddToCart = e => {
        e.preventDefault();
        let quantity = e.target[0].value;
        let productId = e.target[1].value;

        axios.get(rest.endPointUserAddToCart + "?productId=" + productId + "&quantity=" + quantity, header)
            .then(response => {
                console.log(response.data.message);
                alert(response.data.message)
                navigate("/userCart")

            }).catch(e => {
                console.log(e);
            })


    }
    const GoToWishList = e => {
        e.preventDefault();
        navigate("/wishLists")
    }

    const getReviews = (productId) =>{
        navigate("/reviews?productId="+productId)
    }

    return (
        <>

            {Cookies.get("role") === 'admin' ? <><AdminHead /></> : <></>}
            {Cookies.get("role") === 'user' ? <><UserHead /></> : <></>}
            <div className=" " style={{ marginTop: "30px" }}>
            {Cookies.get("role") === 'user' ? <>
                    <div className="end" style={{ textAlign: "end" }}>
                        {shoes['isWishListed'] == 0 ? <>
                            <form onSubmit={AddToWishList}>
                                <input type='hidden' id='productId' value={shoes['shoeId']}></input>
                                <input type="submit" value={"Add To WishList"} className="btn" style={{ fontSize: "14px", width: "10%" }}></input>
                            </form>
                        </> : <>
                            <form onSubmit={GoToWishList}>
                                <input type="submit" value={"View WishList"} className="btn" style={{ fontSize: "14px", width: "10%" }}></input>
                            </form>
                        </>}

                    </div>
                </> : <></>}

                <div className="row">
                    <div className="col s3">
                        <img
                            className="img-fluid"
                            src={'data:image/jpeg;base64,' + shoes['image']}
                            alt={shoes['brand']}
                            style={{ height: "300px", maxWidth: '100%' }}
                        />
                    </div>
                    <div className="col s5 ">
                        {shoes['categoryModel'] != undefined ? <>
                            <h4 className="text-uppercase text-muted" style={{ fontSize: "15px" }}>{shoes['categoryModel']['categoryName']}</h4>
                        </> : <></>}
                        <h1 className="display-6">{shoes['name']}</h1>
                        <p className="lead">
                            {shoes['rating']!=undefined?<>
                                <button onClick={()=>{getReviews(shoes['shoeId'])}}>
                            <Rating 
                            value={shoes['rating']} // Display the rating value
                            size={24}
                           
                        
                            edit={false} // Disable editing
                            />
                            </button>
                           
                            </>:<>
                            No Rating
                            </>}
                            
                        
                    </p>

                        <h3 className="display-6  my-4" style={{ fontSize: "28px" }}>$ <b>{shoes['price']}</b></h3>
                        <p className="lead" style={{ overflow: "auto", height: "30px" }}>{shoes['about']}</p>
                    </div>
                    <div className="col s4 py-5">
                        {shoes['categoryModel'] != undefined ? <>
                            <h4 className="text-uppercase text-muted" style={{ fontSize: "15px" }}> Color : <b>{shoes['color']}</b></h4>
                        </> : <></>}
                        <h6 className=" display-6" style={{ marginTop: "25px" }}>Size  : <b>{shoes['size']}</b></h6>

                        <h3 className="display-6  my-4" style={{ fontSize: "28px" }}>Available :  <b>{shoes['quantity']}</b></h3>
                        <h4 className=" display-6" style={{ marginTop: "25px" }}><b>{shoes['brand']}</b></h4>
                        <div className="" style={{ marginTop: "40px" }}>
                            {Cookies.get("role") === 'user' ? <>
                            {shoes['quantity']!=0?<>
                                <form onSubmit={AddToCart}>
                                    <div className='row card' style={{ padding: "10px" }}>
                                        <div className='col s5'>
                                            <input type='number' id='quantity' placeholder="Quantity" min={1} className='form-control' required max={shoes['quantity']}></input>
                                            <input type='hidden' id='productId' value={shoes['shoeId']}></input>
                                        </div>
                                        <div className='col s5 mt-1 '>
                                            <input type='submit' value={"Add To Cart"} className='btn' style={{ fontSize: "14px", background: "#ff1744", marginTop: "5px" }}></input>
                                        </div>

                                    </div>
                                </form>
                            </>:<></>}
                                
                            </> : <></>}

                        </div>

                    </div>
                    <div className="col s6 py-5">
                    </div>

                </div>
                
            </div>
        </>
    )
}
export default GetshoeDetails;