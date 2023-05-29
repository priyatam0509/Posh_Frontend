import React from 'react';
import ReactDOM from 'react-dom';
import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect ,useState } from 'react';
import {YearDetails,dbName,BindYearlyData,  MoneyFormatter} from "../../datebaseCommon"


const data = [
  { name: "January", Total: 1200 },
  { name: "February", Total: 2100 },
  { name: "March", Total: 800 },
  { name: "April", Total: 1600 },
  { name: "May", Total: 900 },
  { name: "June", Total: 1700 },
];

const Chart = ({ aspect, title }) => {

  useEffect(() => GetHandleChartData(),[]);
  
  const [data, setData] = useState([]);
  let GetHandleChartData =async ()=>{

     let YearUserResult= YearDetails(dbName.Users);
     let YearSubscribersResult= YearDetails(dbName.Subscribers);

     let YearResult=Promise.all([YearUserResult, YearSubscribersResult]);
     
     

     const mappedRevenueAmount=(RevenueObject)=>{
      let todayExpences=0;
      let yeardata=BindYearlyData();
      if(RevenueObject && RevenueObject.length){
        RevenueObject.forEach(result=>{
          if(result && result.length){
            result.forEach(x=>{
             let indexpostion= yeardata.findIndex(obj=>obj.name==x.name)

              if(indexpostion>-1){
               yeardata[indexpostion].Total+=x.Total;
              
              }
            })
          }
         // todayExpences+=reduceAmount(result);
        });
      }
      return yeardata;
    }


     YearResult.then(yearValue=>{
      //  console.log("yearValue",mappedRevenueAmount(yearValue))
       let amountYear=mappedRevenueAmount(yearValue);
      //  let amountDetail=amountYear.map(x=>{
      //   x.Total=MoneyFormatter(x.Total)
      //   return x;
      //  });
       //console.log("amountDetail",amountDetail)
        setData((prev) => ({ ...prev, yearValue: amountYear }));
      }); 
  }
  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <AreaChart
          width={730}
          height={250}
          data={data.yearValue}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="gray" />
          <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Total"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#total)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
