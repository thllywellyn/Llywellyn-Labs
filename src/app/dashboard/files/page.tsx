'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import '@/styles/files.css'

interface UploadingFile {
  file: File
  progress: number
  error?: string
}

interface FileRecord {
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
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [currentProject, setCurrentProject] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        progress: 0,
      }))
      setUploadingFiles(newFiles)
    }
  }

  const handleUpload = async () => {
    if (!currentProject || uploadingFiles.length === 0) return

    const updatedFiles: UploadingFile[] = [...uploadingFiles]

    for (let i = 0; i < updatedFiles.length; i++) {
      const fileData = updatedFiles[i]
      const formData = new FormData()
      formData.append('file', fileData.file)
      formData.append('projectId', currentProject)

      try {
        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Upload failed')
        }

        // Update progress to 100% for successful upload
        updatedFiles[i] = { ...fileData, progress: 100 }
        setUploadingFiles([...updatedFiles])

        // Add new file to the list
        setFiles((prevFiles) => [...prevFiles, ...result])
      } catch (error) {
        updatedFiles[i] = {
          ...fileData,
          error: error instanceof Error ? error.message : 'Upload failed',
        }
        setUploadingFiles([...updatedFiles])
      }
    }
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
          <button
            className="create-button"
            onClick={() => setShowUploadModal(true)}
          >
            <i className="bx bx-upload"></i>
            Upload Files
          </button>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
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

      {showUploadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Upload Files</h2>
              <button
                className="close-button"
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadingFiles([])
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {uploadingFiles.length === 0 ? (
                <div className="upload-placeholder">
                  <button
                    className="upload-button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <i className="bx bx-cloud-upload"></i>
                    Select Files
                  </button>
                  <p>or drag and drop files here</p>
                </div>
              ) : (
                <div className="upload-list">
                  {uploadingFiles.map((file, index) => (
                    <div key={index} className="upload-item">
                      <div className="upload-item-info">
                        <span className="filename">{file.file.name}</span>
                        <span className="filesize">
                          {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="upload-progress">
                        <div
                          className="progress-bar"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      {file.error && (
                        <div className="upload-error">{file.error}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="project-select">
                <label htmlFor="project">Project:</label>
                <select
                  id="project"
                  value={currentProject}
                  onChange={(e) => setCurrentProject(e.target.value)}
                  required
                >
                  <option value="">Select a project</option>
                  {files
                    .reduce((projects, file) => {
                      if (!projects.find((p) => p.id === file.project.id)) {
                        projects.push(file.project)
                      }
                      return projects
                    }, [] as { id: string; title: string }[])
                    .map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadingFiles([])
                }}
              >
                Cancel
              </button>
              <button
                className="primary-button"
                onClick={handleUpload}
                disabled={uploadingFiles.length === 0 || !currentProject}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
