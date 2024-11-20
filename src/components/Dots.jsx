import { motion } from 'framer-motion'

const ellipsisVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

const Dots = ({ color = false }) => {
    return (
        <motion.span
            variants={ellipsisVariants}
            animate="animate"
            className="inline-flex ml-1"
        >
            <motion.span variants={dotVariants} className={`w-1 h-1 ${color ? 'bg-sky-950' : 'bg-gray-200'} rounded-full mx-0.5`} />
            <motion.span variants={dotVariants} className={`w-1 h-1 ${color ? 'bg-sky-950' : 'bg-gray-200'} rounded-full mx-0.5`} />
            <motion.span variants={dotVariants} className={`w-1 h-1 ${color ? 'bg-sky-950' : 'bg-gray-200'} rounded-full mx-0.5`} />
        </motion.span>
    )
}

export default Dots