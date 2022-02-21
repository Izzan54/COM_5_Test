import React, {Fragment,useState,useEffect} from "react";
import {toast} from "react-toastify";

function Dashboard({setAuth}) {

    const [Name,setName] = useState("");

    // we want to get from header is token
    async function getName() {
        try {
            const response = await 
            fetch("http://localhost:5000/dashboard/",
            {
                method:"GET",
                headers:{token : localStorage.token}
            });

            const parseRes = await response.json()
            
            setName(parseRes.user_name)
        } catch (error) {
            console.error(error.message)
        }
    };

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
        toast.success("Logged out successfully!")
    }

    // [] = useEffect make a lot of request, 
    // going to make one request when this component is rendered 
    useEffect(() =>{
        getName();
    },[]);

    return (
            <Fragment>
                <h1>Dashboard {Name}</h1>
                <button 
                className="btn btn-primary"
                onClick={e => logout(e)}>LogOut</button>
            </Fragment>

    )
}

export default Dashboard;