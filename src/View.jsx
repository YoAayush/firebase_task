import React, { useEffect, useState } from "react";
import './View.css'
import { deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { dataCollection } from "./firebase";
import Record from "./Record";
import { storage } from "./firebase";
import { deleteObject, ref } from "firebase/storage";

export default function View() {

    const [users, setusers] = useState([])

    useEffect(() => {
        const getDataFromFirestore = async () => {
            const Query = query(dataCollection);
            const QuerySnapshot = await getDocs(Query);
            const DataArray = []
            QuerySnapshot.forEach((doc) => {
                DataArray.push(doc.data())
                // console.log(doc.data());
            })
            setusers(DataArray)
            // console.log(users)
        }
        getDataFromFirestore();
    }, [])

    const deleteUserDetail = async (docID) => { 
        try {
            // console.log(docID)
            const docRef = doc(dataCollection, docID);
            const fileref = ref(storage, `resume/${docID}`);
            const imageRef = ref(storage, `images/${docID}`);
            await deleteObject(fileref);
            await deleteObject(imageRef);
            await deleteDoc(docRef);
            console.log("user details deleted from firestore whose id is " + docID)
        } catch (error) {
            console.log("error is: ", error)
        }
    }

    const records = users.map((user) => (<Record
        data={user}
        deleteUserDetail={deleteUserDetail}
        key={user.userid}
    />))

    return (
        <div className="view-records">
            <div className="inner-records">
                <span>
                    <h1 style={{ textAlign: 'center', color: 'antiquewhite' }}>Records</h1>
                </span>
                <div className="records-box">
                    <table>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Email</th>
                                <th>Profile</th>
                                <th>Resume</th>
                                <th></th>
                            </tr>
                            {records}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}