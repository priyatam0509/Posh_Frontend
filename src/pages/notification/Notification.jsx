import "./notification.scss";
import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
// import Email from "../../pages/email/Email";
import axios from "axios";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import Grid from '@mui/material/Grid';
import { DataGrid } from "@mui/x-data-grid";
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
    getDocs,
    add,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";



const Notification = () => {
    const [data, setData] = useState([]);
    const [checked, setChecked] = useState(false);
    const [sendEmailValue,setSendEmailValue] = useState([]);
    const [subjectEmail, setSubjectEmail] = useState('');
    const [sucessMsg, setSuccessMsg] = useState('');
    const [multiUserEmail, setMultiUserEmail] = useState([]);
    const [multiDescription, setMultiDescription] = useState('');
    const [expenseDate, setExpenseDate] = useState(new Date());   
    
    
    useEffect(() => {

        // LISTEN (REALTIME)
        const expenseDataTableList = async() =>{
            const emailDataList = query(
                collection(db, "users"),
                );
                const updatedEmailDataList = await getDocs(emailDataList);
                let mapNewUsersEmail = updatedEmailDataList.docs.map(x=>x.data().email);
                // console.log('mapNewUsersEmail: ', mapNewUsersEmail);
                // const stringEmail = mapNewUsersEmail.toString();
                // const replaceCommaEmails = stringEmail.replaceAll(",", ";");
                // setUpdateGroupEmails(replaceCommaEmails);
                 setMultiUserEmail(mapNewUsersEmail);
            }
            expenseDataTableList();


        }, []);
        

        const sendMailobject= ()=>{

            let mailObj ={};        
            mailObj.subject=subjectEmail;
            console.log('subjectEmail: ', multiUserEmail);
            console.log('sendEmailValue: ', sendEmailValue);
            if(checked === false){
                mailObj.to = sendEmailValue;
            }else{
                mailObj.to= multiUserEmail;//["threegrowingmusketeers@gmail.com","piyushpriya34@gmail.com","ankitmaheshwari27@gmail.com","dev28kamal@gmail.com"];
            }
            // console.log('mailObj: ', mailObj);
            mailObj.mailBody=`
            <p>${multiDescription}</p>
            `;
            return mailObj;
          }
          
          const sendEmail = async (data) => {    
            let requestbody=sendMailobject(data);
            console.log("requestbody",requestbody)
            const response = await axios.post(
              "https://posh-backend.onrender.com/api/sendemailnew",
              requestbody
            );

          };        
        


    const emailMessageUser =(event)=>{

        setMultiDescription(event.target.value);

    }
    const sentEmailCheckbox =(event)=>{
        setChecked(event.target.checked);
    }
    const sendMultipleEmail =(event)=>{
        setSendEmailValue(event.target.value);
    }
    const discriptionMultipleEmail =(event)=>{
        setSubjectEmail(event.target.value);

    }
   
    const submitNotification = () => {

        if(subjectEmail && multiDescription){
            setSuccessMsg('Mail Sent successfully for all Posh Health Gym Client!!!!')
            sendEmail();
        }
        setTimeout(() => {
            setSubjectEmail('');
            setMultiDescription('');  
            setSuccessMsg('')
        }, 2000);
   } 

 
    return (
        <div className="new">
          <Sidebar />
          <div className="newContainer">
            <Navbar />
            <Box className="margin-20" sx={{ flexGrow: 1, minWidth: 275, minWidth: 500}}>
                <h3 className="expensesHeadline">Notification</h3>
            {/* <Card className ="cardHeight" variant="outlined"> */}
            <CardContent className="borderCustomCss container">
                <div className="msgCustomCss">{sucessMsg}</div>
               <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControlLabel onChange={sentEmailCheckbox}  control={<Checkbox />} label="Send Mail to All Clients" />
                       {checked == false && (<TextField id="standard-basic" className="marg-btm-10" type="email" label="Enter your Email (Ex- xxx@gmail.com, yyy@gmail.com)" variant="standard" value={sendEmailValue} onChange={sendMultipleEmail}/>)}                
                        <TextField id="standard-basic" className="marg-btm-10 marg-10" type="text" label="Enter your Subject Line.." variant="standard" value={subjectEmail} onChange={discriptionMultipleEmail} required/>
                        <TextareaAutosize id="standard-basic" className="width-100" aria-label="minimum height" minRows={3} placeholder="Enter Your Message..." value={multiDescription} onChange={emailMessageUser} variant="standard" required/>
                        {/* <TextField id="standard-basic" type="textarea" label="Description" onChange={discriptionExpense}   /> */}
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                <Grid className="text-Center"  item xs={12}>
                {/* <CardActions> */}
                    <button className="submit-Btn" onClick={(e) => submitNotification()}>
                        Notification
                        </button>
                {/* </CardActions> */}
                    </Grid>
                    </Grid>
                </CardContent>
                </Box>

            </div>
        </div>
      );
};

export default Notification;
