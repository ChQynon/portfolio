"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Code, User, Layers } from "lucide-react"
import NowPlaying from "@/components/now-playing"

export default function Home() {
  const [age, setAge] = useState<string>("16")
  const [opacity, setOpacity] = useState(0)
  const [elementsVisible, setElementsVisible] = useState(false)

  useEffect(() => {
    // Calculate age based on birthday (April 23)
    const calculateAge = () => {
      const birthDate = new Date(2009, 3, 23) // April 23, 2009 (months are 0-indexed)
      const today = new Date()

      let years = today.getFullYear() - birthDate.getFullYear()
      let months = today.getMonth() - birthDate.getMonth()
      let days = today.getDate() - birthDate.getDate()
      const hours = today.getHours()
      const minutes = today.getMinutes()
      const seconds = today.getSeconds()

      if (months < 0 || (months === 0 && days < 0)) {
        years--
        months += 12
      }

      if (days < 0) {
        const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate()
        days += prevMonthLastDay
        months--
      }

      // Calculate the precise age with decimals
      const totalDaysInYear = 365.25 // accounting for leap years
      const yearFraction =
        months / 12 +
        days / totalDaysInYear +
        hours / (24 * totalDaysInYear) +
        minutes / (24 * 60 * totalDaysInYear) +
        seconds / (24 * 60 * 60 * totalDaysInYear)

      const preciseAge = years + yearFraction
      return preciseAge.toFixed(8)
    }

    // Update age every second
    const interval = setInterval(() => {
      setAge(calculateAge())
    }, 100)

    // Fade in animation
    setOpacity(1)

    // Trigger elements animation after main content appears
    setTimeout(() => {
      setElementsVisible(true)
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center py-12 px-4"
      style={{ opacity: opacity, transition: "opacity 1s ease-in-out" }}
    >
      <div className="max-w-3xl w-full flex flex-col items-center">
        <div className="avatar-border mb-6 animate-fade-in">
          <div className="avatar-inner w-32 h-32">
            <Image src="/avatar.png" alt="Avatar" width={128} height={128} className="w-full h-full object-cover" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 animate-fade-in delay-100">
          Привет! Меня зовут <span className="text-primary">qynon</span>
        </h1>

        <p className="text-lg text-gray-400 mb-6 animate-fade-in delay-200">Мне {age} лет</p>

        <p className="text-center text-gray-400 mb-12 max-w-2xl animate-fade-in delay-300">
          Я fullstack-разработчик, проживающий в Китае. Владею русским, английским и активно изучаю китайский язык.
          Более двух лет создаю цифровые продукты. Моя специализация — это веб-разработка, UI/UX-дизайн, разработка
          Telegram-ботов и интеграция с ПК/облачными сервисами.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
          <Link href="/projects" className={`group ${elementsVisible ? "animate-fade-in delay-400" : "opacity-0"}`}>
            <div className="card-gradient border border-gray-800 rounded-lg p-6 h-full transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="icon-container mr-3">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Проекты</h2>
              </div>
              <p className="text-gray-400">Мои текущие проекты, над которыми я работаю.</p>
            </div>
          </Link>

          <Link href="/contacts" className={`group ${elementsVisible ? "animate-fade-in delay-500" : "opacity-0"}`}>
            <div className="card-gradient border border-gray-800 rounded-lg p-6 h-full transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="icon-container mr-3">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Контакты</h2>
              </div>
              <p className="text-gray-400">Все актуальные контакты для связи со мной.</p>
            </div>
          </Link>

          <Link href="/skills" className={`group ${elementsVisible ? "animate-fade-in delay-600" : "opacity-0"}`}>
            <div className="card-gradient border border-gray-800 rounded-lg p-6 h-full transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="icon-container mr-3">
                  <Code className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Навыки</h2>
              </div>
              <p className="text-gray-400">Технологии и инструменты, которыми я владею.</p>
            </div>
          </Link>
        </div>

        <div className={`w-full ${elementsVisible ? "animate-fade-in delay-600" : "opacity-0"}`}>
          <NowPlaying />
        </div>
      </div>
    </main>
  )
}
