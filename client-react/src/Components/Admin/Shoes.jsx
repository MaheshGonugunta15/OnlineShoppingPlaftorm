import AdminHead from "./AdminHead";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const rest = require("../../EndPoints")
function Shoes() {
    const navigate = useNavigate("")
    const[count,setCount] = useState([])
    const [state, setState] = useState([])
    const[categoryId,setCategoryId] = useState("")
    const[searchKeword,setSearchKeword] = useState("")
    const [categories, setCategories] = useState([])
    const [shoes, setShoes] = useState([])
    const header = {
        headers: {
            "Content-type": "Application/json",
            "Authorization": `Bearer ${Cookies.get('token')}`
        }
    }
    const fileSelectedHandler = (event) => {
        setState({
            selectedFile: event.target.files[0],
            filename: event.target.files
        })
    }

    useEffect(() => {
        axios.get(rest.endPointViewShoes+"?searchKeword="+searchKeword, header)
            .then(response => {
                console.log(response.data);
                setShoes(response.data.shoes)
            })
            .catch(e => {
                console.log(e);
            })
            
    }, [searchKeword,count])

 


    

  

    const AddShoeAction = e => {
        e.preventDefault();
        let name = document.getElementById("name").value;
        let brand = document.getElementById("brand").value;
        let price = document.getElementById("price").value;
        let quantity = document.getElementById("quantity").value;
        let size = document.getElementById("size").value;
        let color = document.getElementById("color").value;
        let about = document.getElementById("about").value;
        let categoryName = document.getElementById('categoryName').value;


        let data = new FormData()
        data.append("name", name)
        data.append("brand", brand)
        data.append("price", price)
        data.append("quantity", quantity)
        data.append("size", size)
        data.append("color", color)
        data.append("image", state.selectedFile)
        data.append("about", about)
        data.append("categoryName",categoryName)

        axios.post(rest.endPointAddShoe, data, header)
            .then(response => {
                alert(response.data.message)
                setCount(count+1)
            })
            .catch(e => {
                console.log(e);
            })



    }

    const SearchShoe = e =>{
        e.preventDefault();
        let searchKeword = document.getElementById("searchKeword").value;
        setSearchKeword(searchKeword)
        

     
        
    }

    const getShoeDetails = (productId,categoryId)=>{
        navigate("/getshoeDetails?productId="+productId+"&categoryId="+categoryId)
    }


    const EditProduct =e =>{
        e.preventDefault();
        let productId = e.target[0].value;
        navigate("/editProduct?productId="+productId)
    }
    
    return (
        <>
            <AdminHead />
            <div className="" style={{ marginTop: "40px" }}>
                <div className="row">
                    <div className="col s4">
                        <div className="card" style={{ padding: "20px" }}>
                            <div className="" style={{ textAlign: "center", fontSize: "25px" }}>Add Shoe</div>
                            <form onSubmit={AddShoeAction}>
                                <div class="input-field" >
                                    <input placeholder="Name" name="name" id="name" type="text" className="validate " style={{ color: "black", border: "1 px solid #ccc" }} required />
                                </div>
                                <div class="input-field" >
                                    <input placeholder="Brand" name="brand" id="brand" type="text" className="validate " style={{ color: "black", border: "1 px solid #ccc" }} required />
                                </div>
                                <div class="input-field" >
                                    <input placeholder="Price" name="price" id="price" type="number" min={1} className="validate " style={{ color: "black", border: "1 px solid #ccc" }} required />
                                </div>
                                <div class="input-field" >
                                    <input placeholder="Quantity" name="Quantity" id="quantity" type="number" min={1} className="validate " style={{ color: "black", border: "1 px solid #ccc" }} required />
                                </div>
                                <div class="input-field" >
                                    <input placeholder="Size" name="size" id="size" type="text" min={1} className="validate " style={{ color: "black", border: "1 px solid #ccc" }} required />
                                </div>
                                <div class="input-field" >
                                    <input placeholder="Color" name="color" id="color" type="text" min={1} className="validate " style={{ color: "black", border: "1 px solid #ccc" }} required />
                                </div>
                                <div class="input-field" >
                                    <input id="image" type="file" min={1} onChange={fileSelectedHandler} className="validate " style={{ color: "black", border: "1 px solid #ccc" }} required />
                                </div>
                                <div class="input-field">
                                <input placeholder="Category" name="categoryName" id="categoryName" type="text" min={1} className="validate " style={{ color: "black", border: "1 px solid #ccc" }} required />
                                </div>
                                <div class="input-field" >
                                    <textarea placeholder="About" name="about" id="about" className="materialize-textarea" style={{ color: "black", marginTop: "2px" }} required></textarea>
                                </div>
                                <input type="submit" value={"Add"} className="btn " style={{ backgroundColor: "#00b0ff", width: "100%" }}></input>

                            </form>
                        </div>
                    </div>
                    <div className="col s1"></div>
                    <div className="col s7">
                        <form onSubmit={SearchShoe}>
                        <div className="row">
                            <div className="col s4">
                                    <input  placeholder="Search Shoe" id="searchKeword" type="text"  className="validate " style={{ color: "black",padding:"1px",border:"1px solid #cccc"}}  />
                            </div>
                            
                            <div className="col s4">
                            <input  type="submit"  className="btn" value={"Search"} style={{width:"100%",marginTop:"3px",background:"#e040fb"}} />
                            </div>
                        </div>
                        </form>
                        <div className="row">
                            {shoes.map((shoe, index) =>
                                <div className="col s4">
                                    <div class="card" >
                                        <div class="card-image">
                                            <div className="image-container" >
                                                <img src={'data:image/jpeg;base64,'+shoe['image']} style={{maxWidth:"100%",height:"130px",display:"block"}} alt="image"  />
                                                <div class="overlay-text" style={{position:"absolute",top:"70%",left:"50%",transform:"translate(-50%, -50%)",background:"black",color: "white",padding:"5px",fontSize:"20px",width:"80%",textAlign:"center",fontWeight:"15px"}}><button onClick={()=>{getShoeDetails(shoe['productId'],shoe['categoryModel']['categoryId'])}} style={{textDecoration:"none",background:"white"}}><b>{shoe['name']}</b></button></div>
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
                                                <div className="col s6">
                                                   <div className="" style={{marginTop:"5px"}}>Available  : <b>{shoe['quantity']}</b></div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        <div className="" style={{padding:"2px"}}>
                                            <form onSubmit={EditProduct}>
                                                <input type="hidden" id="productId" value={shoe['shoeId']}></input>
                                                <input type="submit" value={"Edit"} className="btn" style={{width:"50%"}}></input>
                                            </form>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Shoes;