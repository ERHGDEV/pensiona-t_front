import { useState } from "react"
import generatePDF from "../utils/generatePDF"
import Button from "./Button"
import Dots from "./Dots"
import axiosInstance from "../services/axiosConfig"

const ResultsTable = ({ data, onCalculatorBack }) => {
    const [isGenerating, setIsGenerating] = useState(false)
    const pensionPorEdad = data.pensionResults.normalResults.pensionPorEdad
    const pensionModalidad40 = data?.pensionResults?.modalidad40Results?.pensionModalidad40 || null;
    
    const incrementReportsCount = async () => {
        try {
            await axiosInstance.put('/user/increment-reportes')
        } catch (error) {
            console.error('Error al incrementar el contador de reportes:', error)
        }
    }

    const handleGeneratePdf = () => {
        if (!data) return
        setIsGenerating(true)
        setTimeout(() => {
            generatePDF(data)
            incrementReportsCount()
            setIsGenerating(false)
        }, 3000)
    }

    return (
        <>
            <div className="rounded-lg overflow-x-auto">
                <table className="w-full text-center text-gray-700">
                    <thead className="text-xs uppercase bg-sky-800 text-white">
                        <tr>
                            <th className="px-2 py-3" >Edad</th>
                            <th className="px-2 py-3" >%</th>
                            <th className="px-4 py-3" >Pensión</th>
                            {pensionModalidad40 && (
                                <th className="px-4 py-3 bg-sky-900 whitespace-nowrap" >Con Mod40</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data &&
                            pensionPorEdad.map((result, index) => (
                            <tr
                                key={index}
                                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200 transition-colors duration-200`}
                            >
                                <td className="px-2 py-3 whitespace-nowrap font-semibold">{result.age}</td>
                                <td className="px-2 py-3 whitespace-nowrap">{result.percentage}%</td>
                                <td className="px-4 py-3 whitespace-nowrap font-semibold">${result.pension.toFixed(2)}</td>
                                {pensionModalidad40 && (
                                    <td className="px-4 py-3 whitespace-nowrap font-bold text-sky-800">
                                        ${pensionModalidad40[index].pension.toFixed(2)}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-center text-sky-800 mt-4">
                Haz clic en <span className="font-bold">"Detalle"</span> para ver la tabla completa
            </p>
            <div className="mt-4 flex flex-row gap-4 max-w-fit mx-auto">
                <Button order="primary" onClick={onCalculatorBack}>
                    Volver
                </Button>
                <Button onClick={handleGeneratePdf} disabled={isGenerating}>
                    {isGenerating ? (
                        <span>
                            Generando
                            <Dots />
                        </span>
                    ): (
                        "Detalle"
                    )}
                </Button>
            </div>
        </>
    )
}

export default ResultsTable