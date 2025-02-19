import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { format, eachDayOfInterval, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const UserGrowthChart = ({ users }) => {
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    if (users && users.length > 0) {
      prepareChartData()
    }
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return format(parseISO(dateString), 'dd-MMM', { locale: es })
  }

  const prepareChartData = () => {
    const oldestDate = new Date(
      Math.min(...users.map((user) => new Date(user.created).getTime()))
    )
    const today = new Date()
  
    const days = eachDayOfInterval({ start: oldestDate, end: today })
  
    const cumulativeUserCounts = days.map((day) => {
      const startOfDay = new Date(day.setHours(0, 0, 0, 0))
      const usersUpToDate = users.filter(
        (user) => new Date(user.created).setHours(0, 0, 0, 0) <= startOfDay
      ).length
  
      return { x: formatDate(day.toISOString()), y: usersUpToDate }
    })
  
    setChartData({
      labels: cumulativeUserCounts.map((d) => d.x),
      datasets: [
        {
          label: 'Crecimiento de Usuarios',
          data: cumulativeUserCounts.map((d) => d.y),
          borderColor: '#082f49',
          backgroundColor: 'rgba(255,255,255,0.2)',
          tension: 0.1,
        },
      ],
    })
  }

  return (
    <div className="bg-gray-50 rounded shadow-md p-4 mt-4 h-[400px]">
      <h2 className="text-2xl font-bold text-sky-950 mb-4">Crecimiento de Usuarios</h2>
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
                    text: 'Cantidad de Usuarios',
                    color: '#082f49',
                  },
                  ticks: {
                    color: '#082f49',
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: 'Fecha',
                    color: '#082f49',
                  },
                  ticks: {
                    color: '#082f49',
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: '#000000',
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  )
}

export default UserGrowthChart
