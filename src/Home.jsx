import React from "react";
import { dataCollection } from './firebase.jsx'
import { useEffect, useState } from 'react'
import { getCountFromServer } from 'firebase/firestore'
import { Link } from "react-router-dom";
import './Home.css'

export default function Home() {
    const [totalRecords, setTotalRecords] = useState(0)
    useEffect(() => {
        const fetchTotalRecords = async () => {
            try {
                const snapshot = await getCountFromServer(dataCollection)
                const countCollections = snapshot.data().count
                setTotalRecords(countCollections)
            } catch (error) {
                console.log("error is : ", error)
            }
        }
        fetchTotalRecords();// Call the async function inside useEffect
    }, []);  // Run the effect only once on component mount
    return (
        <div className="card-container">
            <div className='Home'>
                <nav className='inside-card'>
                    <div className='btn'>
                        <Link to="/New"><button>Create Record</button></Link>
                    </div>
                    <div className='btn'>
                        <Link to="/View"><button>View Record</button></Link>
                    </div>
                    <div className='txt'><h3>Total Number of Records : {totalRecords}</h3></div>
                </nav>
            </div>
        </div>
    )
}