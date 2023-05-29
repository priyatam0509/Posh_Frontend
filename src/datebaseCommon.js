import { collection, query, where, getDocs,getDoc } from "firebase/firestore";
import { db } from "./firebase";


const today = new Date();
const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 0);
const yearCurrentMonth = new Date(new Date().setMonth(today.getMonth() - 0));
const previousMonth = new Date(new Date().setMonth(today.getMonth() - 1));
const previousLastMonth = new Date(new Date().setMonth(today.getMonth() - 2));
const previousWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
const previousSixMonth = new Date(new Date().setMonth(today.getMonth() - 6));
const previousYear = new Date(new Date().setMonth(today.getMonth() - 12));
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
// console.log("yesterday",yesterday)
console.log("previousMonth",previousMonth)
console.log("previousLastMonth",previousLastMonth)
console.log("yearCurrentMonth",yearCurrentMonth)
console.log("today",today)


export const CollectionDetails = async (table) =>{
    let dbQuery= query(
         collection(db, table)
      );
     let value=await dbRequest(dbQuery);
     //console.log("value",value)
     return value;//await dbRequest(dbQuery)
 
 } 
export const TodayDetails = async (table) =>{
   let dbQuery= query(
        collection(db, table),
        where("timeStamp", ">=", yesterday),
    );
    let value=await dbRequest(dbQuery);
    //console.log("value",value)
    return value;//await dbRequest(dbQuery)

} 

export const CurrentMonthDetails = async (table) =>{
    let dbQuery= query(
        collection(db, table),
        where("timeStamp", "<=", today),
        where("timeStamp", ">=",yearCurrentMonth)
    );

    return await dbRequest(dbQuery)
}

export const LastMonthDetails = async (table) =>{
    let dbQuery= query(
        collection(db, table),
        where("timeStamp", "<", yearCurrentMonth),
        where("timeStamp", ">",previousMonth)
    );

    return await dbRequest(dbQuery)
}

export const LastSixMonthDetails = async (table) =>{
    let dbQuery=query(
        collection(db, table),
        where("timeStamp", "<=", today),
        where("timeStamp", ">", previousSixMonth)
    );
    return await dbRequest(dbQuery)

}

export const WeekDetails = async (table) =>{
    let dbQuery=query(
        collection(db, table),
        where("timeStamp", "<=", today),
        where("timeStamp", ">", previousWeek)
    );

    return await dbRequest(dbQuery)
}

export const YearDetails = async (table) =>{
    let yearcal=[];
    let dbQuery=query(
        collection(db, table),
        where("timeStamp", "<",yearCurrentMonth),
        where("timeStamp", ">", previousYear)
    );
    let value=await dbRequest(dbQuery);
    //console.log("value",value)
    if(value && value.length){
         yearcal= YearlyCalculation(value)
        console.log("yearcal",yearcal)
    }
  return yearcal;
}

export const YearCountDetails = async (table) =>{
    let yearcal=[];
    let dbQuery=query(
        collection(db, table),
        where("timeStamp", "<",yearCurrentMonth),
        where("timeStamp", ">", previousYear)
    );
    let value=await dbRequest(dbQuery);
    //console.log("value",value)
    if(value && value.length){
         yearcal= YearlyCountCalculation(value)
        //console.log("yearcal",yearcal)
    }
  return yearcal;
}

const dbRequest = async  (dbRef)=>{
    let dbResult= await getDocs(dbRef);
  
     if(dbResult && dbResult.docs && dbResult.docs.length){
        let dataRefDetail= dbResult.docs.map(x=>{
              let data= x.data();
              data.createdTime=new Date(data.timeStamp.seconds*1000);
              return data;
            })
        return dataRefDetail;
        }
     else{
        return [];
     }
    
}

const YearlyCalculation = (yearlyRecord)=>{
    let YearlyResult={};
    let yearMapped= BindYearlyData();
    if(yearlyRecord && yearlyRecord.length){
        let resultMapped= yearlyRecord.map(x=>{
         x.MonthName= GetMonthName(x.timeStamp);
         return x;
        });
        var result = [];
        
         YearlyResult=resultMapped.reduce(function(res, value) {
        if (!res[value.MonthName]) {
            res[value.MonthName] = { name: value.MonthName, Total: 0 };
            result.push(res[value.MonthName])
        }
        let amount =value.amount==""?0:parseFloat(value.amount)
        res[value.MonthName].Total += amount;
        let indexPostion= yearMapped.findIndex(x=>x.name==value.MonthName);
        if(indexPostion>-1){
            yearMapped[indexPostion].Total=res[value.MonthName].Total;
        }
            
        return res;
    }, {});

    }
     
    return yearMapped;
}

const YearlyCountCalculation = (yearlyRecord)=>{
    let YearlyResult={};
    let yearMapped= BindYearlyData();
    if(yearlyRecord && yearlyRecord.length){
        let resultMapped= yearlyRecord.map(x=>{
         x.MonthName= GetMonthName(x.timeStamp);
         return x;
        }).filter(x=>new Date(x.endDate)>=yesterday);

        var result = [];
        console.log("resultMapped",resultMapped)
         YearlyResult=resultMapped.reduce(function(res, value) {
        if (!res[value.MonthName]) {
            res[value.MonthName] = { name: value.MonthName, Total: 0 };
            result.push(res[value.MonthName])
        }
        //let amount =value.amount==""?0:parseFloat(value.amount)
        res[value.MonthName].Total += 1;
        let indexPostion= yearMapped.findIndex(x=>x.name==value.MonthName);
        if(indexPostion>-1){
            yearMapped[indexPostion].Total=res[value.MonthName].Total;
        }
            
        return res;
    }, {});

    }
     
    return yearMapped;
}
export const BindYearlyData =()=>{
    
    let  monthList=[];
    for(var i = 12; i > 0; i -= 1) {
        let monthObject={}
        let d = new Date(today.getFullYear(), today.getMonth() - i, 1).toLocaleString('default', { month: 'short' });
        //console.log("d",d);
        // let month = monthNames[d.getMonth()];
        // let year = d.getFullYear();
        // //console.log(month);
        // let MonthNames=`${month}-${year}`
        let data={ name: d, Total: 0 };;
        monthList.push(data);
   
    }

  return monthList;

}
const GetMonthName= (fireBasetimstamps)=>{
    const date = new Date(fireBasetimstamps.seconds * 1000);  // 2009-11-10
    return date.toLocaleString('default', { month: 'short' });
}
export const dbName = {
    Users: 'users',
    Subscribers: 'newSubscription',
    Expences: 'expences',
}

export const MoneyFormatter=(num)=> {

    if(Math.abs(num) > 999 && Math.abs(num) <= 99999){
        return Math.sign(num)*((Math.abs(num)/1000).toFixed(2)) + 'K';
    }
    else if (Math.abs(num) > 99999 && Math.abs(num) <=999999){
        return Math.sign(num)*((Math.abs(num)/100000).toFixed(2))+ 'L';
    }else if(Math.abs(num) > 9999999 && Math.abs(num) <=99999999){
        return Math.sign(num)*((Math.abs(num)/1000).toFixed(3)) + 'Cr';
    }else{
       return Math.sign(num)*Math.abs(num)
    }
    
}
    
