import { useState } from "react"
import Header from "../components/Header"

const Privacity = () => {
    const [showMore, setShowMore] = useState(false)

    return (
        <>
            <Header />
            <div className="bg-gray-50 text-pretty mt-4 py-10 px-6 sm:px-10 lg:px-20 max-w-5xl mx-auto rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Aviso de Privacidad
                </h1>
                <p className="text-sm text-gray-500 mb-4">
                    <strong>Última actualización:</strong> 15 de enero del 2025
                </p>
                <p className="text-gray-700 mb-6">
                    En <strong>Pensiona-T</strong> (en adelante, "el Sitio"), estamos
                    comprometidos con la protección de los datos personales de nuestros
                    usuarios. Este Aviso de Privacidad explica cómo recopilamos, utilizamos
                    y protegemos su información personal, así como los derechos que tiene
                    sobre la misma.
                </p>

                { showMore && (
                    <>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            1. Responsable del tratamiento de los datos personales
                        </h2>
                        <p className="text-gray-700 mb-6">
                            El responsable del tratamiento de sus datos personales es{" "}
                            <strong>Pensiona-T</strong>, con domicilio en{" "}
                            <strong>Chihuahua, México</strong> y correo electrónico de contacto:{" "}
                            <a
                            href="mailto:contacto@pensiona-t.com"
                            className="text-blue-600 underline hover:text-blue-800"
                            >
                            contacto@pensiona-t.com
                            </a>.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            2. Datos personales que recopilamos
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Para los diferentes servicios ofrecidos en el Sitio, recopilamos y tratamos los siguientes datos:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 mb-6">
                            <li>
                            <strong>Datos para registro de usuarios:</strong> Nombre completo y
                            correo electrónico (almacenados en nuestra base de datos).
                            </li>
                            <li>
                            <strong>Datos para cálculo de proyecciones de pensión:</strong> Salario
                            promedio, cantidad de semanas cotizadas, edad, estado civil y cantidad
                            de hijos (procesados en línea, no almacenados).
                            </li>
                            <li>
                            <strong>Datos para análisis de reportes de semanas cotizadas:</strong>{" "}
                            Se extraen semanas cotizadas, salario promedio de los últimos 5 años y
                            edad (procesados en línea, no almacenados).
                            </li>
                            <li>
                            <strong>Datos para consulta de AFORE:</strong> Número de Seguridad
                            Social (NSS) o CURP (procesados en línea, no almacenados).
                            </li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            3. Finalidades del tratamiento de los datos personales
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Los datos personales proporcionados por el usuario serán utilizados para:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 mb-6">
                            <li>Gestionar su cuenta en el Sitio.</li>
                            <li>
                            Proveer los servicios solicitados, como el cálculo de proyecciones de
                            pensión, análisis de semanas cotizadas y consulta de AFORE.
                            </li>
                            <li>
                            Enviar comunicaciones relacionadas con nuestros servicios, siempre con
                            su consentimiento.
                            </li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            4. Transferencia de datos personales
                        </h2>
                        <p className="text-gray-700 mb-6">
                            No compartimos ni transferimos sus datos personales a terceros sin su
                            consentimiento, salvo en los casos establecidos por la ley.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            5. Seguridad de los datos
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Implementamos medidas de seguridad técnicas, administrativas y físicas
                            para proteger sus datos personales contra daño, pérdida, alteración,
                            acceso no autorizado o tratamiento indebido.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            6. Derechos ARCO
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al
                            tratamiento de sus datos personales. Para ejercer estos derechos, puede
                            enviar una solicitud al correo electrónico{" "}
                            <a
                            href="mailto:contacto@pensiona-t.com"
                            className="text-blue-600 underline hover:text-blue-800"
                            >
                            contacto@pensiona-t.com
                            </a>
                            , incluyendo:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 mb-6">
                            <li>Su nombre completo.</li>
                            <li>
                            Una descripción clara de los datos sobre los que desea ejercer sus
                            derechos.
                            </li>
                            <li>Documentos que acrediten su identidad.</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            7. Uso de cookies y tecnologías similares
                        </h2>
                        <p className="text-gray-700 mb-6">
                            El Sitio utiliza cookies para mejorar la experiencia del usuario. Usted
                            puede deshabilitar las cookies a través de la configuración de su
                            navegador.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            8. Cambios al Aviso de Privacidad
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Nos reservamos el derecho de modificar este Aviso de Privacidad en
                            cualquier momento. Cualquier cambio será notificado a través del Sitio.
                        </p>

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            9. Contacto
                        </h2>
                        <p className="text-gray-700">
                            Si tiene preguntas o inquietudes sobre este Aviso de Privacidad, puede
                            contactarnos en:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 mt-4">
                            <li>
                            Correo electrónico:{" "} 
                            <a
                                href="mailto:contacto@pensiona-t.com"
                                className="text-blue-600 underline hover:text-blue-800"
                            >
                                contacto@pensiona-t.com
                            </a>
                            </li>
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
        </>
    )
}

export default Privacity
