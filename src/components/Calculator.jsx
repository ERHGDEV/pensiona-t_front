import { useState } from 'react'
import FlowSelection from './FlowSelection'
import CalculatorForm from './CalculatorForm'
import { calculateAll } from '../utils/calculatePension'
import ResultsTable from './ResultsTable'
import PDFUploader from './PDFUploader'
import ComponentTransition from './ComponentTransition'

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
                return (
                    <ComponentTransition key="flowSelection">
                        <FlowSelection onSelection={handleActiveSection} />
                    </ComponentTransition>
                )
            case 'pdfUploader':
                return (
                    <ComponentTransition key="pdfUploader">
                        <PDFUploader
                            onPDFBack={handleCalculatorBack}
                            onDataExtracted={hangleDataExtracted}
                        />
                    </ComponentTransition>
                )
            case 'calculatorForm':
                return (
                    <ComponentTransition key="calculatorForm">
                        <CalculatorForm
                            onCalculatorBack={handleCalculatorBack}
                            onCalculate={handleCalculate}
                            data={dataExtracted}
                        />
                    </ComponentTransition>
                )
            case 'resultsTable':
                return (
                    <ComponentTransition key="resultsTable">
                        <ResultsTable
                            onCalculatorBack={handleCalculatorBack}
                            data={results}
                        />
                    </ComponentTransition>
                )
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