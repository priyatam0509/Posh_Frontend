import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
// import Email from "../../pages/email/Email";
import axios from "axios";
import emailImage from "./result.png";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import InputLabel from '@mui/material/InputLabel';
import { Form, Link } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { format } from 'date-fns';
import dateFormat, { masks } from "dateformat";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers-pro';
// import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import { LicenseInfo } from '@mui/x-license-pro';
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
LicenseInfo.setLicenseKey('x0jTPl0USVkVZV0SsMjM1kDNyADM5cjM2ETPZJVSQhVRsIDN0YTM6IVREJ1T0b9586ef25c9853decfa7709eee27a1e');

const New = ({ inputs, title }) => {
  // let todayDate = format(new Date(), 'dd/mm/yyyy');
  // console.log('title: ', title);
  // console.log('inputs: ', inputs);
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [per, setPerc] = useState(null);
  const [gender, setGender] = useState('');
  const [subscription, setSubscription] = useState('');
  const [payment, setPayment] = useState('');
  const [date, setDate] = useState('');
  const [subscriptionDate, setSubscriptionDate]  = useState([new Date(),new Date()]);
  
  
  let startDate = ({subscriptionDate}.subscriptionDate[0]);
  let subsStartDate = dateFormat(startDate, 'mm/dd/yyyy');
  let endDate = ({subscriptionDate}.subscriptionDate[1]);
  let subsEndDate = dateFormat(endDate, 'mm/dd/yyyy');
  let todayNewDate = dateFormat(new Date(), 'mm/dd/yyyy')
  let newExpiryDate = dateFormat(subsEndDate, 'dd/mm/yyyy');

  let pdfObj = {
    newExpiryDate,
    todayNewDate,
    subsStartDate,
    data

  }
  const sendMailobject= ()=>{

    let userName=`${data.firstname} ${data.lastname}`
    let mailObj ={};
    mailObj.subject="Registration In POSH HEALTH CLUB";
    mailObj.to= data.email;
    mailObj.form = pdfObj;
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
                      Phone No. - ${data.phone}<br/>
                      Address - ${data.address}
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

  const sendEmail = async () => {
    
    let requestbody=sendMailobject();
    const response = await axios.post(
      "https://posh-backend.onrender.com/api/sendemail",
      requestbody
    );
    // console.log(response.data);
  };

  
  const navigate = useNavigate()

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;

      console.log(name);
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);


  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      let passwordData = 'test@123'
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        passwordData
      );
      await setDoc(doc(db, "users", res.user.uid), {
        ...data,
        timeStamp: serverTimestamp(),
      });
      navigate(-1)
    } catch (err) {
      console.log(err);
    }
  };
  const handleChange = (e) => {
    setData((prev) => ({ ...prev, gender: e.target.value }));
    setGender(e.target.value);
  };
  const subscriptionHandleChange = (e) => {
    setSubscription(e.target.value);
    setData((prev) => ({ ...prev, subscription: e.target.value }));
  };
  const paymentHandleChange = (e) => {
    setPayment(e.target.value);
    setData((prev) => ({ ...prev, payment: e.target.value }));
  };
  const dateHandleChange = (e) => {
    console.log('e.target.value: ', e.target.value);
    setDate(e.target.value);
    setData((prev) => ({ ...prev, date: e.target.value }));
  };
const submitSubscriptionDate = ()=> {
      //Email();
      if(endDate != new Date()){
        setData((prev) => ({ ...prev, startDate: subsStartDate }));
        setData((prev) => ({ ...prev, endDate: subsEndDate }));
        sendEmail();
      }

}
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input className="inputFieldCutom"
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleInput}
                  required/>
                </div>
              ))}
              <div className="formInput">
                <label htmlFor="gender">
                  Gender
                </label>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  {/* <InputLabel id="demo-simple-select-standard-label">Age</InputLabel>                 */}
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard width-100"
                  value={gender}
                  onChange={handleChange}
                  label="gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                </FormControl>

              </div>
              <div className="formInput">
                <label htmlFor="subscription">
                  Subscription Period
                </label>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  {/* <InputLabel id="demo-simple-select-standard-label">Age</InputLabel>                 */}
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard width-100"
                  value={subscription}
                  onChange={subscriptionHandleChange}
                  label="Subscription"
                >
                  <MenuItem value="1 month">1 Month</MenuItem>
                  <MenuItem value="3 month">3 Month</MenuItem>
                  <MenuItem value="6 month">6 Month</MenuItem>
                  <MenuItem value="12 month">12 Month</MenuItem>
                </Select>
                </FormControl>
              </div>
              <div className="formInput">
                <label htmlFor="payment">
                  Payment Mode
                </label>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  {/* <InputLabel id="demo-simple-select-standard-label">Age</InputLabel>                 */}
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard width-100"
                  value={payment}
                  onChange={paymentHandleChange}
                  label="Payment"
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="google_pay">Google Pay</MenuItem>
                  <MenuItem value="amazon_pay">Amazon Pay</MenuItem>
                  <MenuItem value="paytm">Paytm</MenuItem>
                  <MenuItem value="phone_pay">Phone Pay</MenuItem>
                  <MenuItem value="card">Debit/Credit Card</MenuItem>
                  <MenuItem value="other">Other Payment Mode</MenuItem>
                </Select>
                </FormControl>
                </div>
                <div className="formInput">
                <label htmlFor="payment">
                  Subscription Date
                </label>
                
                <div className = 'marginTop-10'>
                {/* <DateRangePicker onChange={setSubscriptionDate} value={subscriptionDate} minDate={new Date()}/> */}
                <DateRangePicker onChange={setSubscriptionDate} value={subscriptionDate} />
                </div>
                </div>             
                <button className="submit-Btn" onClick = {submitSubscriptionDate} disabled={per !== null && per < 100} type="submit">
                  Register
                </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;