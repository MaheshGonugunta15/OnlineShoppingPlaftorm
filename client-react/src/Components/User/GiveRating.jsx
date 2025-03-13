import axios from "axios";
import UserHead from "./UserHead";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const rest = require("../../EndPoints")
function GiveRating(){
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let productId = params.get('productId');
    let orderItemId = params.get('orderItemId');
    const navigate = useNavigate([])
    const header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }
    const GiveRatingAction = e =>{
        e.preventDefault();
        let rating = document.getElementById("rating").value;
        let review = document.getElementById("review").value;

        let data = {
            "rating":rating,
            "review":review
        }
        axios.post(rest.endPointGiveRating+"?productId="+productId+"&orderItemId="+orderItemId,data,header)
        .then(response=>{
            console.log(response.data);
            alert(response.data.message)
            navigate("/orders?status=history")
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
                <div className="col s4"></div>
                <div className="" >
                <div className="col s4 card" style={{padding:"20px"}}>
                    <div className="" style={{textAlign:"center"}}><h6>Give Rating</h6></div>
                <form onSubmit={GiveRatingAction}>
                    <div class="mt-3">
                        <label>Rating</label>
                        <select name="rating" id="rating" class="browser-default" style={{ color: "black",padding:"10px",marginTop:"4px" }}>
                                <option value="">Choose Rating</option>
                                    <option value={"5"}>5</option>
                                    <option value={"4"}>4</option>
                                    <option value={"3"}>3</option>
                                    <option value={"2"}>2</option>
                                    <option value={"1"}>1</option>
                            </select>
                    </div>
                    <div class="mt-3" style={{padding:"20px"}}>
                        <label>Review</label>
                        <textarea name="review" id="review" placeholder="Review" class="materialize-textarea" ></textarea>
                    </div>
                    <div class="mt-3">
                        <input type="submit" value="Submit" class="btn " style={{background:"blue",width:"100%"}} />
                    </div>
                </form>
                </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default GiveRating;