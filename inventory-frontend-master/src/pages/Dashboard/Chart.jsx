import React from 'react'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const Chart = () => {
    const data = [
        {
            name: 'Jan',
            Site1: 4000,
            Site2: 2400,
            Site3: 1000,
            Site4: 3400,
            amt: 2400,
        },
        {
            name: 'Feb',
            Site1: 3000,
            Site2: 1398,
            Site3: 1000,
            Site4: 3400,
            amt: 2210,
        },
        {
            name: 'March',
            Site1: 2000,
            Site2: 9800,
            Site3: 1000,
            Site4: 3400,
            amt: 2290,
        },
        {
            name: 'April',
            Site1: 4000,
            Site2: 2400,
            Site3: 1000,
            Site4: 3400,
            amt: 2400,
        },
        {
            name: 'May',
            Site1: 3000,
            Site2: 1398,
            Site3: 1000,
            Site4: 3400,
            amt: 2210,
        },
        {
            name: 'June',
            Site1: 2000,
            Site2: 9800,
            Site3: 1000,
            Site4: 3400,
            amt: 2290,
        }
    ]
    return (
        <div class="card">
            <div class="card-body">
                <div style={{ minHeight: '400px' }}>
                    <BarChart
                        width={1200}
                        height={400}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Site2" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blSite3" />} />
                        <Bar dataKey="Site1" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                        <Bar dataKey="Site4" fill="#ffb61d" activeBar={<Rectangle fill="pink" stroke="blSite3" />} />
                        <Bar dataKey="Site3" fill="#43b8f9" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                    </BarChart>
                </div>
            </div>
        </div>
    )
}

export default Chart