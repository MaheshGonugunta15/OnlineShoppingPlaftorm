import { useNavigate } from "react-router-dom";
import AdminHead from "./AdminHead";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
const rest = require("../../EndPoints")

function EditCategory(){
    const navigate = useNavigate([])
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let categoryId = params.get('categoryId');
    
    const header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }


    useEffect(()=>{
        axios.get(rest.endPointViewCategoryById+"?categoryId="+categoryId,header)
        .then(response=>{
           document.getElementById("categoryName").value=response.data['categoryName']
        })
        .catch(e=>{
           console.log(e);
        })
       },[])

    const EditCategoryAction = e =>{
        e.preventDefault();
        let categoryName = document.getElementById("categoryName").value;
        console.log(categoryName);

        axios.get(rest.endPointEditCategory+"?categoryName="+categoryName+"&categoryId="+categoryId,header)
        .then(response=>{
            alert(response.data)
            navigate("/categories")
        }).catch(e=>{
            console.log(e);
        })

    }

    return(
        <>
        <AdminHead/>
        <div className="" style={{marginTop:"50px"}}>
            <div className="row">
                <div className="col s4"></div>
                <div className="col s4">
                    <div className="card" style={{padding:"20px"}}>
                        <form onSubmit={EditCategoryAction}>
                                <div class="input-field" >
                                    <input placeholder="CategoryName" name="categoryName"  id="categoryName" type="text" className="validate materialize-textarea" style={{ color: "black",border:"1 px solid #ccc"}} required />
                                </div>
                                <div className="" style={{ textAlign: "center" }}>
                                    <input type="submit" value={"Update"} className="btn " style={{ backgroundColor: "#00b0ff", width: "150px" }}></input>
                                </div>
                            </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default EditCategory;