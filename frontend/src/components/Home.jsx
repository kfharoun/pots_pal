import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoginButton from './LogIn';
import LogoutButton from './LogOut';

export default function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios.get('http://localhost:8000/users/1/');
                const userData = res.data;
                setUser(userData);
                setLoading(false);
            } catch (error) {
                console.error('Cannot get user', error);
                setLoading(false);
            }
        };
        getUser();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="Home">
            <h1>✨ Welcome back, {user ? user.username : 'Guest'} ✨</h1>
            <LoginButton />
            <LogoutButton />
            <Link to="/log">Go to Daily Log</Link>
        </div>
    );
}