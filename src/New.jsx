import React, { useEffect, useState } from "react";
import './New.css';
import { setDoc, doc, query, getDocs, where, getDoc, documentId } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { dataCollection, app } from "./firebase.jsx"
import { useParams } from "react-router";

export default function New() {
    const param = useParams()
    // console.log(param.id);

    const [editMode, setEditMode] = useState(false);
    const [QualList, setQualList] = useState([]);
    const [imageUpload, setImageUpload] = useState(null);
    const [uploadresume, setResumeUpload] = useState(null);
    const storage = getStorage(app);

    const [users, setusers] = useState({
        name: "",
        address: "",
        contact: "",
        email: "",
        dob: "",
        resume: "",
        image: "",
        qualification: [],
        userid: crypto.randomUUID()
    });

    //fetching the data of edit user.
    useEffect(() => {
        const FetchDataOfUser = async () => {
            if (param.id) {
                console.log("fetching user details...")
                const Query = query(dataCollection, where("userid", "==", param.id));
                const QuerySnapshot = await getDocs(Query);
                const dataArray = [];
                QuerySnapshot.forEach(doc => {
                    dataArray.push(doc.data());
                });
                if (dataArray.length > 0) {
                    setusers(dataArray[0]);
                    // console.log(users.image + "\n" + dataArray[0]);
                    setQualList(users.qualification || []);
                    setEditMode(!editMode);
                    console.log("user details fetched.")
                } else {
                    console.error("User not found with the provided ID");
                }
            }
        };
        FetchDataOfUser();
    }, [param.id])

    //listing the existing qualification fields or edit user.
    useEffect(() => {
        setQualList([...users.qualification]);
    }, [users])

    //Adding and deleting qualification fields.
    const AddField = () => {
        console.log(QualList)
        setQualList([...QualList, ""])
    }

    const RemoveField = (Qual, index) => {
        let list = []
        for (let i = 0; i < QualList.length; i++) {
            if (i != QualList.indexOf(Qual)) {
                list.push(QualList[i])
                console.log(QualList[i])
            }
        }
        setQualList(list);
        index = index + 1;
    }

    const handleQual = (e, index) => {
        const list1 = [...QualList]
        list1[index] = e.target.value.trim()
        setQualList(list1)
        console.log(QualList)
    }

    //handling the chaning event of input text fields.
    const handleChange = (e) => {
        // console.log(typeof(e.target.value));
        let name, value;
        if (e.target.name && e.target.value) {
            name = e.target.name;
            value = e.target.value;
            setusers({
                ...users,
                [name]: value
            });
        }
    }

    //handling image changing.
    const handleImageChange = async (e) => {
        let profilePic = document.getElementById("profile-img");
        if (editMode) {
            console.log("deleting previous image...");
            const delimageRef = ref(storage, `images/${users.userid}`);
            await deleteObject(delimageRef);
            console.log("previous image is deleted.")
        }
        if (e.target.files && e.target.files[0]) {
            profilePic.src = URL.createObjectURL(e.target.files[0]);
            setImageUpload(e.target.files[0])
        }
    }

    //handling resume chaning.
    const handleResumeChange = async (e) => {
        if (editMode) {
            console.log("previous pdf is deleting...");
            const delResumeRef = ref(storage, `resume/${users.userid}`);
            await deleteObject(delResumeRef);
            console.log("previous pdf is deleted.");
        }
        if (e.target.files && e.target.files[0]) {
            setResumeUpload(e.target.files[0])
        }
    }

    //loading and making the url link for resume and profile image.
    const LoadLink = async () => {
        try {
            // let randomID = crypto.randomUUID();
            let randomID = users.userid != "" ? users.userid : crypto.randomUUID();  //use users.userid in place of randomID
            let ImgDownloadUrl, ResumeDownloadUrl;

            if (imageUpload) {
                const imageRef = ref(storage, `images/${randomID}`);
                await uploadBytes(imageRef, imageUpload);
                ImgDownloadUrl = await getDownloadURL(imageRef);
                console.log("Image URL: " + ImgDownloadUrl);
            } else {
                ImgDownloadUrl = users.image;
            }

            if (uploadresume) {
                const ResumeRef = ref(storage, `resume/${randomID}`);
                await uploadBytes(ResumeRef, uploadresume);
                ResumeDownloadUrl = await getDownloadURL(ResumeRef);
                console.log("Resume URL: " + ResumeDownloadUrl);
            } else {
                ResumeDownloadUrl = users.resume;
            }

            return {
                ImgDownloadUrl,
                ResumeDownloadUrl,
                // randomID
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //final submiting or updaing the data.
    const submitData = async () => {
        try {
            if (!editMode && (!users.name || !users.contact || !users.address || !users.dob || !users.email ||!users.image || !users.resume || QualList.length == 0)){
                alert("please fill all the fields :)");
                return;
            }

            let ImgDownloadUrl, ResumeDownloadUrl;
            // console.log(imageUpload + "\n" + uploadresume);
            let result = await LoadLink();
            ImgDownloadUrl = result.ImgDownloadUrl;
            ResumeDownloadUrl = result.ResumeDownloadUrl;
            // randomID = result.randomID;

            const userToUpdate = {
                ...users,
                image: ImgDownloadUrl,
                resume: ResumeDownloadUrl,
                // userid: randomID,
                qualification: QualList
            };

            // Check if there are changes in edit mode
            const hasChanges = JSON.stringify(users) !== JSON.stringify(userToUpdate);
            
            if (editMode && hasChanges) {
                // in edit mode this condition runs
                setusers(userToUpdate);
                const docRef = doc(dataCollection, param.id);
                await setDoc(docRef, userToUpdate);
                alert("Data updated and added to firestore :)");
            } else if (!editMode){
                // for making new record this condition runs
                setusers(userToUpdate);
                const docRef = doc(dataCollection, users.userid);
                await setDoc(docRef, userToUpdate);
                alert("Data added to firestore :)");
            } else {
                alert("no changes has been made.");
            }

            // Clear form data after submission
            setusers({
                name: "",
                address: "",
                contact: "",
                email: "",
                dob: "",
                resume: null,
                image: null,
                qualification: []
            });

        } catch (error) {
            console.error("Error adding/updating data to Firestore: ", error);
        }
    };

    return (
        <div className="new-record">
            <div className="details">
                <div className="personal-details">
                    <div className="field">
                        <h3>Name:-</h3>
                        <input type="text" name="name" id="name" onChange={handleChange} value={users.name} />

                    </div>
                    <div className="field">
                        <h3>Address:-</h3>
                        <input type="text" name="address"
                            id="address" onChange={handleChange} value={users.address}
                        />
                    </div>
                    <div className="field">
                        <h3>contact:-</h3>
                        <input type="number" name="contact"
                            id="contact" onChange={handleChange} value={users.contact}
                        />
                    </div>
                    <div className="field">
                        <h3>Email ID :-</h3>
                        <input type="email" name="email"
                            id="email" onChange={handleChange} value={users.email}
                        />
                    </div>
                    <div className="field">
                        <h3>D.O.B :-</h3>
                        <input type="date" name="dob" max="3000-12-31"
                            id="dob" onChange={handleChange} value={users.dob}
                        />
                    </div>
                    <div className="field-qualification">
                        <div className="flex-field">
                            <h3>Qualification :-</h3>
                            <button className="plus-btn" onClick={() => AddField()}> + </button>
                        </div>
                        <div id="add-qual">
                            {QualList.map((Qualification, index) => {
                                return (
                                    <div id="qualification" key={index}>
                                        <input type="text" name="qualification" value={Qualification} id={`${index}`} onChange={(e) => { handleQual(e, index) }} />
                                        {QualList.length >= 0 && <img src="https://img.icons8.com/?size=512&id=7Tnx21L5k1yA&format=png" alt="cross_icon" id="delete-qual" onClick={() => RemoveField(Qualification, index)} />}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="field">
                        <h3>Resume:-</h3>
                        <input type="file" name="resume" id="pdf" onChange={(e) => { handleResumeChange(e) }} accept="application/pdf" />
                    </div>
                </div>
                <div className="person-image">
                    {/* <img src="./no profile icon_0.webp" alt="" id="profile-img" name="image" onChange={(e) => { setImageUpload(e.target.files[0]); }} /> */}
                    <img src={users.image != "" ? users.image : "./no profile icon_0.webp"} alt="" id="profile-img" name="image" />
                    <div className="image-upload">
                        <input type="file" name="Image" id="file" onChange={(e) => handleImageChange(e)} accept="image/*" />
                        <label htmlFor="file">Upload Image</label>
                    </div>
                </div>
            </div>
            <div className="sub-del-btn">
                <button className="submit" onClick={submitData}>{editMode ? "Update" : "Submit"}</button>
                {/* <button className="delete">Delete</button> */}
            </div>
        </div>
    )
}