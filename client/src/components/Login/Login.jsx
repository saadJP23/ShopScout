import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import LoadingSpinner from '../../components/LoadingSpinner'

const Login = () => {

  const BASE_URL = 'https://shopscout-production-7795.up.railway.app';

  const [loading, setLoading] = useState(false);
  
  const [user, setUser] = useState({
    email:'',
    password:'',
  })
  
  const onChangeInput = (e)=> {
    const {name, value} = e.target
    setUser({...user,[name]:value})
  }
  
  const loginSubmit = async e => {
    e.preventDefault()
  
    try{
      setLoading(true)
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
    <div className='login-page'>
    <h2>Login</h2>
      <form onSubmit={loginSubmit}>
        <input type='email' placeholder='Email' name='email' value={user.email} required onChange={onChangeInput}></input>

        <input type='password' placeholder='Password' name='password' value={user.password} required onChange={onChangeInput}></input>

        <div className='row'>
          <button type='submit'>Login</button>
          <Link to='/forget_password'>Forget Password</Link>
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
    </>
  )
}

export default Login