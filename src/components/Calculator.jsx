import { useState } from 'react'
import FlowSelection from './FlowSelection'
import CalculatorForm from './CalculatorForm'
import { calculateAll } from '../utils/calculatePension'
import ResultsTable from './ResultsTable'
import PDFUploader from './PDFUploader'

const Calculator = ({ subscription }) => {
    const [activeSection, setActiveSection] = useState(
        subscription === 'free' ? 'calculatorForm' : 'flowSelection'
    )
    const [dataExtracted, setDataExtracted] = useState(null)
    const [results, setResults] = useState(null)

    const handleActiveSection = (action) => {
        setActiveSection(action)
    }

    const hangleDataExtracted = (data) => {
        setDataExtracted(data)
        handleActiveSection('calculatorForm')
    }

    const handleCalculatorBack = () => {
        setDataExtracted(null)
        handleActiveSection(subscription === 'free' ? 'calculatorForm' : 'flowSelection')
    }

    const handleCalculate = (data, salarioMinimo) => {
        const pensionResults = calculateAll(data, salarioMinimo)
        setResults({ ...data , salarioMinimo, pensionResults})
        handleActiveSection('resultsTable')
    }

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'flowSelection':
                return <FlowSelection onSelection={handleActiveSection} />
            case 'pdfUploader':
                return <PDFUploader onPDFBack={handleCalculatorBack} onDataExtracted={hangleDataExtracted} />
            case 'calculatorForm':
                return <CalculatorForm onCalculatorBack={handleCalculatorBack} onCalculate={handleCalculate} data={dataExtracted} />
            case 'resultsTable':
                return <ResultsTable onCalculatorBack={handleCalculatorBack} data={results} />
            default:
                return null
        }
    }

    return (
        <div className="max-w-md mx-auto mt-4 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center text-sky-900" >Calculadora de Pensión</h2>
            {renderActiveSection()}
        </div>
    )
}

export default Calculator