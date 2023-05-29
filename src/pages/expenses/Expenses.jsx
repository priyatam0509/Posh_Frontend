import "./expenses.scss";
import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
// import Email from "../../pages/email/Email";
import axios from "axios";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import Grid from '@mui/material/Grid';
import { DataGrid } from "@mui/x-data-grid";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import dateFormat, { masks } from "dateformat";
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers-pro';
// import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
    collection,
    getDoc,
    where,
    deleteDoc,
    documentId,
    doc,
    serverTimestamp,
    setDoc,
    onSnapshot,
    query,
    updateDoc,
    add,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";



const Expenses = () => {
    const [data, setData] = useState([]);
    const [expenseAmount, setExpenseAmount] = useState('');
    const [sucessMsg, setSuccessMsg] = useState('');
    const [description, setDescription] = useState('');
    const [expenseDate, setExpenseDate] = useState(new Date());
  
    let updateExpenseDate = dateFormat(expenseDate, 'dd/mm/yyyy');



    useEffect(() => {
        // LISTEN (REALTIME)
        const unsub = onSnapshot(
          collection(db, "expenses"),
          (snapShot) => {
            let list = [];
            snapShot.docs.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() });
            });
            console.log('list: ', list);
            setData(list);
          },
          (error) => {
            console.log(error);
          }
        );
    
        return () => {
          unsub();
        };
      }, []);
// const expenseDataTableList = async() =>{
//     const expensesDataList = query(
//         collection(db, "expenses"),
//       );
//       const updatedExpensesDataList = await getDocs(expensesDataList);
//       console.log('updatedExpensesDataList: ', updatedExpensesDataList.data());
//   }
//     expenseDataTableList();
    

     const userColumns = [
        // { field: "id", headerName: "ID", width: 250 },
        {
          field: "expenseDate",
          headerName: "Date",
          width: 300,
        },
        {
          field: "expenseDescription",
          headerName: "Description",
          width: 500,
        },
        {
          field: "expenseAmount",
          headerName: "Amount",
          width: 250,
        },

      ];

    //   const dataList = updatedSubscriptionList.docs;

    const discriptionExpense =(event)=>{
        setDescription(event.target.value);

    }
    const ExpenseAmountValue =(event)=>{
        setExpenseAmount(event.target.value);

    }
    const createGuid = () => {  
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
           var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);  
           return v.toString(16);  
        });  
     }  
     
       
     let expenseId = createGuid();

   
    const submitExpenses = async() => {
        if(description.length !=0 && expenseAmount.length !=0){
          const expenseData = {
              expenseDescription: description,
              expenseAmount:expenseAmount,
              expenseDate : updateExpenseDate,
          }
          try {
              const expenseTableValue =await setDoc(doc(db, "expenses",expenseId), {
                ...expenseData,
                timeStamp: serverTimestamp(),
              });
            } catch (err) {
              console.log(err);
            }
            setSuccessMsg('Expenses store successfully!!!!');
            setTimeout(() => {  
              setSuccessMsg('');
              setDescription('');
              setExpenseAmount('');
              setExpenseDate(new Date());
          }, 2000);
        };
   } 

 
    return (
        <div className="new">
          <Sidebar />
          <div className="newContainer">
            <Navbar />
            <Box className="margin-20" sx={{ flexGrow: 1, minWidth: 275, minWidth: 500}}>
                <h3 className="expensesHeadline">Expenses Detail</h3>
            {/* <Card className ="cardHeight" variant="outlined"> */}
            <CardContent className="borderCustomCss container">
            <div className="msgCustomCss">{sucessMsg}</div>
               <Grid container spacing={2}>
                    <Grid item xs={4}>               
                        {/* <TextField id="standard-basic" type="text" label="Description" variant="standard" onChange={discriptionExpense}  value = {description} required/> */}
                        <TextField id="standard-basic" type="text" label="Description" value ={description} onChange={discriptionExpense}   variant="standard" required/>
                    </Grid>
                    <Grid item xs={4}>

                    <TextField id="" type="number" label="Expenses" variant="standard"value ={expenseAmount} onChange={ExpenseAmountValue}  required/>

                    </Grid>
                    <Grid item xs={4}>
                        <DatePicker className="dateCustomCss" value={expenseDate} onChange={setExpenseDate}  minDate = {new Date()}/>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                <Grid className="text-Center"  item xs={12}>
                {/* <CardActions> */}
                    <button className="submit-Btn" onClick={(e) => submitExpenses()}>
                        Submit
                        </button>
                {/* </CardActions> */}
                    </Grid>
                    </Grid>
                </CardContent>

                    <div className="datatable">
                    <div className="datatableTitle text-center">
                        Expenses List
                    </div>
                    <DataGrid
                        className="datagrid"
                        rows={data}
                        columns={userColumns}
                        pageSize={9}
                        rowsPerPageOptions={[9]}
                        checkboxSelection
                    />
                    </div>                    
                {/* </Card> */}
                </Box>

            </div>
        </div>
      );
};

export default Expenses;
