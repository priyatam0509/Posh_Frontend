import {React, useEffect, useRef,useState} from 'react';
import ReactDOM from 'react-dom';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import ActiveUserFeatured from "../../components/featured/ActiveUserFeatured";
import Chart from "../../components/chart/Chart";
import ActiveUserChart from "../../components/chart/ActiveUserChart";
import Table from "../../components/table/Table";




const Home = () => {

  const gridRef = useRef(null);
  const [gridWidth, setGridWidth] = useState(1);
  const [gridHeight, setGridHeight] = useState(1);
  //const e = window.onerror;

  //const defaultOnErrorFn = useRef(window.onerror);

// useEffect(() => {
//   window.onerror = (...args) => {
//     if (args[0] === 'ResizeObserver loop limit exceeded') {
//       return true;
//     } else {
//       //defaultOnErrorFn.current && defaultOnErrorFn.current(...args);
//     }
//   };
//   return () => {
//     //window.onerror = defaultOnErrorFn.current;
//   };
// }, []);
  //console.log("Home 3 ",e)
  // window.onerror = function(err) {
  //   if(err === 'ResizeObserver loop limit exceeded') {
  //     //console.log("Home 3 ",e)
  //     console.warn('Ignored: ResizeObserver loop limit exceeded');
  //     return false;
  //   } else {
  //     //console.log("Home else ",err)
  //     //return e(...arguments);
  //   }
  // }
  // const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/
  // Cypress.on('uncaught:exception', (err) => {
  //     /* returning false here prevents Cypress from failing the test */
  //     if (resizeObserverLoopErrRe.test(err.message)) {
  //         return false
  //     }
  // });
//   const { ResizeObserver } = window;
// console.log("ResizeObserver",ResizeObserver)
// console.log("sdfasdf",gridRef)
    // don't break in Node.js (SSR), jest/jsdom, and browsers that don't support ResizeObserver
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    // if (ResizeObserver != null) {

    // //   const observer = new ResizeObserver(function (entries) {
    // //     console.log("asdasdf",entries);
       
    // //       observer.unobserve();
    // // // ...manipulate the element...
    // //     setTimeout(function () {
    // //    // observer.observe(element);
    // //   }, 0);
    // // });

    // var ro = new ResizeObserver(function () {
    //   console.log("asdfasdf");
    // 	//entries[0].target.classList.add('big');
    // });
    // //ro.unobserve()
    // ro.disconnect()


    //   //new ResizeObserver(_.debounce(entries => {}, 200));
    // }



//     const resizeObserver = new ResizeObserver(() => {
//       // Get dimensions without scrollbars.
//       // The dimensions given by the callback entries in Firefox do not substract the scrollbar sizes.
//       const { clientWidth, clientHeight } = gridRef.current;
//       console.log("asdsdfasdf",{ clientWidth, clientHeight })
//       // TODO: remove once fixed upstream
//       // we reduce width by 1px here to avoid layout issues in Chrome
//       // https://bugs.chromium.org/p/chromium/issues/detail?id=1206298
//       setGridWidth(clientWidth - (devicePixelRatio % 1 === 0 ? 0 : 1));
//       setGridHeight(clientHeight);
//     });
// console.log("gridRef.current",gridRef.current)
//     resizeObserver.observe(gridRef.current);

    // resizeObserver.disconnect();
    // return () => {
    //   resizeObserver.disconnect();
    // };
  // const obs= new ResizeObserver(entity=>{
  //       console.log(entity);
  // });

  //obs.subscribe("100")
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="product" />
          <Widget type="order" />
          <Widget type="earning" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 12 Months (Revenue)" aspect={2 / 1} />
        </div>
        <div className="charts">
          <ActiveUserFeatured />
          <ActiveUserChart title="Last 12 Months (Users)" aspect={2 / 1} />
        </div>        
        {/* <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div> */}
      </div>
    </div>
  );
};

export default Home;