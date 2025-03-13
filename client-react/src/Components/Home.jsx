import { useEffect, useState } from "react";
import Head from "./Head";
import axios from "axios";
import Marquee from "react-fast-marquee";
const rest = require("../EndPoints")

function Home(){
    const [categories2, setCategories2] = useState([])
    const [shoes, setShoes] = useState([])
    const [categoryId, setCategoryId] = useState("")
    const [shoes2, setShoes2] = useState([])
    const [searchKeword, setSearchKeword] = useState("")
    const header = {
        headers: {
            "Content-type": "Application/json"
        }
    }
   
    const SearchShoe = e =>{
        e.preventDefault();
        let categoryId = document.getElementById("categoryId2").value;
        let searchKeword = document.getElementById("searchKeword").value;
        console.log(categoryId);
        setCategoryId(categoryId)
        setSearchKeword(searchKeword)
    }

    useEffect(() => {
        axios.get(rest.endPointViewShoes2+"?searchKeword=" + searchKeword, header)
            .then(response => {
                console.log(response.data);
                setShoes(response.data.shoes)
            })
            .catch(e => {
                console.log(e);
            })
    }, [categoryId, searchKeword])

    


    return(
        <>
        <div className="home-img">
        <Head/>
        <div className="container-fluid" style={{ marginTop: "" }}>
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
                        {/* <div className="col s2">
                            <form onSubmit={WishLists}>
                                <input type="submit" value={"WishList"} className="btn" style={{width:"50%",marginTop:"5px",background:"#FA8072"}}></input>
                            </form>
                        </div>
                        <div className="col s2">
                            <form onSubmit={Cart}>
                                <input type="submit" value={"Cart"} className="btn" style={{width:"50%",marginTop:"5px",background:"#FA8072"}}></input>
                            </form>
                        </div> */}
                    </div>
               
                <div className="row" style={{marginTop:"20px"}}>
                    {shoes.map((shoe, index) =>
                        <div className="col s3">
                            <div class="card" >
                                <div class="card-image">
                                    <div className="image-container" >
                                        <img src={'data:image/jpeg;base64,' + shoe['image']} style={{ maxWidth: "100%", height: "130px", display: "block" }} alt="image" />
                                        <div class="overlay-text" style={{ position: "absolute", top: "70%", left: "50%", transform: "translate(-50%, -50%)", background: "black", color: "white", padding: "5px", fontSize: "20px", width: "80%", textAlign: "center", fontWeight: "15px" }}><b>{shoe['name']}</b></div>
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
                                        <div className="col s6" style={{marginTop:"3px"}}>
                                            <div className="">Color : <b>{shoe['color']}</b></div>
                                        </div>
                                        <div className="col s6" style={{marginTop:"3px"}}>
                                            <div className="">Size : <b>{shoe['size']}</b></div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    )}
                </div>
                <div className="container">
                    <div className="row my-5 py-5">
                        <div className="d-none d-md-block">
                            <Marquee pauseOnHover={true} pauseOnClick={true} speed={50}>
                                <div className="row ">
                                    {shoes2.map((item) => {
                                        return (
                                            <div key={item['name']} className="col s4 ">
                                                <div className="" style={{ padding: "20px" }}>
                                                    <button className='card' ><img
                                                    /><img src={'data:image/jpeg;base64,' + item['image2']} height={200} width={200}></img></button>
                                                    <div className="card-body">
                                                        <h5 className="card-title">
                                                            {item['name'].substring(0, 15)}...
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Marquee>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default Home;