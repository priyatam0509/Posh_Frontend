import React from 'react';
import { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import axios from "axios";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Form, Link,useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import dateFormat, { masks } from "dateformat";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import Invoice from '../Invoice/invoice.jsx'
import {ReactPDF } from 'react-pdf-html';
import {storage} from "../../firebase"
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers-pro';
// import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
//import { LicenseInfo } from '@mui/x-license-pro';
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
import { db } from "../../firebase";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Datatable = () => {
  const [data, setData] = useState([]);
  const [subscribeData, setSubscribeData] = useState({});
  const [userId, setUserId] = useState();
  const [SubscribeEmail, setSubscribeEmail] = useState();
  const [userName, setUserName] = useState('');
  const [subscription, setSubscription] = useState('');
  const [payment, setPayment] = useState('');
  const [amount, setAmount] = useState('');
  // const [subscriptionPeriod, setSubscriptionPeriod] = useState();
  const [open, setOpen] = React.useState(false);
  const [renewDate, setRenewDate] = useState([new Date(), new Date()]);
  
  

  let startDate = ({renewDate}.renewDate[0]);
  let subsStartDate = dateFormat(startDate, 'mm/dd/yyyy');
  let endDate = ({renewDate}.renewDate[1]);
  let subsEndDate = dateFormat(endDate, 'mm/dd/yyyy');
  let todayNewDate = dateFormat(new Date(), 'mm/dd/yyyy')

  
  let newExpiryDate = dateFormat(subsEndDate, 'dd/mm/yyyy');
  

  const sendMailobject= (data)=>{
    //console.log("MailObjectData",data)
  let dataobj={...subscribeData,"amount":data.amount,"subscription":data.subscription,"payment":data.payment}
  let pdfObj = {
    newExpiryDate,
    todayNewDate,
    subsStartDate,
    data:dataobj
  }
    let userName=`${subscribeData.firstname} ${subscribeData.lastname}`
    let mailObj ={};
    let newExpireDate = dateFormat(endDate, 'dd/mm/yyyy');

    mailObj.subject="Subscription In POSH HEALTH CLUB";
    mailObj.to= subscribeData.email;
    mailObj.form=pdfObj;
    mailObj.mailBody=`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
      <style type="text/css">
          div.invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            font-size: 16px;
            line-height: 24px;
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #555;
          }
    
          .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
          }
    
          .invoice-box table td {
            padding: 5px;
            vertical-align: top;
          }
    
          .invoice-box table tr td:nth-child(2) {
            text-align: right;
          }
    
          .invoice-box table tr.top table td {
            padding-bottom: 20px;
          }
    
          .invoice-box table tr.top table td.title {
            font-size: 45px;
            line-height: 45px;
            color: #333;
          }
    
          .invoice-box table tr.information table td {
            padding-bottom: 40px;
          }
    
          .invoice-box table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
          }
    
          .invoice-box table tr.details td {
            padding-bottom: 20px;
          }
    
          .invoice-box table tr.item td {
            border-bottom: 1px solid #eee;
          }
    
          .invoice-box table tr.item.last td {
            border-bottom: none;
          }
    
          .invoice-box table tr.total td:nth-child(2) {
            border-top: 2px solid #eee;
            font-weight: bold;
          }
    
          @media only screen and (max-width: 600px) {
            .invoice-box table tr.top table td {
              width: 100%;
              display: block;
              text-align: center;
            }
    
            .invoice-box table tr.information table td {
              width: 100%;
              display: block;
              text-align: center;
            }
          }
    
          /** RTL **/
          .invoice-box.rtl {
            direction: rtl;
            font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
          }
    
          .invoice-box.rtl table {
            text-align: right;
          }
    
          .invoice-box.rtl table tr td:nth-child(2) {
            text-align: left;
          }
        </style>
      </head>
    
      <body>
        <div class="invoice-box">
          <table cellpadding="0" cellspacing="0">
            <tr class="top">
              <td colspan="1">
                <table>
                  <tr>
                    <td class="title" colspan="1" style="padding-top: 0px;">
                      <img src="https://firebasestorage.googleapis.com/v0/b/test-app-9258e.appspot.com/o/result.png?alt=media&token=592bfb94-55fc-4269-b858-9786edadd70d" style="width: 200px; height: 100px;" />
                    </td>
    
                    <td colspan="3">
                      <b>Invoice </b><br />
                    </td>
                    <td style="float: right;">
                    Date : ${todayNewDate}<br />
                  </td>
                  </tr>
                </table>
              </td>
            </tr>
    
            <tr class="information">
              <td colspan="2">
                <table>
                  <tr>
                    <td>
                      Hi, <b>${userName}</b><br />
                      Phone No. - ${subscribeData.phone}<br/>
                      Address - ${subscribeData.address}
                    </td>
    
                  </tr>
                </table>
              </td>
            </tr>
    
    
            <tr class="heading">
              <td>Item</td>
    
              <td>Price</td>
            </tr>
    
            <tr class="item">
              <td>Subscription Period</td>
    
              <td>${data.subscription}</td>
            </tr>
    
            <tr class="item">
              <td>Subscription Amount</td>
    
              <td>${data.amount}</td>
            </tr>
    
            <tr class="item">
              <td>Subscription Start Date</td>
    
              <td>${subsStartDate}</td>
            </tr>
            <tr class="item">
              <td>Subscription Expiry Date</td>
    
              <td>${subsEndDate}</td>
            </tr> 
            <tr class="item last">
            <td>Paid Amount</td>
  
            <td>${data.amount}</td>
          </tr>  
          
          <tr>
          <td>
          <br />
          <br />
            <b>Warm Regards,</b><br />
            Posh Health Club<br />
            GSTIN : 06ABDFP3070D1ZM<br />
            Address: SCO-52, 53, Old Judicial Complex Civil Lines Rd,<br /> 
            near Axis Bank, Civil Lines, Gurugram, Haryana 122001
          </td>

        </tr>
          </table>
        </div>
      </body>
    </html>
    `;
    
    
    return mailObj;
  }
  
  const sendEmail = async (data) => {    
    let requestbody=sendMailobject(data);
    console.log("requestbody",requestbody)
    const response = await axios.post(
      "https://posh-health-backend.onrender.com/api/sendemailnew",
      requestbody
    );
    // console.log(response.data);
  };
  
  const navigate = useNavigate();
  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "users"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubscription = async (id,userData) => {
    console.log('userData: ', userData);
    // let fullUserName = `${firstName} ${lastName} `;
    // setUserName(fullUserName);
    setUserId(id);
    setSubscribeData(userData)
    setOpen(true);
    setSubscribeEmail(userData.email);
    // try {
    //   await deleteDoc(doc(db, "users", id));
    //   setData(data.filter((item) => item.id !== id));
    // } catch (err) {
    //   console.log(err);
    // }
  };
  
  const handleClose = () => setOpen(false);

  const createGuid = () => {  
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);  
      return v.toString(16);  
   });  
}  

  
let uniqueId = createGuid();


  const handleChange = (event) => {
    setSubscription(event.target.value);
  };
  const paymenthandleChange = (event) => {
    setPayment(event.target.value);
  };

  const renewalAmount = (event) => {
    setAmount(event.target.value);
  }
  
  const submitRenewalSubscribe = async() =>{
    let renewStartDate = dateFormat(startDate, 'mm/dd/yyyy');
    let renewEndDate = dateFormat(endDate, 'mm/dd/yyyy');
    const subscribeData = {
      "userid": userId,
      "amount":amount,
      "subscription": subscription,
      "payment": payment,
      "startDate": renewStartDate, 
      "endDate": renewEndDate,
      "status": 'Active'
    }
    const newUserDateUpdate = {
      "startDate": renewStartDate, 
      "endDate": renewEndDate,
    }
    //const res = await db.collection('subscribe').add(subscribeData);
    
    try {
      const tableValue =await setDoc(doc(db, "newSubscription",uniqueId), {
        ...subscribeData,
        timeStamp: serverTimestamp(),
      });
      const tableUserValue =await updateDoc(doc(db, "users",userId), {
        ...newUserDateUpdate,
        updateTimeStamp: serverTimestamp(),
      });
      sendEmail(subscribeData);
      navigate('/users/'+ userId);
    } catch (err) {
      console.log(err);
    }
  }

  // if (date1 < date2) { console.log("Date1 is less than Date2 in terms of year"); } 
  // else if (date1 > date2) { console.log("Date1 is greater than Date2 in terms of year"); }
  // else { console.log(`Both years are equal`); }
  const actionColumn = [
  { field:"status",
    headerName:"Status",
    width:100,
    renderCell: (params) => { 
      let currentDatevalue= Date.parse(params.row.endDate)
      let newDateValue = new Date(); 
      let newUpdateDate = dateFormat(newDateValue , 'mm/dd/yyyy')
      let currentTodayDate=Date.parse(newUpdateDate);
      let userStatusUpdate;
      if (currentDatevalue >= currentTodayDate ) {
        userStatusUpdate = <div className="MuiDataGrid-cell MuiDataGrid-cell--textLeft" role="cell" data-field="status" ><div title="Active" className="MuiDataGrid-cellContent" value="Active"><span className="colored-circle-green"></span>Active</div></div>
        

      } else {
        userStatusUpdate = <div className="MuiDataGrid-cell MuiDataGrid-cell--textLeft" role="cell" data-field="status" ><div title="Inactive" className="MuiDataGrid-cellContent" value="Inactive"><span className="colored-circle-red"></span>Inactive</div></div>
      }
      return (
        <div className="cellAction">
          {userStatusUpdate}
          
        </div>
      );
    }
    
},

    {
      field: "action",
      headerName: "Action",
      width: 300,
      renderCell: (params) => {
        
        // end Date Change into Timestamps
        let currentDatevalue= Date.parse(params.row.endDate);
       
        // console.log('Datevalue: ', currentDatevalue);
        //let updateEndDate =  new Date(params.row.endDate);
       // console.log('updateEndDate: ', updateEndDate);
       // current  Date Change into Timestamps
        let newDateValue = new Date(); 
        let newUpdateDate = dateFormat(newDateValue , 'mm/dd/yyyy')
        let currentTodayDate=Date.parse(newUpdateDate);

        let button;
       // console.log('newUpdateDate: ', newUpdateDate);
        // console.log('updateEndDate: ', currentTodayDate);
        if (currentDatevalue <= currentTodayDate ) {
          button = <Button className="subsButton" 
          onClick={() => handleSubscription(params.row.id,params.row)}>
          Subscription
        </Button>;
        } else {
          button = <Button className="subsButton" disabled
          onClick={() => handleSubscription()}>
          Subscription
        </Button>;
        }
        
        return (
          <div className="cellAction">
            
            <Link to={`${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton" >View</div>
            </Link>
            {button}
            {/* <Button className="subsButton" 
              onClick={() => handleSubscription(params.row.id)}>
              Subscription
            </Button> */}
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}>
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable marg-lr-10">
      <div className="datatableTitle">
        All Users
      
        <Link to="/users/new" className="link">
          Add New User
        </Link>
        {/* ReactPDF.render(<Invoice />, `${__dirname}/example.pdf`); */}
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}  noValidate autoComplete="off">
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography> */}
          <Typography className="subsHeadline" id="modal-modal-description" sx={{ mt: 2 }}>
            Subscription Renew
          </Typography>
          <div>
          <TextField id="standard-basic" type="number" label="Amount" variant="standard"  value = {amount} onChange={renewalAmount}  required/>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Subscription Period</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={subscription}
              onChange={handleChange}
              label="Subscription"
              required >
                  <MenuItem value="1 month">1 Month</MenuItem>
                  <MenuItem value="3 month">3 Month</MenuItem>
                  <MenuItem value="6 month">6 Month</MenuItem>
                  <MenuItem value="12 month">12 Month</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Payment Type</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={payment}
              onChange={paymenthandleChange}
              label="Payment" required
            >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="google_pay">Google Pay</MenuItem>
                  <MenuItem value="amazon_pay">Amazon Pay</MenuItem>
                  <MenuItem value="paytm">Paytm</MenuItem>
                  <MenuItem value="phone_pay">Phone Pay</MenuItem>
                  <MenuItem value="other">Other Payment Mode</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <div className = 'marginTop-20'>
          <span className=" padding-R-10">Subscription Date: </span>
          <DateRangePicker onChange={setRenewDate} value={renewDate} minDate={new Date()} required/>
          </div>
          </FormControl>
            <div className="renewBtnCss">
              <FormControl>
              <button className="submit-Btn" onClick={(e) => submitRenewalSubscribe()}>
                      Subscribe
                    </button>
                </FormControl>
                </div>
          {/* <Select component="form"
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value=''
                  onChange={subscriptionHandleChange}
                  label="Subscription"
                >
                  <MenuItem value="1 month">1 Month</MenuItem>
                  <MenuItem value="3 month">3 Month</MenuItem>
                  <MenuItem value="6 month">6 Month</MenuItem>
                  <MenuItem value="12 month">12 Month</MenuItem>
                </Select> */}
          </div>
        </Box>
      </Modal>
    </div>


    
  );
};

export default Datatable;
