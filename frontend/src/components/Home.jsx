import { useState, useEffect } from "react"
import axios from 'axios'
import {Link} from 'react-router-dom'

export default function Home(){
    const [users, setUsers] = useState([])
    const [day, setDay] = useState([])

    useEffect(() => {
    const getUser = async () => {
        try { 
            const res = await axios.get('http://localhost:8000/users/1/')
            const userData = res.data
            setUsers(userData)
        } catch (error) {
            console.error('cannot get users', error)
        }
    }
        getUser()
        
    }, [])

    console.log(users)
    return (
        <div className="Home">
            <h1>✨ welcome back, {users.username} ✨</h1>

        <Link to={'/log'}>
        </Link>
        </div>
    )
}