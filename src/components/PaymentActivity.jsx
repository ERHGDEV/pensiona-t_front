import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfYear, endOfYear, eachMonthOfInterval, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const PaymentActivity = ({ payments }) => {
    const [viewType, setViewType] = useState('day')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [chartData, setChartData] = useState(null)
    const [showAll, setShowAll] = useState(false)

    const availableYears = Array.from(
        new Set(payments.map(p => format(new Date(p.date), 'yyyy')))
    ).sort((a, b) => b - a) 
    
    const availableMonths = Array.from(
        new Set(
            payments
                .filter(p => format(new Date(p.date), 'yyyy') === format(selectedDate, 'yyyy'))
                .map(p => format(new Date(p.date), 'yyyy-MM'))
        )
    ).sort()    

    useEffect(() => {
        prepareChartData()
    }, [viewType, selectedDate, showAll])

    const prepareChartData = () => {
        let labels = []
        let amounts = []
    
        const approvedPayments = payments.filter(p => p.status === 'approved')
    
        if (viewType === 'day') {
            const start = showAll
                ? new Date(Math.min(...approvedPayments.map(p => new Date(p.date))))
                : startOfMonth(selectedDate)
            const end = showAll
                ? new Date(Math.max(...approvedPayments.map(p => new Date(p.date))))
                : endOfMonth(selectedDate)
    
            const days = eachDayOfInterval({ start, end })
            labels = days.map(day => format(day, 'dd-MMM', { locale: es }))
    
            amounts = days.map(day => {
                const total = approvedPayments
                    .filter(p => format(new Date(p.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                    .reduce((sum, p) => sum + p.amount, 0)
                return total
            })
        } else if (viewType === 'month') {
            const start = showAll
                ? new Date(Math.min(...approvedPayments.map(p => new Date(p.date))))
                : startOfYear(selectedDate)
            const end = showAll
                ? new Date(Math.max(...approvedPayments.map(p => new Date(p.date))))
                : endOfYear(selectedDate)
    
            const months = eachMonthOfInterval({ start, end })
            labels = months.map(month => format(month, 'MMM-yyyy', { locale: es }))
    
            amounts = months.map(month => {
                const total = approvedPayments
                    .filter(p => format(new Date(p.date), 'yyyy-MM') === format(month, 'yyyy-MM'))
                    .reduce((sum, p) => sum + p.amount, 0)
                return total
            })
        }
    
        setChartData({
            labels,
            datasets: [
                {
                    label: 'Ingresos ($)',
                    data: amounts,
                    borderColor: '#082f49',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    tension: 0.1,
                },
            ],
        })
    }    

    return (
        <div className="bg-gray-50 rounded shadow-md p-4 mt-4 h-[460px]">
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sky-950">Actividad de Pagos</h2>
                <button
                    className={`px-4 py-2 rounded ${showAll ? 'bg-sky-700 text-white' : 'bg-gray-300 text-gray-800'}`}
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? 'Ver Específico' : 'Ver Todo'}
                </button>
            </div>
            <div className="mb-4 flex justify-between items-center">
                <div className="flex space-x-2">
                    <button className={`px-4 py-2 rounded ${viewType === 'day' ? 'bg-sky-700 text-white' : 'bg-gray-300 text-gray-800'}`} onClick={() => setViewType('day')}>Por Día</button>
                    <button className={`px-4 py-2 rounded ${viewType === 'month' ? 'bg-sky-700 text-white' : 'bg-gray-300 text-gray-800'}`} onClick={() => setViewType('month')}>Por Mes</button>
                </div>
                <div className="flex justify-between items-center mb-2">
                    {!showAll && (
                        viewType === 'day' ? (
                            <select
                                value={format(selectedDate, 'yyyy-MM')}
                                onChange={(e) => {
                                    const newDate = parseISO(e.target.value + '-01');
                                    if (!isNaN(newDate.getTime())) {
                                        setSelectedDate(newDate);
                                    }
                                }}
                                className="rounded px-2 py-1 text-gray-700"
                            >
                                {availableMonths.map((month) => (
                                    <option key={month} value={month}>
                                        {format(parseISO(month + '-01'), 'MMMM yyyy', { locale: es })}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <select
                                value={format(selectedDate, 'yyyy')}
                                onChange={(e) => {
                                    const newDate = new Date(e.target.value, 0, 1);
                                    if (!isNaN(newDate.getTime())) {
                                        setSelectedDate(newDate);
                                    }
                                }}
                                className="rounded px-2 py-1 text-gray-700"
                            >
                                {availableYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        )
                    )}
                </div>
            </div>
            
            {chartData && (
                <div className="h-80">
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Ingresos ($)',
                                        color: '#082f49',
                                    },
                                    ticks: { color: '#082f49' },
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: viewType === 'day' ? 'Fecha' : 'Mes',
                                        color: '#082f49',
                                    },
                                    ticks: { color: '#082f49' },
                                },
                            },
                            plugins: {
                                legend: { labels: { color: '#000000' } },
                            },
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default PaymentActivity
