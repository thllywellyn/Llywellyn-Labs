'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Modal from '@/components/Modal'
import '@/styles/files.css'

interface UploadingFile {
  file: File
  progress: number
  error?: string
  customName?: string
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

interface Project {
  id: string
  title: string
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [currentProject, setCurrentProject] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [validationError, setValidationError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filesRes, projectsRes] = await Promise.all([
          fetch('/api/files'),
          fetch('/api/projects')
        ])
        
        const [filesData, projectsData] = await Promise.all([
          filesRes.json(),
          projectsRes.json()
        ])
        
        setFiles(filesData)
        setProjects(projectsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Reset form when modal is opened
  useEffect(() => {
    if (showUploadModal) {
      setUploadingFiles([])
      setCurrentProject('')
      setValidationError('')
    }
  }, [showUploadModal])

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        file,
        progress: 0,
        customName: file.name
      }))
      setUploadingFiles(prev => [...prev, ...newFiles])
      setValidationError('') // Clear any previous validation errors
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        progress: 0,
        customName: file.name
      }))
      setUploadingFiles(prev => [...prev, ...newFiles])
      setValidationError('') // Clear any previous validation errors
    }
  }

  const setCustomFileName = (index: number, name: string) => {
    setUploadingFiles(prev => 
      prev.map((file, i) => 
        i === index ? { ...file, customName: name } : file
      )
    )
  }

  const handleUpload = async () => {
    setValidationError('')

    if (uploadingFiles.length === 0) {
      setValidationError('Please select at least one file')
      return
    }
    
    if (!currentProject) {
      setValidationError('Please select a project')
      return
    }

    setIsUploading(true)
    const updatedFiles: UploadingFile[] = [...uploadingFiles]

    try {
      for (let i = 0; i < updatedFiles.length; i++) {
        const fileData = updatedFiles[i]
        const formData = new FormData()
        formData.append('file', fileData.file)
        formData.append('projectId', currentProject)
        if (fileData.customName) {
          formData.append('customName', fileData.customName)
        }

        try {
          updatedFiles[i] = { ...fileData, progress: 10 }
          setUploadingFiles([...updatedFiles])

          const response = await fetch('/api/files', {
            method: 'POST',
            body: formData,
          })

          const result = await response.json()

          if (!response.ok) {
            throw new Error(result.message || result.error || 'Upload failed')
          }

          updatedFiles[i] = { ...fileData, progress: 100 }
          setUploadingFiles([...updatedFiles])

          setFiles((prevFiles) => [...prevFiles, result])
        } catch (error) {
          updatedFiles[i] = {
            ...fileData,
            error: error instanceof Error ? error.message : 'Upload failed',
            progress: 0,
          }
          setUploadingFiles([...updatedFiles])
        }
      }

      if (!updatedFiles.some((file) => file.error)) {
        setTimeout(() => {
          setShowUploadModal(false)
          setUploadingFiles([])
          setCurrentProject('')
          setValidationError('')
        }, 1000)
      }
    } finally {
      setIsUploading(false)
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
            type="button"
            onClick={() => setShowUploadModal(true)}
          >
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
              {file.project && (
                <Link
                  href={`/dashboard/projects/${file.project.id}`}
                  className="project-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {file.project.title}
                </Link>
              )}
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
                  }}
                >
                  <i className="bx bx-share-alt"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)}>
        <div className="modal-header">
          <h2>Upload Files</h2>
          <button
            className="close-button"
            onClick={() => setShowUploadModal(false)}
            aria-label="Close modal"
          >
            <i className="bx bx-x"></i>
          </button>
        </div>

        <div className="modal-body">
          {validationError && (
            <div className="validation-error">
              <i className="bx bx-error-circle"></i>
              {validationError}
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileSelect}
            accept="*/*"
          />
          
          {uploadingFiles.length === 0 ? (
            <div 
              className={`upload-placeholder ${dragActive ? 'drag-active' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <button className="select-files-button">
                <i className="bx bx-cloud-upload"></i>
                Select Files
              </button>
              <p>or drag and drop files here</p>
            </div>
          ) : (
            <div
              className={`upload-area ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="upload-list">
                {uploadingFiles.map((file, index) => (
                  <div key={index} className="upload-item">
                    <div className="upload-item-info">
                      <input
                        type="text"
                        value={file.customName}
                        onChange={(e) => setCustomFileName(index, e.target.value)}
                        className="filename-input"
                        placeholder="Enter file name..."
                      />
                      <span className="filesize">
                        {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                      <button 
                        className="remove-file"
                        onClick={() => {
                          setUploadingFiles(prev => prev.filter((_, i) => i !== index))
                          if (uploadingFiles.length === 1) {
                            setValidationError('')
                          }
                        }}
                        aria-label="Remove file"
                      >
                        <i className="bx bx-x"></i>
                      </button>
                    </div>
                    {file.error && (
                      <div className="upload-error">
                        <i className="bx bx-error-circle"></i>
                        {file.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="upload-actions">
                <button
                  className="add-more-files"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="bx bx-plus"></i>
                  Add More Files
                </button>
                <div className="drag-drop-hint">
                  <i className="bx bx-cloud-upload"></i>
                  <p>or drag and drop files here</p>
                </div>
              </div>
            </div>
          )}

          <div className="project-select">
            <label htmlFor="project">
              Project <span className="required">*</span>
            </label>
            <select
              id="project"
              value={currentProject}
              onChange={(e) => {
                setCurrentProject(e.target.value)
                if (e.target.value) setValidationError('')
              }}
              className={!currentProject && validationError ? 'required' : ''}
            >
              <option value="">Select a Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
            {!currentProject && (
              <p className="helper-text">Please select a project to upload files to</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="secondary-button"
            onClick={() => setShowUploadModal(false)}
          >
            <i className="bx bx-x"></i>
            Cancel
          </button>
          <button
            className="primary-button"
            onClick={handleUpload}
            disabled={uploadingFiles.length === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <i className="bx bx-loader-alt bx-spin"></i>
                Uploading...
              </>
            ) : (
              <>
                <i className="bx bx-cloud-upload"></i>
                Upload
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  )
}
