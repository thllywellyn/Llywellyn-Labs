'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Message {
  id: string
  content: string
  createdAt: string
  user: {
    name: string
  }
  project: {
    id: string
    title: string
  }
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages')
        const data = await res.json()
        setMessages(data)
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-loader">
        <div className="loader"></div>
      </div>
    )
  }

  return (
    <div className="dashboard-content">
      <div className="content-header">
        <h1>Messages</h1>
        <button className="create-button">
          <i className='bx bx-message-square-detail'></i>
          New Message
        </button>
      </div>

      <div className="messages-list">
        {messages.map((message) => (
          <div key={message.id} className="message-item">
            <div className="message-header">
              <div className="message-user">
                <i className='bx bxs-user-circle'></i>
                <span>{message.user.name}</span>
              </div>
              <div className="message-project">
                <Link href={`/dashboard/projects/${message.project.id}`}>
                  {message.project.title}
                </Link>
              </div>
            </div>
            
            <p className="message-content">{message.content}</p>
            
            <div className="message-footer">
              <span className="date">
                {new Date(message.createdAt).toLocaleString()}
              </span>
              <div className="message-actions">
                <button className="action-button" title="Reply">
                  <i className='bx bx-reply'></i>
                </button>
                <button className="action-button" title="Archive">
                  <i className='bx bx-archive'></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
