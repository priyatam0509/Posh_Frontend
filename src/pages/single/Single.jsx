import {React,useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";


const Single = () => {
  const {userId } = useParams();
  const [data, setData] = useState([]);
  useEffect(() => handleGetData(userId),[]);
  
  const handleGetData = async (id) => {    
    try { 
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef); 
      // console.log('docSnap: ', docSnap.data());
      setData(docSnap.data())
      } catch(error) 
      { 
        console.log(error) 
      }
    };
   
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            {/* <div className="editButton">Edit</div> */}
            <h1 className="title">User Information</h1>
            <div className="item">
              <img
                src={data.img}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{data.firstname} {data.lastname}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                     <span className="itemValue">{data.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Gender:</span>
                    <span className="itemValue">{data.gender}</span>
                </div>                
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                      <span className="itemValue">{data.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                    {data.address}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Attendence" />
          </div>
        </div>
        <div className="bottom">
        <h1 className="title">Client Subscription Details</h1>
          <List/>
        </div>
      </div>
    </div>
  );
};

export default Single;
