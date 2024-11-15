import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import axiosInstance from '../services/axiosConfig'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const UserActivity = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    fetchLoginData()
  }, [selectedMonth])

  const fetchLoginData = async () => {
    try {
      const start = startOfMonth(selectedMonth)
      const end = endOfMonth(selectedMonth)
      const response = await axiosInstance.get('/admin/login-history', {
        params: { start: start.toISOString(), end: end.toISOString() }
      })
      prepareChartData(response.data, start, end)
    } catch (error) {
      console.error('Error fetching login data:', error)
    }
  }

  const prepareChartData = (data, start, end) => {
    const days = eachDayOfInterval({ start, end })
  
    const loginCounts = days.map(day => {
      const formattedDay = format(day, 'yyyy-MM-dd')
      const loginDataForDay = data.find(login => login.date === formattedDay)
      const count = loginDataForDay ? loginDataForDay.count : 0
      return { x: format(day, 'dd-MMM', { locale: es }), y: count }
    })
  
    setChartData({
      labels: loginCounts.map(d => d.x),
      datasets: [
        {
          label: 'Inicios de sesión',
          data: loginCounts.map(d => d.y),
          borderColor: '#082f49',
          backgroundColor: 'rgba(255,255,255,0.2)',
          tension: 0.1
        }
      ]
    })
  }

  const handleMonthChange = (e) => {
    const selectedDate = parseISO(e.target.value + '-01')
    setSelectedMonth(selectedDate)
  }

  return (
    <div className="bg-gray-50 rounded shadow-md p-4 mt-8">
        <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold mb-4 text-sky-950">Actividad de Usuarios</h2>
            <input
                type="month"
                value={format(selectedMonth, 'yyyy-MM')}
                onChange={handleMonthChange}
                className="border rounded px-2 py-1 text-gray-700"
            />
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
                                text: 'Inicios de sesión',
                                color: '#082f49',
                            },
                            ticks: {
                                color: '#082f49'
                            }
                            },
                            x: {
                            title: {
                                display: true,
                                text: 'Fecha',
                                color: '#082f49',
                            },
                            ticks: {
                                color: '#082f49'
                            }
                            }
                        },
                        plugins: {
                            legend: {
                            labels: {
                                color: '#000000'
                            }
                            }
                        }
                        }}
                    />
                </div>
            )
        }
    </div>
  )
}

export default UserActivity
