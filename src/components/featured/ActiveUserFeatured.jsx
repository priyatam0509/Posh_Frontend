import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {React,useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import {TodayDetails,LastMonthDetails,WeekDetails,CurrentMonthDetails,dbName ,MoneyFormatter,CollectionDetails} from "../../datebaseCommon";
import PersonIcon from '@mui/icons-material/Person';
import dateFormat, { masks } from "dateformat";


const ActiveUserFeatured = () => {



  const [data, setData] = useState([]);
  const {userId } = useParams();
  useEffect(() => GetHandleFeatureData(),[]);
  
  const GetHandleFeatureData = async () => {    
    
    
    try {

      let filterActiveUser =(users)=>{
        const date = new Date();
        const today = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 0);
        
        return users.filter(x=>new Date(x?.endDate)>=today)
      }
      let TodayUserResult=  TodayDetails(dbName.Users);
      let WeekUserResult=  WeekDetails(dbName.Users);
      let MonthUserResult= LastMonthDetails(dbName.Users);
      let CurrentMonthUserResult= CurrentMonthDetails(dbName.Users);
      let UserAllDetail= CollectionDetails(dbName.Users)

      let TodayResult=await TodayUserResult;
      let WeekResult=await WeekUserResult;
      let CurrentMonthResult=await CurrentMonthUserResult;
      let MonthResult=await MonthUserResult;
      let UserDetail = await UserAllDetail
      
         console.log("TodayResult",TodayResult)
      //  console.log("CurrentMonthResult",CurrentMonthResult)
      //  console.log("MonthResult",MonthResult)


      if(UserDetail &&  UserDetail.length){
        let today= new Date();
        let activeUser=0;
        let deActivateUser=0;
        //dateFormat(createTime, 'mm/dd/yyyy');
        UserDetail.forEach(x=>{

            var enddate= new Date(x.endDate);
            if(enddate>today){
              activeUser+=1;
              setData((prev) => ({ ...prev, activeUser:activeUser }));  
            }else{
              deActivateUser+=1;
              setData((prev) => ({ ...prev, deActiveUser:  deActivateUser}));
            }
        })
      }else{
        setData((prev) => ({ ...prev, activeUser: 0})); 
        setData((prev) => ({ ...prev, deActiveUser: 0 }));  
      }
       if(TodayResult &&  TodayResult.length){
        let activeTodayResult=filterActiveUser(TodayResult);
        console.log("activeTodayResult",activeTodayResult)
        setData((prev) => ({ ...prev, TodayResult: MoneyFormatter(activeTodayResult?.length) }));
      }else{
        setData((prev) => ({ ...prev, TodayResult: 0 }));
      }

      if(WeekResult  && WeekResult.length){
        let activeWeekResult=filterActiveUser(WeekResult);
        //console.log("WeekResult",todayresult)
        setData((prev) => ({ ...prev, WeekResult: MoneyFormatter(activeWeekResult?.length) }));
      }else{
        setData((prev) => ({ ...prev, WeekResult: 0 }));
      }

      if(CurrentMonthResult && CurrentMonthResult.length){
        let activeCurrentMonthResult=filterActiveUser(CurrentMonthResult);
        console.log("CurrentMonthResult",CurrentMonthResult)
        setData((prev) => ({ ...prev, CurrentMonthResult: MoneyFormatter(activeCurrentMonthResult?.length) }));
      }else{
        setData((prev) => ({ ...prev, CurrentMonthResult: 0 }));
      }

      if(MonthResult && MonthResult.length){
        let activeMonthResult=filterActiveUser(MonthResult);
        setData((prev) => ({ ...prev, MonthResult: MoneyFormatter(activeMonthResult?.length) }));
      }else{
        setData((prev) => ({ ...prev, MonthResult: 0 }));
      }

      
     


      } catch(error) 
      { 
        console.log(error) 
      }
    };


  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Active User</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <PersonIcon className="personIcon"/>
          {/* <CircularProgressbar value={70} text={"70%"} strokeWidth={5} /> */}
        </div>
        {/* <p className="title">Active User today</p>
        <p className="amount">{data.TodayResult}</p>
        <p className="desc">
          Previous transactions processing.

        </p> */}
      <p className="title fontSize-25">Users</p>
        <div className="summary">
          <div className="item">
            {/* <div className="itemTitle">Target</div> */}
            <div className="itemTitleFontSizePositive">Total Active </div> 
            <div className="itemResultFontSize positive">
              {/* <KeyboardArrowDownIcon fontSize="small"/> */}
                  <div className="resultAmount userPadding">{data.activeUser}</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitleFontSizeNegative">Total InActive</div>
            <div className="itemResultFontSize negative">
              {/* <KeyboardArrowUpOutlinedIcon fontSize="small"/> */}
                <div className="resultAmount userPadding">{data.deActiveUser}</div>
            </div>
          </div>
        </div>
        <div>
        </div>
        <p className="title fontSize-20">Active Users</p>
        <div className="summary">
          <div className="item">
            {/* <div className="itemTitle">Target</div> */}
            <div className="itemTitle">Last Week</div> 
            <div className="itemResult positive">
              {/* <KeyboardArrowDownIcon fontSize="small"/> */}
                  <div className="resultAmount userPadding">{data.WeekResult}</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Current Month</div>
            <div className="itemResult positive">
              {/* <KeyboardArrowUpOutlinedIcon fontSize="small"/> */}
                <div className="resultAmount userPadding">{data.CurrentMonthResult}</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Month</div>
            <div className="itemResult positive">
              {/* <KeyboardArrowUpOutlinedIcon fontSize="small"/> */}
              <div className="resultAmount userPadding">{data.MonthResult}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveUserFeatured;
