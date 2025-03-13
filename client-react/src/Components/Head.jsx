import { Link } from "react-router-dom"


function Head(){
    
    return(
        <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        <nav style={{background:"black"}}>
          <div class="nav-wrapper">
            <ul class="left hide-on-med-and-down" style={{fontWeight:"40px"}}>
              <li><Link to={"/"}  style={{fontSize:"20px"}}><b>Home</b></Link></li>
              <li><Link to={"/adminLogin"}  style={{fontSize:"20px"}}><b>Admin</b></Link></li>
              <li><Link to={"/userLogin"}  style={{fontSize:"20px"}}><b>User</b></Link></li>
            </ul>
          </div>
        </nav>
       
        </>
    )
}
export default Head