'use client'

import axios from "axios";
import { useRef, useEffect, use, useState } from "react";

const signIn = () =>{
    const isRun = useRef(false);
    const [data, setData] = useState('')
    const fetchData = async () =>{
        const response = await axios.get('http://localhost:3004/hello')
        console.log(response.data)
        setData(response.data)
    }
        useEffect(() => {
            if(isRun.current) return
            isRun.current = true;

            fetchData()

        }, [])
    return(
        <>
        Protected page
        <p className="text-blue-300">Data from api:</p>
        {data}</>
    )
}


export default signIn