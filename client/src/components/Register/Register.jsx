import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import LoadingSpinner from '../LoadingSpinner'


const Register = () => {

  const BASE_URL = 'https://shopscout-production-7795.up.railway.app';
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name:'',
    email:'',
    password:'',
  })
  
  const onChangeInput = (e)=> {
    const {name, value} = e.target
    setUser({...user,[name]:value})
  }
  
  const registerSubmit = async e => {
    e.preventDefault()
  
    try{
      setLoading(true)
      await axios.post(`${BASE_URL}/user/register`, {...user}, { withCredentials: true })

      

      const res = await axios.post(`${BASE_URL}/user/login`, {...user}, { withCredentials: true })
      localStorage.setItem('firstLogin', true)
      localStorage.setItem('userEmail', user.email)

      window.location.href = '/'
  
  
    }
    catch(err){
      alert(err.response.data.msg)
    }
    finally{
      setLoading(false)
    }
}

  return (
    <>
    {loading && <LoadingSpinner />}
    <div className='register-page'>
    <h2>Register</h2>
      <form onSubmit={registerSubmit}>
        <input type='name' placeholder='Name' name='name' value={user.name} required onChange={onChangeInput}></input>
        <input type='email' placeholder='Email' name='email' value={user.email} required onChange={onChangeInput}></input>

        <input type='password' placeholder='Password' name='password' value={user.password} required onChange={onChangeInput}></input>

        <div className='row'>
          <button type='submit'>Register</button>
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
    </>
  )
}

export default Register