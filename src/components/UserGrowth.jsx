import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { format, eachDayOfInterval } from 'date-fns'
import { es } from 'date-fns/locale'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const UserGrowthChart = ({ users }) => {
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    if (users && users.length > 0) {
      prepareChartData()
    }
  }, [users])

  const prepareChartData = () => {
    // Determinar la fecha más antigua y la fecha actual
    const oldestDate = new Date(
      Math.min(...users.map((user) => new Date(user.created).getTime()))
    )
    const today = new Date()

    // Generar un intervalo de días entre la fecha más antigua y hoy
    const days = eachDayOfInterval({ start: oldestDate, end: today })

    // Calcular el crecimiento acumulado de usuarios por día
    const cumulativeUserCounts = days.map((day) => {
      const usersUpToDate = users.filter(
        (user) => new Date(user.created) <= day
      ).length

      return { x: format(day, 'dd-MMM', { locale: es }), y: usersUpToDate }
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
    <div className="bg-gray-50 rounded shadow-md p-4 mt-8">
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
