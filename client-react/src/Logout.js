import Cookies from 'js-cookie';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();
    useEffect(() => {
        Cookies.remove('token')
        Cookies.remove("role")
        navigate("/")
    })
    return (
        <div>

        </div>
    )
}
