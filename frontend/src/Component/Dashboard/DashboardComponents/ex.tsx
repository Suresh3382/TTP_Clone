// import React, { useEffect, useRef, useState } from 'react';
// import dayjs from 'dayjs';
// import * as echarts from 'echarts';
// import { Circle } from 'react-icons'; // Replace this with the correct import for Circle

// const LeaveChart = ({ baseURL, ERequstName }) => {
//   const chartRef = useRef(null);
//   const [thisYearLeaves, setThisYearLeaves] = useState(0);

//   useEffect(() => {
//     const myChart = echarts.init(chartRef.current);

//     callApi({
//       requestEndpoint: `${baseURL}user/getLeaveRequest`,
//       method: 'post',
//       body: { status: ERequstName },
//     })
//       .then((res) => {
//         const leaveData = res.data.data;

//         const monthlyLeaveCount = Array(12).fill(0);

//         leaveData.forEach((request) => {
//           const month = dayjs(request.from).month();
//           monthlyLeaveCount[month] += 1;
//           setThisYearLeaves((prev) => prev + 1);
//         });

//         const option = {
//           tooltip: {
//             trigger: 'item',
//             axisPointer: {
//               type: 'none',
//             },
//           },
//           title: {
//             text: 'Monthly Leave',
//             left: 'center', // Center title to avoid too much space on the left
//             top: '2%',
//             textStyle: {
//               fontFamily: 'outfit',
//               fontSize: 18,
//               fontWeight: 'bold',
//               color: '#333',
//             },
//           },
//           legend: {
//             top: 2,
//             right: '5%', // Adjust the position if necessary
//             selectedMode: false,
//             textStyle: {
//               fontFamily: 'outfit',
//               color: '#333',
//             },
//           },
//           xAxis: {
//             type: 'category',
//             data: [
//               'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
//             ],
//             axisLabel: {
//               fontFamily: 'Outfit',
//               fontSize: 14,
//               padding: [5, 0, 5, 0], // Adjust padding if necessary
//             },
//           },
//           yAxis: {
//             type: 'value',
//             axisLabel: {
//               fontFamily: 'Outfit',
//               fontSize: 14,
//             },
//             min: 0,
//             max: 10,
//           },
//           grid: {
//             top: 50,
//             left: '5%', // Reduce left space
//             right: '5%', // Reduce right space
//             bottom: 18,
//           },
//           series: [
//             {
//               name: 'Leaves Taken',
//               data: monthlyLeaveCount,
//               type: 'bar',
//               itemStyle: {
//                 borderRadius: [3, 3, 0, 0],
//               },
//               barWidth: '30%', // Adjust bar width to fit better
//             },
//           ],
//         };

//         myChart.setOption(option);

//         return () => {
//           myChart.dispose();
//         };
//       })
//       .catch((err) => {
//         console.error('Error fetching leave data', err);
//       });
//   }, [baseURL, ERequstName]);

//   return (
//     <div className="flex justify-center bg-[#f0f3f8] rounded-xl w-full my-4 gap-4 p-4">
//       <div className="flex items-center flex-col justify-center gap-4">
//         <div className="bg-white flex flex-col gap-2 w-64 text-center py-3.5 rounded-lg">
//           <p className="text-2xl">{'12 / 12'}</p>
//           <p className="flex bg-yellow-50 rounded-lg mx-3 my-1 flex justify-center items-center gap-2 px-4 py-1.5 text-sm">
//             <Circle className="text-yellow-500" size={12} />
//             Paid Available / Allotted
//           </p>
//         </div>
//         <div className="bg-white flex flex-col gap-2 w-64 text-center py-3.5 rounded-lg">
//           <p className="text-2xl">{thisYearLeaves}</p>
//           <p className="flex bg-purple-50 rounded-lg mx-3 my-1 flex justify-center items-center gap-2 px-4 py-1.5 text-sm">
//             <Circle className="text-purple-500" size={12} />
//             Leave Taken
//           </p>
//         </div>
//       </div>
//       <div className="flex items-center justify-center w-[45%]">
//         <div
//           className="bg-white rounded-xl py-4"
//           ref={chartRef}
//           style={{ width: '100%', height: '230px', padding: 0, margin: 0 }}
//           id="main"
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default LeaveChart;
