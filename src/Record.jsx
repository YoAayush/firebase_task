import React from "react";
import { Link } from "react-router-dom";

export default function Record(prop) {

    return (
        <>
            <tr>
                <td id="data-field">
                    <span id="person-name">{prop.data.name}</span>
                </td>
                <td>
                    <span id="person-contact">{prop.data.contact}</span>
                </td>
                <td>
                    <span id="person-email">{prop.data.email}</span>
                </td>
                <td>
                    <span className="image-btn-inside">
                        {/* <Link to={prop.data.image} target="_blank"><button id="view-image">View Image</button></Link> */}
                        <img src={prop.data.image} className="profile_img" />
                    </span>
                </td>
                <td>
                    <span className="resume-btn-inside">
                        <Link to={prop.data.resume} target="_blank"><button id="view-image">Resume</button></Link>
                    </span>
                </td>
                <td>
                    <span className="btns">
                        <Link to={`/New/${prop.data.userid}`}><button id="edit-detail">Edit</button></Link>
                        {/* <button id="edit-detail">Edit</button> */}
                        <button id="delete-row" onClick={() => prop.deleteUserDetail(prop.data.userid)}>Delete</button>
                    </span>
                </td>
            </tr>
            {/* <Routes>
                <Route
                    path="/UpdateDetail/:name"
                    element={<UpdateDetail />}
                ></Route>
            </Routes> */}
        </>
    )
}