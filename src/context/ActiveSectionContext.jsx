import { createContext, useContext, useState } from "react"

const ActiveSectionContext = createContext()

export const ActiveSectionProvider = ({ children }) => {
    const [activeSection, setActiveSection] = useState('calculator')

    return (
        <ActiveSectionContext.Provider value={{ activeSection, setActiveSection }}>
            {children}
        </ActiveSectionContext.Provider>
    )
}

export const useActiveSection = () => useContext(ActiveSectionContext)