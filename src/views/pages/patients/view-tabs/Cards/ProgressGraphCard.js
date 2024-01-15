import React from 'react'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'
import {
    Button,
    Card,
    CardHeader,
    CardTitle,
} from "reactstrap"

// ** Custom Components
import Wizard from '@components/wizard'


const ProgressGraphCard = ({ labelColor, gridLineColor, warningColorShade, lineChartDanger, lineChartPrimary, title }) => {

    const datas = [
        ['Jan-03-2022', '(ID: 800)'],
        ['Jan-07-2022', '(ID: 802)'],
        ['Jan-10-2022', '(ID: 804)'],
        ['Jan-14-2022', '(ID: 806)'],
        ['Jan-18-2022', '(ID: 808)'],
        ['Jan-22-2022', '(ID: 810)'],
        ['Jan-26-2022', '(ID: 812)'],
        ['Jan-30-2022', '(ID: 814)'],
        ['Feb-03-2022', '(ID: 816)'],
        ['Feb-07-2022', '(ID: 818)'],
        ['Feb-11-2022', '(ID: 820)'],
        ['Feb-15-2022', '(ID: 822)'],
        ['Feb-19-2022', '(ID: 824)'],
        ['Feb-23-2022', '(ID: 826)'],
        ['Feb-27-2022', '(ID: 828)'],
        ['Mar-03-2022', '(ID: 830)'],
        ['Mar-07-2022', '(ID: 832)'],
        ['Mar-11-2022', '(ID: 834)'],
        ['Mar-15-2022', '(ID: 836)'],
        ['Mar-19-2022', '(ID: 838)'],
        ['Mar-23-2022', '(ID: 840)'],
        ['Mar-27-2022', '(ID: 842)'],
        ['Mar-31-2022', '(ID: 844)'],
        ['Apr-04-2022', '(ID: 846)'],
        ['Apr-08-2022', '(ID: 848)'],
        ['Apr-12-2022', '(ID: 850)'],
        ['Apr-16-2022', '(ID: 852)'],
        ['Apr-20-2022', '(ID: 854)'],
        ['Apr-24-2022', '(ID: 856)'],
        ['Apr-28-2022', '(ID: 858)'],
        ['May-02-2022', '(ID: 860)'],
        ['May-06-2022', '(ID: 862)'],
        ['May-10-2022', '(ID: 864)'],
        ['May-14-2022', '(ID: 866)'],
        ['May-18-2022', '(ID: 868)'],
        ['May-22-2022', '(ID: 870)'],
        ['May-26-2022', '(ID: 872)'],
        ['May-30-2022', '(ID: 874)'],
        ['Jun-03-2022', '(ID: 876)'],
        ['Jun-07-2022', '(ID: 878)'],
        ['Jun-11-2022', '(ID: 880)'],
        ['Jun-15-2022', '(ID: 882)'],
        ['Jun-19-2022', '(ID: 884)'],
        ['Jun-23-2022', '(ID: 886)'],
        ['Jun-27-2022', '(ID: 888)'],
        ['Jul-01-2022', '(ID: 890)'],
        ['Jul-05-2022', '(ID: 892)'],
        ['Jul-09-2022', '(ID: 894)'],
        ['Jul-13-2022', '(ID: 896)'],
        ['Jul-17-2022', '(ID: 898)']
    ]

    // Function to generate random data array
    const generateRandomData = (length) => {
        const randval = []
        for (let i = 0; i < length; i++) {
            randval.push(Math.floor(Math.random() * 10))
        }
        return randval
    }

    const labels = datas.map(([date]) => date);

    const options = {
        responsive: true,
        backgroundColor: false,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: { color: labelColor },
                grid: {
                    borderColor: gridLineColor,
                    color: gridLineColor
                }
            },
            y: {
                scaleLabel: { display: true },
                ticks: {
                    stepSize: 100,
                    color: labelColor
                },
                grid: {
                    borderColor: gridLineColor,
                    color: gridLineColor
                }
            }
        },
        plugins: {
            legend: {
                align: 'start',
                position: 'top',
                labels: {
                    boxWidth: 10,
                    marginBottom: 25,
                    color: labelColor,
                    usePointStyle: true
                }
            }
        }
    }
      // ** Chart Data
    const data = {
        labels,
        datasets: [
            {
                data: generateRandomData(50),
                fill: true,
                tension: 0.5,
                label: 'Wound Length',
                pointRadius: 6,
                pointHoverRadius: 6,
                borderDashOffset: 2,
                pointStyle: 'circle',
                pointHoverBorderWidth: 5,
                borderColor: '#4C95F4',
                pointBorderColor: '#4C95F4',
                backgroundColor: lineChartPrimary,
                pointHoverBackgroundColor: lineChartPrimary
            },
            {
                data: generateRandomData(50),
                fill: true,
                tension: 0.01,
                pointRadius: 6,
                label: 'Wound Width',
                pointHoverRadius: 6,
                borderDashOffset: 2,
                pointStyle: 'triangle',
                pointHoverBorderWidth: 5,
                borderColor: '#CDD5DB',
                pointBorderColor: '#CDD5DB',
                backgroundColor: lineChartDanger,
                pointHoverBackgroundColor: lineChartDanger
            },
            {
                data: generateRandomData(50),
                fill: true,
                tension: 0.5,
                pointRadius: 6,
                label: 'Wound Depth',
                pointHoverRadius: 5,
                borderDashOffset: 2,
                pointStyle: 'circle',
                pointHoverBorderWidth: 6,
                borderColor: '#EB7882',
                backgroundColor: warningColorShade,
                pointBorderColor: '#EB7882',
                pointHoverBackgroundColor: warningColorShade
            }
        ]
    }

    //** To add spacing between legends and chart
    const plugins = [
        {
            beforeInit(chart) {
                chart.legend.afterFit = function () {
                this.height += 20
                }
            }
        }
    ]



    return (
        <>
            <Card>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                    <CardTitle tag='h4'>{title}</CardTitle>
                </CardHeader>
                <div style={{ aspectRatio: '1.5' }}>
                    <Line data={data} options={options} plugins={plugins} />
                </div>
            </Card>
        </>
    )
}

export default ProgressGraphCard
