'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

export function ObliqueStrategiesComponent() {
  const [strategy, setStrategy] = useState('')
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipCount, setFlipCount] = useState(0)
  const [usedIndexes, setUsedIndexes] = useState<number[]>([]);

  async function fetchStrategy() {
    const res = await fetch('/api/random', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usedIndexes }), // Send used indexes to avoid duplicates
    });
    const data = await res.json();
    console.log(data)
    if (data.strategy) {
      setStrategy(data.strategy);
      setUsedIndexes([...usedIndexes, data.index]); // Add new index to used indexes
    } else if (data.error) {
      setStrategy(data.error); // Handle the case where all strategies have been used
    }
  }

  useEffect(() => {
    fetchStrategy()
  }, [])

  const getRandomStrategy = useCallback(() => {
    if (isFlipping) return
    setIsFlipping(true)
    setFlipCount(prev => prev + 1)
    setTimeout(async () => {
      await fetchStrategy()
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
        animate={{ rotateY: flipCount % 2 * 180 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="preserve-3d cursor-pointer w-full h-full relative"
        onClick={getRandomStrategy}
      >
        <Card className="w-full h-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 absolute inset-0 backface-hidden">
          <CardContent className='py-0'>
            <AnimatePresence mode="wait">
              <motion.p
                key={strategy}
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
      </motion.div>
    </div>
  )
}