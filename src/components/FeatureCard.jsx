const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="text-sky-500 text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
)

export default FeatureCard