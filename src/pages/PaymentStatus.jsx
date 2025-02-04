import { useSearchParams } from "react-router-dom"
import Header from "../components/Header"
import Button from "../components/Button"
import { motion } from "framer-motion"
import Footer from "../components/Footer"

const PaymentStatus = () => {
  const [searchParams] = useSearchParams()
  const collectionStatus = searchParams.get("collection_status")
  const paymentId = searchParams.get("payment_id")
  const merchantOrderId = searchParams.get("merchant_order_id")

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto overflow-hidden md:max-w-2xl"
        >
          <div className="p-8 text-center">
            <h1 className="text-lg font-medium text-gray-100">
              {collectionStatus === "approved" ? "¡Pago Exitoso!" : collectionStatus === "rejected" ? "El pago ha fallado" : "Pago en proceso"}
            </h1>
            <div className="mt-6 text-gray-200">
              {collectionStatus === "approved" && <p>Disfruta los beneficios de tu plan</p>}
              {collectionStatus === "pending" && <p>Espera a la confirmación de pago exitoso para disfrutar los beneficios de tu suscripción</p>}
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6"
            >
              <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
                <Button to="/user" >
                    {collectionStatus === "rejected" ? "Volver a intentar" : "Entrar"}
                </Button>
              </div>
            </motion.div>
            <p className="text-sm text-gray-400 mt-4">Payment ID: {paymentId}</p>
            <p className="text-sm text-gray-400">Merchant Order ID: {merchantOrderId}</p>
          </div>
        </motion.div>
      </main>
      <Footer variant="fixed" />
    </div>
  )
}

export default PaymentStatus