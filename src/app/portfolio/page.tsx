'use client'

import { useState } from 'react'
import Link from 'next/link'
import PublicLayout from '@/components/layouts/PublicLayout'
import '@/styles/portfolio-showcase.css'

interface PortfolioItem {
  id: string
  title: string
  category: string
  description: string
  thumbnail: string
  videoUrl?: string
  tags: string[]
  year: number
}

const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Social Media Campaign - Brand Awareness',
    category: 'Social Media',
    description: 'Comprehensive social media strategy and content creation for a tech startup',
    thumbnail: '/assets/placeholder-social-1.jpg',
    tags: ['Instagram', 'TikTok', 'Engagement'],
    year: 2024,
  },
  {
    id: '2',
    title: 'Website Redesign - E-commerce Platform',
    category: 'Web Development',
    description: 'Complete redesign and development of a modern e-commerce website',
    thumbnail: '/assets/placeholder-web-1.jpg',
    tags: ['React', 'Tailwind', 'Performance'],
    year: 2024,
  },
  {
    id: '3',
    title: 'Email Marketing Campaign Series',
    category: 'Email Solutions',
    description: 'Strategic email campaigns with 45% open rate and 12% click-through rate',
    thumbnail: '/assets/placeholder-email-1.jpg',
    tags: ['Automation', 'Copy', 'Design'],
    year: 2023,
  },
  {
    id: '4',
    title: 'Domain Strategy & Branding',
    category: 'Consulting',
    description: 'Domain acquisition and branding strategy for tech ventures',
    thumbnail: '/assets/placeholder-consult-1.jpg',
    tags: ['Strategy', 'Branding', 'SEO'],
    year: 2024,
  },
  {
    id: '5',
    title: 'Video Content Editing - Product Launch',
    category: 'Content Creation',
    description: 'High-impact video editing for product launch generating 50K+ views',
    thumbnail: '/assets/placeholder-video-1.jpg',
    tags: ['Video', 'Editing', 'Motion Graphics'],
    year: 2024,
  },
  {
    id: '6',
    title: 'Brand Identity Design System',
    category: 'Design',
    description: 'Complete visual identity system including guidelines and assets',
    thumbnail: '/assets/placeholder-design-1.jpg',
    tags: ['Design', 'Branding', 'Guidelines'],
    year: 2023,
  },
]

const categories = ['All', 'Social Media', 'Web Development', 'Email Solutions', 'Consulting', 'Content Creation', 'Design']

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)

  const filteredItems = selectedCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === selectedCategory)

  return (
    <PublicLayout>
      <div className="portfolio-showcase">
        {/* Header */}
        <section className="portfolio-header">
          <div className="portfolio-header-content">
            <h1>My Portfolio</h1>
            <p>Showcasing my creative work in social media, web development, content creation, and digital strategy</p>
          </div>
        </section>

        {/* Filter */}
        <section className="portfolio-filter-section">
          <div className="filter-container">
            <h3>Filter by Category</h3>
            <div className="filter-buttons">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="portfolio-grid-section">
          <div className="portfolio-grid">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="portfolio-item"
                onClick={() => setSelectedItem(item)}
              >
                <div className="portfolio-thumbnail">
                  <div className="thumbnail-placeholder">
                    <i className='bx bx-image'></i>
                    <p>{item.category}</p>
                  </div>
                  <div className="portfolio-overlay">
                    <div className="overlay-content">
                      <h3>{item.title}</h3>
                      <p className="category-badge">{item.category}</p>
                      <button className="view-btn">
                        View Details
                        <i className='bx bx-right-arrow-alt'></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="portfolio-meta">
                  <h4>{item.title}</h4>
                  <p className="category">{item.category}</p>
                  <div className="tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="portfolio-stats">
          <div className="stats-container">
            <div className="stat-item">
              <h2>50+</h2>
              <p>Projects Completed</p>
            </div>
            <div className="stat-item">
              <h2>100+</h2>
              <p>Happy Clients</p>
            </div>
            <div className="stat-item">
              <h2>5+</h2>
              <p>Years Experience</p>
            </div>
            <div className="stat-item">
              <h2>98%</h2>
              <p>Client Satisfaction</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="portfolio-cta">
          <div className="cta-content">
            <h2>Ready to work together?</h2>
            <p>Let's discuss how I can help bring your vision to life</p>
            <Link href="/#contact" className="cta-button">
              Start Your Project
              <i className='bx bx-right-arrow-alt'></i>
            </Link>
          </div>
        </section>

        {/* Detailed View Modal */}
        {selectedItem && (
          <div className="portfolio-modal" onClick={() => setSelectedItem(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-btn"
                onClick={() => setSelectedItem(null)}
              >
                ×
              </button>
              
              <div className="modal-header">
                <div className="modal-header-placeholder">
                  <i className='bx bx-image'></i>
                  <p>{selectedItem.category}</p>
                </div>
              </div>

              <div className="modal-body">
                <span className="modal-category">{selectedItem.category}</span>
                <h2>{selectedItem.title}</h2>
                <p className="modal-description">{selectedItem.description}</p>

                <div className="modal-section">
                  <h4>Project Details</h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="label">Category</span>
                      <span className="value">{selectedItem.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Year</span>
                      <span className="value">{selectedItem.year}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-section">
                  <h4>Skills Used</h4>
                  <div className="skills-list">
                    {selectedItem.tags.map((tag) => (
                      <span key={tag} className="skill-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="modal-actions">
                  <Link href="/#contact" className="btn btn-primary">
                    Get a Quote
                  </Link>
                  <button className="btn btn-secondary" onClick={() => setSelectedItem(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
