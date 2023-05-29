import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from 'react'
import ReactDOM from 'react-dom'
import {useEffect, useState} from 'react';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

import {TodayDetails,LastMonthDetails,WeekDetails,CurrentMonthDetails,dbName,MoneyFormatter } from "../../datebaseCommon"

const Featured = () => {

  const [data, setData] = useState("");
  
  // const {userId } = useParams();
  useEffect(() => GetHandleFeatureData(),[]);
  
  const GetHandleFeatureData = async () => {    
    
  
    try { 
      
     
      let TodayUserResult=  TodayDetails(dbName.Users);
      let WeekUserResult=  WeekDetails(dbName.Users);
      let MonthUserResult= LastMonthDetails(dbName.Users);
      let CurrentMonthUserResult= CurrentMonthDetails(dbName.Users);
      

      let TodaySubscribersResult=  TodayDetails(dbName.Subscribers);
      let WeekSubscribersResult=  WeekDetails(dbName.Subscribers);
      let CurrentSubscribersResult= CurrentMonthDetails(dbName.Subscribers);
      let MonthSubscribersResult= LastMonthDetails(dbName.Subscribers);
      

      let TodayResult=Promise.all([TodayUserResult, TodaySubscribersResult]);
      let WeekResult=Promise.all([WeekUserResult, WeekSubscribersResult]);
      let CurrentMonthResult=Promise.all([CurrentMonthUserResult, CurrentSubscribersResult]);
      let MonthResult=Promise.all([MonthUserResult, MonthSubscribersResult]);
      
      
      const reduceAmount=(userDetail)=>{
        if(userDetail&& userDetail.length){
          let total = userDetail.reduce(function (previousValue, currentValue) {
            let amount=currentValue.amount==""?0:parseInt(currentValue.amount);
            return previousValue + amount;
          }, 0);
          return total;
        }
        else{
          return 0;
        }
        }
        
     
      const MappedUser=(usersDetail)=>{
        return usersDetail.map(x=>x.data())
      }

      const mappedRevenueAmount=(RevenueObject)=>{
        let todayExpences=0;
        if(RevenueObject && RevenueObject.length){
          RevenueObject.forEach(result=>{
            todayExpences+=reduceAmount(result);
          });
        }
        return todayExpences;
      }

      TodayResult.then(todayValue=>{
        setData((prev) => ({ ...prev, todayValues: MoneyFormatter(mappedRevenueAmount(todayValue)) }));
        //console.log("todayValue",data)
      });
      WeekResult.then(weekValue=>{
        setData((prev) => ({ ...prev, weekValue: MoneyFormatter(mappedRevenueAmount(weekValue)) }));
        //console.log("weekValue",data)
      });
      CurrentMonthResult.then(currentMonthValue=>{
        setData((prev) => ({ ...prev, currentMonthValue: MoneyFormatter(mappedRevenueAmount(currentMonthValue)) }));
        //console.log("currentMonthValue",data)
      });
      MonthResult.then(monthValue=>{
        setData((prev) => ({ ...prev, monthValue: MoneyFormatter(mappedRevenueAmount(monthValue)) }));
        //console.log("monthValue",data)
      });
            
                   

      //console.log("resullt",resullt)
      
      

    } catch(error) 
    { 
      console.log(error) 
    }
  };

      

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Revenue</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CurrencyRupeeIcon className="rupeesIconFont"/>
          {/* <CircularProgressbar value={70} text={"70%"} strokeWidth={5} /> */}
        </div>
        <p className="title">Total sales made today</p>
            <p className="amount">₹ {data.todayValues}</p>
        <p className="desc">
          Previous transactions processing. Last payments may not be included.
        </p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Last Week</div>
            <div className="itemResult positive">
              {/* <KeyboardArrowDownIcon fontSize="small"/> */}
              <div className="resultAmount">₹ {data.weekValue}</div> 
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Current Month</div>
            <div className="itemResult positive">
              {/* <KeyboardArrowUpOutlinedIcon fontSize="small"/> */}
              <div className="resultAmount">₹ {data.currentMonthValue}</div> 
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last  Month</div>
            <div className="itemResult positive">
              {/* <KeyboardArrowUpOutlinedIcon fontSize="small"/> */}
               <div className="resultAmount">₹ {data.monthValue}</div> 
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
