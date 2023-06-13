import React from 'react';
import ReactDOM from 'react-dom';
import "./widget.scss";
import { Link } from "react-router-dom";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import PersonIcon from '@mui/icons-material/Person';
import {MoneyFormatter} from "../../datebaseCommon";
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
//import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const Widget = ({ type }) => {
  const [amount, setAmount] = useState(null);
  const [diff, setDiff] = useState(null);
  let data;

  switch (type) {
    case "user":
      data = {
        title: "Total Users",
        isMoney: false,
        isUser: true,
        renew:false,
        link: "See all users",
        linkValue :"/users",
        query:"users",
        //where:where("isActive", "==", true),
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "Subscription Renew",
        isMoney: true,
        isUser: false,
        renew:true,
        link: "View all subscription",
        linkValue :"/users",
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "Expenses",
        isMoney: true,
        isUser: false,
        renew:false,
        link: "View all expenses",
        linkValue :"/expenses",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "product":
      data = {
        title: "Total Revenue",
        isMoney: true,
        isUser: false,
        renew:false,
        query:"products",
        link: "See details",
        linkValue :"/users",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  useEffect(() => {

    const getDetailbyDatabse= async (tableName)=>{
      const dbRef = query(
        collection(db, tableName)
      );
      const dbRefData = await getDocs(dbRef);
      
      //console.log("dbRefData",dbRefData.docs)
      return dbRefData;
    }
    const fetchData = async () => {
      const today = new Date();
      const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
      const prevMonth = new Date(new Date().setMonth(today.getMonth() - 2));

      const lastMonthQuery = query(
        collection(db, data.query),
        where("timeStamp", "<=", today),
        where("timeStamp", ">", lastMonth)
      );
      const prevMonthQuery = query(
        collection(db, data.query),
        where("timeStamp", "<=", lastMonth),
        where("timeStamp", ">", prevMonth)
      );

      const lastMonthData = await getDocs(lastMonthQuery);
      const prevMonthData = await getDocs(prevMonthQuery);

      setAmount(lastMonthData.docs.length);
      setDiff(
        ((lastMonthData.docs.length - prevMonthData.docs.length) / prevMonthData.docs.length) *
          100
      );
    };
    const fetchDataUser = async () => {
      const totaluserExpenseData = await getDetailbyDatabse('users');
      
      if(totaluserExpenseData && totaluserExpenseData.docs && totaluserExpenseData.docs.length){
        setAmount(MoneyFormatter(totaluserExpenseData.docs.length))
        
      }else{
        setAmount(0);
      }

      
    };
    const fetchDataExpense = async () => {
      const totalExpenseData = await getDetailbyDatabse('expenses');
      if(totalExpenseData && totalExpenseData.docs && totalExpenseData.docs.length){
        let mapExpense=totalExpenseData.docs.map(x=>x.data());
        let totalExpense = mapExpense.reduce((privious,current)=>{
         return privious+parseFloat(current.expenseAmount)
        },0)
        
        setAmount(MoneyFormatter(totalExpense));
        
      }else{
        setAmount(0);
      }
     
    };
    
    const fetchDataSubscribe = async () => {
      let totalsubscribeAmount=0;
      const totalsubscribeExpenseData = await getDetailbyDatabse('newSubscription');
      const totaluserExpenseData = await getDetailbyDatabse('users');
      // var idlist=totaluserExpenseData.docs.forEach(x=>x.get());
      // console.log("idlist",idlist);
      
      
      if(totalsubscribeExpenseData && totalsubscribeExpenseData.docs && totalsubscribeExpenseData.docs.length){
        let idList1=totaluserExpenseData.docs.map(x=>x.id.toString());
        //console.log("idList1",idList1)
        //totalsubscribeExpenseData.docs.filter(x=>x.)
        let mapExpense=totalsubscribeExpenseData.docs.map(x=>x.data());
        let userIdFilter=mapExpense.filter(x=>idList1?.includes(x.userid));
        //console.log("userIdFilter",userIdFilter)
       // console.log("totalsubscribeExpenseData",mapExpense)
        if(userIdFilter && userIdFilter.length>0){
          let totalExpense = userIdFilter.reduce((privious,current)=>{
            let amount= current.amount==""?0:parseFloat(current.amount)
           return privious+amount;
          },0);
          totalsubscribeAmount+=totalExpense;
        }
       
        
        
      }

      if(totaluserExpenseData && totaluserExpenseData.docs && totaluserExpenseData.docs.length){
        let mapExpense=totaluserExpenseData.docs.map(x=>x.data());
        //console.log("totaluserExpenseData",mapExpense)
        //debugger;
        //totaluserExpenseData.docs.forEach(x=>x.get());
        //console.log("totaluserExpenseData.docs",)
        let totalExpense = mapExpense.reduce((privious,current)=>{
          let amount= current.amount==""?0:parseFloat(current.amount)
          return privious+amount;
        },0);
        totalsubscribeAmount+=totalExpense;
        // console.log("mapexpne",mapExpense);
        // console.log("totalExpense",totalExpense);
        // setAmount(totalExpense);
        
      }

      setAmount(MoneyFormatter(totalsubscribeAmount));
      
    };

    const fetchDataRenewSubscribe = async () => {
      let totalsubscribeAmount=0;
      const totalsubscribeExpenseData = await getDetailbyDatabse('newSubscription');
     
      if(totalsubscribeExpenseData && totalsubscribeExpenseData.docs && totalsubscribeExpenseData.docs.length){
        let mapExpense=totalsubscribeExpenseData.docs.map(x=>x.data());
        //console.log("mapExpense",mapExpense)
        const uniqueValues = new Set(mapExpense.map(v => v.userid));
        //console.log("uniqueValues",uniqueValues.size);
        if(uniqueValues && uniqueValues.size){
            setAmount(uniqueValues.size);
        }
        else{
          setAmount(totalsubscribeAmount);
        } 
      }else{
          setAmount(totalsubscribeAmount);
      }

    };



    switch (type) {
      case "user" :
      fetchDataUser();
      break;
      case "earning" :
      fetchDataExpense();
      break;
      case "product" :
        fetchDataSubscribe();
      break;
      case "order" :
        fetchDataRenewSubscribe();
      break;
      default:
      break;
    }
   
  }, []);

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          
          { data.isMoney && <CurrencyRupeeIcon/> || data.isUser && <PersonIcon/>  || data.renew && <SubscriptionsIcon/>}  {amount}
        </span>
        <Link to= {data.linkValue} style={{ textDecoration: "none" }}>
        <span className="link">{data.link}</span>
        </Link>
      </div>
      <div className="right">
        <div className={`percentage ${diff < 0 ? "negative" : "positive"}`}>
          {diff < 0 ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/> }
          {diff}
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;