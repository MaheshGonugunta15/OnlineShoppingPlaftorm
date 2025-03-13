import axios from "axios";
import AdminHead from "./AdminHead";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const rest = require("../../EndPoints")
function Categories() {
    const navigate = useNavigate([])
    const[categories,setCategories]= useState([])
    const[count,setCount] = useState(0)
    const header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }

    useEffect(()=>{
     axios.get(rest.endPointViewCategory,header)
     .then(response=>{
        console.log(response.data);
        
        setCategories(response.data.categories)
     })
     .catch(e=>{
        console.log(e);
     })
    },[count])

    const AddCategoryAction = e => {
        e.preventDefault();
        let categoryName = document.getElementById("categoryName").value;

        let data = {
            "categoryName": categoryName
        }

        axios.post(rest.endPointAddCategory, data, header)
            .then(response => {
                alert(response.data.message)
                setCount(count+1)
            })
            .catch(e => {
                console.log(e);
            })


    }

    const editCategory = (categoryId) =>{
        navigate("/editCategory?categoryId="+categoryId)
    }
    return (
        <>
            <AdminHead />
            <div className="" style={{ marginTop: "50px" }}>
                <div className="row">
                    <div className="col s4">
                        <div className="card" style={{ padding: "15px" }}>
                            <div className="" style={{ textAlign: "center", fontSize: "12px" }}>Add Category</div>
                            <form onSubmit={AddCategoryAction}>
                                <div class="input-field" >
                                    <input placeholder="CategoryName" name="categoryName" id="categoryName" type="categoryName" className="validate materialize-textarea" style={{ color: "black", padding: "10px", width: "100%" ,border:"1 px solid #ccc"}} required />
                                </div>
                                <div className="" style={{ textAlign: "center" }}>
                                    <input type="submit" value={"Add Category"} className="btn " style={{ backgroundColor: "#00b0ff", width: "150px" }}></input>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col s8">
                        <table className="highlight" style={{border:"1px solid #ccc"}}>
                            <thead>
                                <tr>
                                    <th>Category Id</th>
                                    <th>Category Name</th>
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                 {categories.map((category,index)=>
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{category[1]}</td>
                                    <td><button onClick={()=>{editCategory(category[0])}} className="btn" style={{background:"#b388ff"}}>
                                         Edit
                                        </button></td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Categories;