import React, { useState } from 'react'
import axios from 'axios'
import { Button, Figure, Form } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'

const EditProduct = () => {

    const [nama, setNama] = useState('')
    const [artikel, setArtikel] = useState('')
    const [gambar, setGambar] = useState('')
    const [preview, setPreview] = useState('')
    const [linkProduk, setLinkProduk] = useState('')
    const { id } = useParams()
    const navigate = useNavigate()

    const loadImage = (e) => {
        const image = e.target.files[0]
        setGambar(image)
        setPreview(URL.createObjectURL(image))
    }

    const getProductById = async () => {
        const response = await axios.get(`http://api/${id}`)
        setNama(response.nama)
        setArtikel(response.artikel)
        setGambar(response.gambar)
        setLinkProduk(response.linkProduk)
    }

    const editProduct = async (e) => {
       try {
        // await axios.patch('apitopostbackend',{
        //      skinTypes: sType,
        //      productName: nama,
        //      productArticle: artikel,
        //      productImage: gambar,
        //      productUrl: linkProduk
        //  }, {
        //    headers: { 'Content-Type' : 'multipart/form-data'}
        //})
         navigate('/dashboard')
       } catch (error) {
        console.log('error');
       }
    }

    return (
        <div>
            <div className='vh-100 d-flex flex-column justify-content-center align-items-center'>
                <h1>Add Product</h1>
                <Form className='col-lg-6 border border-black border-2 rounded p-3' onSubmit={editProduct}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Produk</Form.Label>
                        <Form.Control type="text" value={nama} onChange={(e) => setNama(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Artikel</Form.Label>
                        <Form.Control type="text" value={artikel} onChange={(e) => setArtikel(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Gambar</Form.Label>
                        <Form.Control type="file" onChange={loadImage} />
                    </Form.Group>
                    {preview ? (
                        <Figure>
                            <Figure.Image
                            width={171}
                            height={180}
                            src={preview}
                            />
                        </Figure>
                    ): (
                        ''
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>link produk</Form.Label>
                        <Form.Control type="text" value={linkProduk} onChange={(e) => setLinkProduk(e.target.value)} />
                    </Form.Group>

                  

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default EditProduct