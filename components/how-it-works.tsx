import { ArrowRight } from "lucide-react"
import React from 'react'

interface Step {
  number: number;
  title: string;
  description: string;
}

interface HowItWorksProps {
  title: string;
  steps: Step[];
}

export default function HowItWorks({ title, steps }: HowItWorksProps) {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A simple process to transform your photos into aesthetic memories
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col md:flex-row items-start mb-8 relative">
            {index < steps.length - 1 && (
              <div className="absolute left-6 top-16 bottom-0 w-px bg-border hidden md:block" />
            )}

            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-4 md:mb-0 flex-shrink-0 z-10">
              {step.number}
            </div>

            <div className="md:ml-8">
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>

            {index < steps.length - 1 && (
              <div className="hidden md:flex items-center justify-center ml-4">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
