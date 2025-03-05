import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
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
        setResults({ ...data, salarioMinimo, pensionResults })
        handleActiveSection('resultsTable')
    }

    return (
        <div className="max-w-md mx-auto mt-4 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center text-sky-900">
                Calculadora de Pensión
            </h2>

            <AnimatePresence mode="wait">
                {activeSection === 'flowSelection' && (
                    <ComponentTransition key="flowSelection">
                        <FlowSelection onSelection={handleActiveSection} />
                    </ComponentTransition>
                )}
                {activeSection === 'pdfUploader' && (
                    <ComponentTransition key="pdfUploader">
                        <PDFUploader
                            onPDFBack={handleCalculatorBack}
                            onDataExtracted={hangleDataExtracted}
                        />
                    </ComponentTransition>
                )}
                {activeSection === 'calculatorForm' && (
                    <ComponentTransition key="calculatorForm">
                        <CalculatorForm
                            onCalculatorBack={handleCalculatorBack}
                            onCalculate={handleCalculate}
                            data={dataExtracted}
                        />
                    </ComponentTransition>
                )}
                {activeSection === 'resultsTable' && (
                    <ComponentTransition key="resultsTable">
                        <ResultsTable onCalculatorBack={handleCalculatorBack} data={results} />
                    </ComponentTransition>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Calculator
