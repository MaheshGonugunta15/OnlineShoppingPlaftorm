import { useEffect, useState } from "react";
import AdminHead from "../Admin/AdminHead";
import UserHead from "./UserHead";
import Cookies from "js-cookie";
import axios from "axios";
const rest = require("../../EndPoints")
function Reviews() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let productId = params.get('productId');
    console.log(productId);
    const [reviews, setReviews] = useState([])

    const header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }



    useEffect(() => {
        axios.get(rest.endPointProductReviews + "?productId=" + productId, header)
            .then(response => {
                console.log(response.data.reviews);
                setReviews(response.data.reviews)
            })
            .catch(e => {
                console.log(e);
            })
    }, [])
    return (
        <>
            {Cookies.get("role") === 'user' ? <><UserHead /></> : <></>}
            {Cookies.get("role") === 'admin' ? <><AdminHead /></> : <></>}
            <div className="container mt-3" style={{ marginTop: "30px" }}>
                <div className="row">
                    {reviews.map((review, index) =>
                        <div className="card " style={{ padding: "15px" }}>
                            <div className="row">
                                <div className="col s6 ">
                                    <div className="text-muted">Rating : <b>{review[1]}</b></div>
                                </div>
                                <div className="col s6">
                                    <div className="text-muted">Review On : <b>{review[5].split(".")[0].replace("T", " ").substring(0, 16)}</b></div>
                                </div>
                                <div className="col s12">
                                    <div className="" style={{fontSize:"11px"}}>Review : </div>
                                    <div className="">{review[2]}</div>
                                </div>
                            </div>
                            
                        </div>

                    )}
                </div>
            </div>
        </>
    )
}
export default Reviews;