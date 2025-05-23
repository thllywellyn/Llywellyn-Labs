'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface File {
  id: string
  name: string
  url: string
  createdAt: string
  project: {
    id: string
    title: string
  }
}

export default function FilesPage() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch('/api/files')
        const data = await res.json()
        setFiles(data)
      } catch (error) {
        console.error('Error fetching files:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [])

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    )
  }

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
        <h1>Files</h1>
        <div className="header-actions">
          {selectedFiles.length > 0 && (
            <button className="action-button">
              <i className="bx bx-download"></i>
              Download Selected
            </button>
          )}
          <button className="create-button">
            <i className="bx bx-upload"></i>
            Upload Files
          </button>
        </div>
      </div>

      <div className="files-grid">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-card ${
              selectedFiles.includes(file.id) ? 'selected' : ''
            }`}
            onClick={() => toggleFileSelection(file.id)}
          >
            <div className="file-icon">
              <i className="bx bxs-file"></i>
              <input
                type="checkbox"
                checked={selectedFiles.includes(file.id)}
                onChange={() => toggleFileSelection(file.id)}
              />
            </div>

            <div className="file-info">
              <h3>{file.name}</h3>
              <Link
                href={`/dashboard/projects/${file.project.id}`}
                className="project-link"
                onClick={(e) => e.stopPropagation()}
              >
                {file.project.title}
              </Link>
            </div>

            <div className="file-meta">
              <span className="date">
                {new Date(file.createdAt).toLocaleDateString()}
              </span>
              <div className="file-actions">
                <a
                  href={file.url}
                  className="action-button"
                  onClick={(e) => e.stopPropagation()}
                  download
                >
                  <i className="bx bx-download"></i>
                </a>
                <button
                  className="action-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Add share functionality
                  }}
                >
                  <i className="bx bx-share-alt"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
