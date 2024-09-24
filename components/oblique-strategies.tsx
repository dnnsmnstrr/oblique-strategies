'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

const obliqueStrategies = [
  "Use an old idea",
  "State the problem in words as clearly as possible",
  "Only one element of each kind",
  "What would your closest friend do?",
  "What to increase? What to reduce?",
  "Are there sections? Consider transitions",
  "Try faking it!",
  "Honour thy error as a hidden intention",
  "Ask your body",
  "Work at a different speed",
  "Look closely at the most embarrassing details and amplify them",
  "Don't be afraid of things because they're easy to do",
  "Don't be frightened of clichés",
  "What is the reality of the situation?",
  "Simple subtraction",
  "Fill every beat with something",
]

export function ObliqueStrategiesComponent() {
  const [strategy, setStrategy] = useState(() => obliqueStrategies[Math.floor(Math.random() * obliqueStrategies.length)])
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipCount, setFlipCount] = useState(0)

  const getRandomStrategy = useCallback(() => {
    if (isFlipping) return
    setIsFlipping(true)
    setFlipCount(prev => prev + 1)
    setTimeout(() => {
      let newStrategy
      do {
        newStrategy = obliqueStrategies[Math.floor(Math.random() * obliqueStrategies.length)]
      } while (newStrategy === strategy)
      setStrategy(newStrategy)
      setIsFlipping(false)
    }, 250) // Half of the flip duration
  }, [strategy, isFlipping])

  const textVariants = {
    hidden: (custom: number) => ({
      opacity: 0,
      rotateY: custom % 2 === 0 ? 0 : 180,
    }),
    visible: (custom: number) => ({
      opacity: 1,
      rotateY: custom % 2 === 0 ? 0 : 180,
      transition: {
        opacity: { duration: 0.3, delay: 0 },
        rotateY: { duration: 0.01, delay: 0.3 },
      },
    }),
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <div className="perspective-1000 w-80 h-48">
      <motion.div
        animate={{ rotateY: flipCount * 180 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="preserve-3d cursor-pointer w-full h-full relative"
        onClick={getRandomStrategy}
      >
        <Card className="w-full h-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 absolute inset-0 backface-hidden">
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.p
                key={strategy + '-front'}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={flipCount}
                className="text-xl text-center font-medium text-gray-800"
              >
                {strategy}
              </motion.p>
            </AnimatePresence>
          </CardContent>
        </Card>
        <Card className="w-full h-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 absolute inset-0 backface-hidden [transform:rotateY(180deg)]">
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.p
                key={strategy + '-back'}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={flipCount + 1}
                className="text-xl text-center font-medium text-gray-800"
              >
                {strategy}
              </motion.p>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}