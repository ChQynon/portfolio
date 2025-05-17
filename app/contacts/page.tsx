"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function Contacts() {
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
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Контакты</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="https://t.me/qynon" className={elementsVisible ? "animate-fade-in delay-200" : "opacity-0"}>
            <div className="card-gradient border border-gray-800 rounded-lg p-6 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#0088cc] rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 0C5.376 0 0 5.376 0 12C0 18.624 5.376 24 12 24C18.624 24 24 18.624 24 12C24 5.376 18.624 0 12 0ZM17.568 8.16C17.388 10.056 16.608 14.664 16.212 16.788C16.044 17.688 15.708 17.988 15.396 18.024C14.7 18.084 14.172 17.568 13.5 17.124C12.444 16.428 11.844 15.996 10.824 15.324C9.636 14.544 10.404 14.112 11.088 13.416C11.268 13.236 14.34 10.44 14.4 10.188C14.412 10.152 14.412 10.044 14.34 9.972C14.268 9.912 14.172 9.936 14.088 9.948C13.98 9.972 12.24 11.088 8.868 13.296C8.4 13.608 7.968 13.764 7.584 13.752C7.152 13.74 6.348 13.5 5.736 13.296C4.992 13.044 4.416 12.912 4.464 12.492C4.488 12.276 4.776 12.06 5.328 11.832C8.964 10.224 11.46 9.12 12.816 8.52C16.692 6.792 17.472 6.552 17.964 6.54C18.072 6.54 18.324 6.576 18.492 6.72C18.624 6.828 18.66 6.984 18.672 7.104C18.66 7.2 18.684 7.488 17.568 8.16Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">Telegram</h2>
              </div>

              <p className="text-gray-400 mb-2">@qynon</p>
              <p className="text-gray-500 text-sm">Предпочтительный способ связи</p>
            </div>
          </a>

          <div
            className={`card-gradient border border-gray-800 rounded-lg p-6 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 ${
              elementsVisible ? "animate-fade-in delay-300" : "opacity-0"
            }`}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#5865F2] rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M19.952 5.672C19.952 5.672 17.592 3.88 14.824 3.88L14.688 4.016C17.024 4.696 18.128 5.648 19.072 6.872C17.184 5.92 15.312 5.12 12 5.12C8.688 5.12 6.816 5.92 4.928 6.872C5.872 5.648 7.104 4.624 9.312 4.016L9.176 3.88C6.48 3.88 4.048 5.672 4.048 5.672C4.048 5.672 1.248 9.968 0.8 18.328C3.568 21.448 7.84 21.448 7.84 21.448L8.688 20.328C7.152 19.88 5.44 18.984 4.048 17.096C5.776 18.328 8.336 19.6 12 19.6C15.664 19.6 18.224 18.328 19.952 17.096C18.56 18.984 16.848 19.88 15.312 20.328L16.16 21.448C16.16 21.448 20.432 21.448 23.2 18.328C22.752 9.968 19.952 5.672 19.952 5.672ZM8.688 15.4C7.664 15.4 6.816 14.408 6.816 13.192C6.816 11.976 7.664 10.984 8.688 10.984C9.712 10.984 10.56 11.976 10.56 13.192C10.56 14.408 9.712 15.4 8.688 15.4ZM15.312 15.4C14.288 15.4 13.44 14.408 13.44 13.192C13.44 11.976 14.288 10.984 15.312 10.984C16.336 10.984 17.184 11.976 17.184 13.192C17.184 14.408 16.336 15.4 15.312 15.4Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Discord</h2>
            </div>

            <p className="text-gray-400 mb-2">ch.qynon</p>
            <p className="text-gray-500 text-sm">Альтернативный способ связи</p>
          </div>
        </div>
      </div>
    </main>
  )
}
