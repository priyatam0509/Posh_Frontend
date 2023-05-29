import {React,useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';
import "./table.scss";
import Table from "@mui/material/Table";
import dateFormat, { masks } from "dateformat";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { collection, query, where, getDocs,getDoc } from "firebase/firestore";
import { db } from "../../firebase";
// import {
//   collection,
//   getDocs,
//   getDoc,
//   deleteDoc,
//   doc,
//   onSnapshot,
// } from "firebase/firestore";
// import { db } from "../../firebase";


const List = () => {
  const [data, setData] = useState([]);
  const {userId } = useParams();
  useEffect(() => handleGetData(),[]);
  
  const handleGetData = async () => {    
    try { 
      // const docRef = doc(db, "newSubscription");
      // const docSnap = await getDoc(docRef); 
      // console.log('docSnap: ', docSnap.data());
      // setData(docSnap.data())
      // new Date(time.seconds * 1000 + time.nanoseconds/1000000)

      const newSubscriptionListData = query(
        collection(db, "newSubscription"),
        where("userid", "==", userId),
      );
      const updatedSubscriptionList = await getDocs(newSubscriptionListData);
      const dataList = updatedSubscriptionList.docs;
      //console.log("dataList",dataList)
      if(dataList && dataList.length > 0){
        let dataArrayList = dataList.map(x=>{
         let fullData = x.data();
         fullData.id=  x.id;
          let createTime = new Date(fullData.timeStamp.seconds * 1000 + fullData.timeStamp.nanoseconds/1000000);
          fullData.createTime = dateFormat(createTime, 'mm/dd/yyyy');
          return fullData;
        });
        //console.log("dataArrayList",dataArrayList)
        setData(dataArrayList);
      }



      } catch(error) 
      { 
        console.log(error) 
      }
    };

  const rows = data;
  // console.log('rows: ', rows);
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {/* <TableCell className="tableCell">ID</TableCell> */}
            <TableCell className="tableCell">Subscription Date</TableCell>
            <TableCell className="tableCell">Payment Date</TableCell>
            <TableCell className="tableCell">Amount</TableCell>
            <TableCell className="tableCell">Payment Method</TableCell>
            <TableCell className="tableCell">Expired Date</TableCell>
            <TableCell className="tableCell">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {/* <TableCell className="tableCell">{row.id}</TableCell> */}
              <TableCell className="tableCell">{row.startDate}
              </TableCell>
              <TableCell className="tableCell">{row.createTime}</TableCell>
              <TableCell className="tableCell">{row.amount}</TableCell>
              <TableCell className="tableCell">{row.payment}</TableCell>
              <TableCell className="tableCell">{row.endDate}</TableCell>
              <TableCell className="tableCell">
                <span className={`status ${row.status}`}>{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
