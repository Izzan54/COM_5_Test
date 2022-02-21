import React, {Fragment, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {Link} from "react-router-dom";
import {toast} from "react-toastify"

function Signup({setAuth}) {

    const [Inputs,setInputs] = useState({
        email:"",
        password:"",
        name:""
    });

    const {email, password, name} = Inputs;

    const onChange = (e) => {
        setInputs({...Inputs,[e.target.name] : e.target.value})
    };

    // e.preventDefault: prevent to refresh when click submit
    const onSubmitForm = async(e) => {
        e.preventDefault()

        try {

            const body = {email,password,name}

            const response = await 
            fetch("http://localhost:5000/auth/signup",
            {
                method:"POST",
                headers:{"Content-type": "application/json"},
                body:JSON.stringify(body)
            });

            const parseRes = await response.json();

            if(parseRes.token){
                localStorage.setItem("token",parseRes.token);
                setAuth(true);
                toast.success("Registered Successfully")
            } else{
                setAuth(false);
                toast.error(parseRes)
            }

            
        } catch (error) {
            console.error(error.message)
            
        }
    }

    return (
            <Fragment>
                <h1 className="text-center my-5">Signup</h1>
                <form onSubmit={onSubmitForm}>
                    <input 
                    type="email" 
                    name="email" 
                    placeholder="email"
                    className="form-control mb-3"
                    value={email}
                    onChange={e => onChange(e)}/>
                    <input 
                    type="password" 
                    name="password" 
                    placeholder="password"
                    className="form-control mb-3"
                    value={password}
                    onChange={e => onChange(e)}/>
                    <input 
                    type="text" 
                    name="name" 
                    placeholder="name"
                    className="form-control mb-3"
                    value={name}
                    onChange={e => onChange(e)}/>
                    <button className="btn btn-success btn-bloc">Submit</button>
                </form>
                <Link to="/login">Login</Link>
            </Fragment>
    )
}

export default Signup;