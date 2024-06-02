import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Row, Col, Container, } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";


const Products = () => {
  const [products, setProducts] = useState([]);
  const { sType } = useParams();



  useEffect(() => {
    getProducts();
  }, []);




  const getProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/${sType}`);
      setProducts(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // const deleteSkinType = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:5000/products/${id}`);
  //     getProducts();
  //   } catch (error) {
  //     console.log(error.message);
  //     console.log(products.id);
  //   }
  // };

  return (
    <div>
      <Container>
        <Row className="justify-content-center">
          <Col md={10} className="d-flex bg-dark align-items-center">
            <h1 className="me-auto p-2 text-white">{sType}</h1>
            <Link to={`/addproduct/${sType}`} className="btn btn-success text-white p-2" >
              Add New Products
            </Link>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md={10}>

            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama product</th>
                  <th>Artikel Product</th>
                  <th>Gambar Product</th>
                  <th>Link Product</th>
                </tr>
              </thead>
              <tbody>
                {products.map((type, index) => (
                  <tr key={type.id}>
                    <td>{type.name}</td>
                    <td>{type.email}</td>
                    <td>{type.address}</td>
                    <td>{type.telephone}</td>
                    <td>
                      <Link
                        to={`/editproduct/${type.id}`}
                        className="btn btn-success btn-sm pill"
                      >
                        Edit
                      </Link>
                      <button
                        // onClick={() => deleteUser(user.id)}
                        // className="btn btn-danger btn-sm ms-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
  <Col md={10}>
    {/* Konten lainnya */}

  </Col>
</Row>

      </Container>
    </div>
  );
};

export default Products;