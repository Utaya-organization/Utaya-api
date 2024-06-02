import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './page/Login.js';
import Products from './page/Products.js'
import Dashboard from './page/Dashboard.js';
import AddProduct from './page/AddProduct.js';
import EditProduct from './page/EditProduct.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='dashboard' element={<Dashboard/>}/>
            <Route path='products/:sType' element={<Products/>}/>
            <Route path='addproduct/:sType' element={<AddProduct/>}/>
            <Route path='addproduct/:sType' element={<AddProduct/>}/>
            <Route path='editproduct/:sType' element={<EditProduct/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
