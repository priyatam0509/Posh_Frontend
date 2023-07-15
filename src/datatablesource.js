import React from 'react';
import ReactDOM from 'react-dom';
export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  // {
  //   field: "user",
  //   headerName: "User",
  //   width: 150,
  //   renderCell: (params) => {
  //     return (
  //       <div className="cellWithImg">
  //         <img className="cellImg" src={params.row.img} alt="avatar" />
  //         {params.row.username}
  //       </div>
  //     );
  //   },
  // },
  {
    field: "firstname",
    headerName: "First Name",
    width: 100,
  },
  {
    field: "lastname",
    headerName: "Last Name",
    width: 100,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
  },
  {
    field: "phone",
    headerName: "Phone No.",
    width: 120,
  },
  {
    field: "gender",
    headerName: "Gender",
    width: 100,
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 100,
  },

  {
    field: "subscription",
    headerName: "Subscription",
    width: 120,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 100,
  },
  {
    field: "endDate",
    headerName: "Expired Date",
    width: 100,
  },
  {
    field: "payment",
    headerName: "Payment Mode",
    width: 100,
  },
  // {
  //   field: "status",
  //   headerName: "Status",
  //   width: 160,
  //   renderCell: (params) => {
  //     return (
  //       <div className={`cellWithStatus ${params.row.status}`}>
  //         {params.row.status}
  //       </div>
  //     );
  //   },
  // },
];
