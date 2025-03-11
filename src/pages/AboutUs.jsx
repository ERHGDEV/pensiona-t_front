import { useState } from "react"
import Footer from "../components/Footer"

const AboutUs = () => {
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      <div className="bg-gray-50 text-pretty mt-4 py-10 px-6 sm:px-10 lg:px-20 max-w-5xl mx-auto rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Acerca de Pensiona-T</h1>
        <p className="text-gray-700 mb-6">
          <strong>Pensiona-T</strong> es una plataforma diseñada para ayudar a los trabajadores del 
          IMSS bajo la <strong>Ley 73</strong> a proyectar su pensión y tomar decisiones informadas 
          sobre su retiro. Permite calcular la diferencia entre una pensión normal y una con 
          <strong> Modalidad 40</strong>, así como conocer los pagos mensuales al IMSS y la inversión total necesaria.
        </p>

        {showMore && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">¿Qué puedes hacer en Pensiona-T?</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6">
                <li><strong>Proyecciones de pensión:</strong> Calcula cuánto recibirás al jubilarte bajo la Ley 73.</li>
                <li><strong>Comparativa con Modalidad 40:</strong> Analiza si te conviene pagar para mejorar tu pensión.</li>
                <li><strong>Inversión y pagos:</strong> Conoce cuánto deberás aportar al IMSS y la inversión total.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Nuestra Misión</h2>
            <p className="text-gray-700 mb-6">
              Brindar asesoría confiable para que los trabajadores puedan planear su retiro con seguridad y tranquilidad, 
              optimizando su pensión de acuerdo con su situación personal.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">Nuestra Visión</h2>
            <p className="text-gray-700 mb-6">
              Ser la plataforma líder en información y gestión de pensiones en México, ayudando a miles de trabajadores 
              a tomar decisiones financieras inteligentes para su futuro.
            </p>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">Nuestros Valores</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li><strong>Transparencia:</strong> Información clara y precisa sobre tu pensión.</li>
              <li><strong>Compromiso:</strong> Ayudarte a tomar las mejores decisiones para tu futuro.</li>
              <li><strong>Excelencia:</strong> Ofrecer herramientas precisas y confiables.</li>
            </ul>
          </>
        )}
      </div>

      <div className="flex justify-center mt-4 mb-4">
        <button
          onClick={() => setShowMore(!showMore)}
          className="bg-pretty text-white py-2 px-4 rounded-lg"
        >
          {showMore ? "Mostrar menos ↑" : "Mostrar más ↓"}
        </button>
      </div>

      {showMore ? <Footer /> : <Footer variant="fixed" />}
    </>
  )
}

export default AboutUs