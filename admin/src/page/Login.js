import axios from 'axios'
import { Button, Form } from 'react-bootstrap'
import {React, useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const Auth = async (e) => {
    e.preventDefault()
    try {
      // axios.post('url post api', {
      //   username,
      //   password
      // })
      navigate('/dashboard')
    } catch (error) {
      console.log('error');
    }
  }


  return (
    <div className='vh-100 d-flex flex-column justify-content-center align-items-center'>
    <h1>U TAYA ADMIN</h1>
      <Form className='col-lg-6 border border-black border-2 rounded p-3' onSubmit={Auth}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}

export default Login