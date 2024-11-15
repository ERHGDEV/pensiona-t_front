export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card relative bg-sky-700 rounded-lg p-6 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
      <div className="text-sky-300 text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sky-200">{description}</p>
    </div>
  )
}