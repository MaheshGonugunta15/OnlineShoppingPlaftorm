import { Link } from "react-router-dom";

function AdminHead(){
    return(
        <>
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        <nav style={{background:"black"}}>
          <div class="nav-wrapper">
            <ul class="left hide-on-med-and-down" style={{fontWeight:"40px"}}>
              <li><Link to={"/adminHome"}  style={{fontSize:"20px"}}><b>Admin Home</b></Link></li>
              {/* <li><Link to={"/categories"}  style={{fontSize:"20px"}}><b>Categories</b></Link></li> */}
              <li><Link to={"/shoes"}  style={{fontSize:"20px"}}><b>Shoes</b></Link></li>
              <li><Link to={"/orders?status=ordered"}  style={{fontSize:"20px"}}><b>Orders</b></Link></li>
              <li><Link to={"/orders?status=history"}  style={{fontSize:"20px"}}><b>History</b></Link></li>
              <li><Link to={"/logout"}  style={{fontSize:"20px"}}><b>Logout</b></Link></li>
            </ul>
          </div>
        </nav>
        </>
    )
}
export default AdminHead;