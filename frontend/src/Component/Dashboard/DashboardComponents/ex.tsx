import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const Home: React.FC = () => {
    // Static data for the last 7 days
    const presentData = [5, 6, 4, 7, 3, 5, 6];
    const absentData = [1, 0, 2, 0, 4, 2, 1];
    const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

    const chartRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current);

            const option = {
                title: {
                    text: 'Attendance for Last 7 Days',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                    formatter: (params: any) => {
                        let result = `${params[0].name}<br>`;
                        params.forEach((item: any) => {
                            result += `${item.seriesName}: ${item.value}<br>`;
                        });
                        return result;
                    },
                },
                legend: {
                    selectedMode: false
                },
                xAxis: {
                    type: 'category',
                    data: days,
                    axisLabel: {
                        rotate: 45,
                    },
                },
                yAxis: {
                    type: 'value',
                    name: 'Count',
                    axisLabel: {
                        formatter: '{value}',
                    },
                },
                series: [
                    {
                        name: 'Present',
                        type: 'bar',
                        data: presentData,
                        emphasis: {
                            focus: 'series',
                        },
                    },
                    {
                        name: 'Absent',
                        type: 'bar',
                        data: absentData,
                        emphasis: {
                            focus: 'series',
                        },
                    },
                ],
            };

            chart.setOption(option);

            return () => {
                chart.dispose();
            };
        }
    }, [presentData, absentData, days]);

    return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default Home;
