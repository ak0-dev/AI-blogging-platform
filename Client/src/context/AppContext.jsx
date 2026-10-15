import { createContext, useContext, useEffect, useState } from "react"

import axios from 'axios'

import {useNavigate} from 'react-router-dom'
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const AppContext = createContext();

export const AppPorvider = ({children}) => {

    const navigate = useNavigate();
    
    const [token, setToken] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [input, setInput] = useState("");

    const updateToken = (nextToken) => {
        setToken(nextToken)
        if (nextToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${nextToken}`
        } else {
            delete axios.defaults.headers.common['Authorization']
        }
    }

    const fetcBlogs = async()=>{
        try {
            const {data} = await axios.get('/api/blog/all')
            data.success? setBlogs(data.blogs) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        fetcBlogs();
        const token = localStorage.getItem('token')
        if(token){
            updateToken(token)
        }
    },[])

    const value = {
        axios, navigate, token, setToken: updateToken, blogs, setBlogs, input, setInput
    }

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}