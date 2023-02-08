import { useEffect, useState } from "react";
import {useParams, useNavigate} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function UserForm () {

    const {id} = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const {setNotification} = useStateContext();
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''

    });

    if (id) {
        useEffect( () => {
            setLoading(true);
            axiosClient.get(`/users/${id}`)
            .then(({data}) => {
                setLoading(false)
                setUser(data)
            })
            .catch(() => {
                setLoading(false)
            })
        }, [])
    }

    const onSubmit = (event) => {
        event.preventDefault();
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
            .then(() => {
                setNotification("User was successfully updated")
                navigate('/users')
            })
            .catch(err =>{
                const response = err.response;
                if(response && response.status === 422){
                    setErrors(response.data.errors);
                    
                }
            })
        } else {
            axiosClient.post('/users', user)
            .then(() => {
                setNotification("User was successfully created")
                navigate('/users')
            })
            .catch(err =>{
                const response = err.response;
                if(response && response.status === 422){
                    setErrors(response.data.errors);
                    
                }
            }) 
        }
    };

    return (
    <>
        {user.id && <h1>Update User: {user.name}</h1>}
        {!user.id && <h1>New User</h1>}

        <div className="card animated fadeInDown">           
            {loading && (
                <div className="text-center" style={{color:"hotpink"}}>Loading...</div>
            )}

                {errors && <div className="alert">
                {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
            ))} 
                </div>
            }

            {!loading && 
                <form onSubmit={onSubmit}>
                    <input value={user.name} placeholder="Name" onChange={event => setUser({...user, name: event.target.value})}/>
                    <input type="email" value={user.email} placeholder="Email" onChange={event => setUser({...user, email: event.target.value})}/>
                    <input type="password" onChange={event => setUser({...user, password: event.target.value})} placeholder="Password"/>
                    <input type="password" onChange={event => setUser({...user, password_confirmation: event.target.value})} placeholder="Password Confirmation"/>
                    <button className="btn">Save</button>
                </form>
            }

        </div>
        
    </>
    )
};