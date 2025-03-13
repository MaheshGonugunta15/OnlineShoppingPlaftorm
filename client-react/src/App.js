import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import AdminLogin from './Components/AdminLogin';
import CustomerLogin from './Components/CustomerLogin';
import UserRegistration from './Components/UserRegistration';
import AdminHome from './Components/Admin/AdminHome';
import Logout from './Logout';
import Categories from './Components/Admin/Categories';
import EditCategory from './Components/Admin/EditCategory';
import Shoes from './Components/Admin/Shoes';
import GetshoeDetails from './Components/Admin/GetshoeDetails';
import UserHome from './Components/User/UserHome';
import WishLists from './Components/User/WishLists';
import UserCart from './Components/User/UserCart';
import OrderNow from './Components/User/OrderNow';
import Orders from './Components/User/Orders';
import GiveRating from './Components/User/GiveRating';
import Transactions from './Components/User/Transactions';
import ReturnShoes from './Components/Admin/ReturnShoes';
import EditProduct from './Components/Admin/EditProduct';
import Reviews from './Components/User/Reviews';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
      <Route path='/' Component={Home} />
      <Route path='/adminLogin' Component={AdminLogin} />
      <Route path='/userLogin' Component={CustomerLogin} />
      <Route path='/userReg' Component={UserRegistration} />
      <Route path='/adminHome' Component={AdminHome} />
      <Route path='/logout' Component={Logout} />
      <Route path='/categories' Component={Categories} />
      <Route path='/editCategory' Component={EditCategory} />
      <Route path='/shoes' Component={Shoes} />
      <Route path='/getshoeDetails' Component={GetshoeDetails} />
      <Route path='/userHome' Component={UserHome} />
      <Route path='/wishLists' Component={WishLists} />
      <Route path='/userCart' Component={UserCart} />
      <Route path='/orderNow' Component={OrderNow} />
      <Route path='/orders' Component={Orders} />
      <Route path='/giveRating' Component={GiveRating} />
      <Route path='/transactions' Component={Transactions} />
      <Route path='/returnShoes' Component={ReturnShoes} />
      <Route path='/editProduct' Component={EditProduct} />
      <Route path='/reviews' Component={Reviews} />
      
      
      </Routes>
    </div>
   </Router>
  );
}

export default App;
