import axios from "axios";
import { useRef, useState, useEffect } from "react";

const ProtectedPage = ({token}) =>{
    const isRun = useRef(false);
    const [data, setData] = useState('')

    const config = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    console.log(config)
    const fetchData = async () =>{
        const response = await axios.get('http://localhost:3004/hello', config)
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

export default ProtectedPage