"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen, CuboidIcon as Cube, Layers } from "lucide-react"

export default function Projects() {
  const [isVisible, setIsVisible] = useState(false)
  const [elementsVisible, setElementsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    // Trigger elements animation after main content appears
    setTimeout(() => {
      setElementsVisible(true)
    }, 300)
  }, [])

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div
        className="max-w-6xl mx-auto"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-primary mb-8 transition-colors animate-fade-in"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Вернуться назад
        </Link>

        <div className="flex items-center mb-10 animate-fade-in delay-100">
          <div className="icon-container mr-3">
            <Layers className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Проекты</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="https://samga.top/" className={elementsVisible ? "animate-fade-in delay-200" : "opacity-0"}>
            <div className="card-gradient border border-gray-800 rounded-lg p-6 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 mr-4 overflow-hidden rounded-lg">
                  <Image src="/samga-logo.png" alt="SAMGA Logo" width={48} height={48} className="w-full h-full" />
                </div>
                <h2 className="text-xl font-semibold">samga.top</h2>
              </div>

              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/50 text-sm text-primary mb-4">
                <BookOpen className="w-4 h-4 mr-2" />
                Образовательная платформа
              </div>

              <p className="text-gray-400 mb-6">
                Веб-приложение SAMGA, разработанное для системы Назарбаев Интеллектуальных школ (NIS), которое
                предоставляет доступ к образовательной платформе. Проект построен на современном стеке технологий,
                включая TypeScript, Next.js и Tailwind CSS. Система позволяет учащимся и преподавателям получать доступ
                к оценкам, расписанию и табелю успеваемости через удобный интерфейс.
              </p>

              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/50 text-sm text-primary">
                <Layers className="w-4 h-4 mr-2" />
                Разработчик
              </div>
            </div>
          </a>

          <a
            href="https://plexy-3d.vercel.app/"
            className={elementsVisible ? "animate-fade-in delay-300" : "opacity-0"}
          >
            <div className="card-gradient border border-gray-800 rounded-lg p-6 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="icon-container mr-4">
                  <Cube className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">plexy-3d</h2>
              </div>

              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/50 text-sm text-primary mb-4">
                <Cube className="w-4 h-4 mr-2" />
                3D генератор
              </div>

              <p className="text-gray-400 mb-6">
                Генератор 3D моделей по тексту или фото. Сервис позволяет создавать трехмерные модели на основе
                текстового описания или загруженного изображения, используя современные технологии искусственного
                интеллекта и 3D рендеринга.
              </p>

              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/50 text-sm text-primary">
                <Layers className="w-4 h-4 mr-2" />
                Разработчик
              </div>
            </div>
          </a>
        </div>
      </div>
    </main>
  )
}
