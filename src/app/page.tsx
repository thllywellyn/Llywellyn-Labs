'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PublicLayout from '@/components/layouts/PublicLayout'
import ContactForm from '@/components/ContactForm'
import { SpeedInsights } from "@vercel/speed-insights/next"
export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <PublicLayout>
      <div>
        {loading && (
          <div className="preloader">
            <div className="loader"></div>
          </div>
        )}

        {/* Home Section */}
        <section className="home" id="home">
          <div className="home-content">            <h3>Hi,</h3>
            <h1>I'm Llywellyn Sana,</h1>
            <h3>I'm a <span className="highlight">Freelancer</span></h3>
            <p>
              I specialize in social media management, website development, domain consultation, and tailored email solutions. 
              Discover my portfolio and connect with me through my social channels to learn how I can help enhance your brand's digital presence.
            </p>
            <div className="social-icons">
              <a href="https://www.instagram.com/thllywellyn" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="bx bxl-instagram-alt"></i>
              </a>
              <a href="https://www.linkedin.com/in/thllywellyn" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="bx bxl-linkedin-square"></i>
              </a>
              <a href="https://x.com/thllywellyn/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="bx bxl-twitter"></i>
              </a>
              <a href="https://github.com/thllywellyn" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="bx bxl-github"></i>
              </a>
            </div>
            <div>
              <a href="mailto:contact@lsanalab.xyz">
                <button className="btn">Know More</button>
              </a>
            </div>
          </div>

          <div className="home-img">
            <Image
              src="/assets/profile-pic.jpg"
              alt="Llywellyn Sana"
              width={400}
              height={400}
              priority
              className="rounded-full"
            />
          </div>
        </section>

        {/* Services Section */}
        <section className="services" id="services">
          <h2 className="section-title">My <span>Services</span></h2>
          <div className="services-container">
            <div className="service-box">
              <i className="bx bx-code-alt"></i>
              <h3>Web Development</h3>
              <p>Custom website design and development tailored to your brand's unique needs and objectives.</p>
            </div>
            
            <div className="service-box">
              <i className="bx bxl-instagram-alt"></i>
              <h3>Social Media Management</h3>
              <p>Strategic content creation, scheduling, and engagement to grow your brand's online presence.</p>
            </div>
            
            <div className="service-box">
              <i className="bx bx-globe"></i>
              <h3>Domain Consultation</h3>
              <p>Professional domain registration, transfers, and ongoing management to secure your online identity.</p>
            </div>
            
            <div className="service-box">
              <i className="bx bx-envelope"></i>
              <h3>Email Consultation</h3>
              <p>Custom email setup with your domain for a professional business image and reliable communication.</p>
            </div>
          </div>
        </section>

        {/* Portfolio Showcase Section */}
        <section className="portfolio-showcase-preview" id="portfolio">
          <h2 className="section-title">Featured <span>Work</span></h2>
          <p className="section-subtitle">Explore a selection of my recent projects and campaigns</p>
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Link href="/portfolio" className="btn" style={{ display: 'inline-block' }}>
              View Full Portfolio
              <i className='bx bx-right-arrow-alt'></i>
            </Link>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing" id="pricing">
          <h2 className="section-title">My <span>Pricing</span></h2>
          <div className="pricing-container">
            <div className="pricing-box">
              <h3>Web Development</h3>
              <p className="starting-price">Starting from ₹2,999</p>
              <ul className="pricing-list">
                <li>One-Page Website – ₹2,999</li>
                <li>Basic Site – ₹4,999</li>
                <li>Business Site – ₹9,999</li>
                <li>Custom Web App – ₹15,000+</li>
              </ul>
              <a href="#contact">
                <button className="btn">Get Started</button>
              </a>
            </div>

            <div className="pricing-box">
              <h3>Social Media Management</h3>
              <p className="starting-price">Starting from ₹2,499/month</p>
              <ul className="pricing-list">
                <li>Starter – ₹2,499/month</li>
                <li>Growth – ₹4,999/month</li>
                <li>Full Strategy + Ads – ₹8,999/month</li>
              </ul>
              <a href="#contact">
                <button className="btn">Get Started</button>
              </a>
            </div>

            <div className="pricing-box">
              <h3>Domain Consultation</h3>
              <p className="starting-price">Starting from ₹499</p>
              <ul className="pricing-list">
                <li>Name Advice – ₹499</li>
                <li>Setup Guidance – ₹699</li>
                <li>Full Strategy – ₹1,499</li>
              </ul>
              <a href="#contact">
                <button className="btn">Get Started</button>
              </a>
            </div>

            <div className="pricing-box">
              <h3>Email Consultation</h3>
              <p className="starting-price">Starting from ₹999</p>
              <ul className="pricing-list">
                <li>Custom Setup – ₹999</li>
                <li>Integration – ₹1,999</li>
                <li>Support – ₹499/year</li>
              </ul>
              <a href="#contact">
                <button className="btn">Get Started</button>
              </a>
            </div>
          </div>
        </section>        
        {/* Portfolio Section - Hidden for now */}
        {/* <section className="portfolio" id="portfolio">
          <h2 className="section-title">My <span>Portfolio</span></h2>
          <div className="portfolio-container">
            <div className="portfolio-box">
              <Image
                src="/assets/1.jpg"
                alt="Web Design Project"
                width={400}
                height={300}
                className="portfolio-img"
              />
              <div className="portfolio-layer">
                <h4>Web Design</h4>
                <p>Modern responsive website for a local business</p>
                <a href="#" aria-label="View Project">
                  <i className="bx bx-link-external"></i>
                </a>
              </div>
            </div>

            <div className="portfolio-box">
              <Image
                src="/assets/2.jpg"
                alt="Social Media Campaign Project"
                width={400}
                height={300}
                className="portfolio-img"
              />
              <div className="portfolio-layer">
                <h4>Social Media Campaign</h4>
                <p>Engagement strategy that increased followers by 200%</p>
                <a href="#" aria-label="View Project">
                  <i className="bx bx-link-external"></i>
                </a>
              </div>
            </div>

            <div className="portfolio-box">
              <Image
                src="/assets/3.jpg"
                alt="Email Marketing Project"
                width={400}
                height={300}
                className="portfolio-img"
              />
              <div className="portfolio-layer">
                <h4>Email Marketing</h4>
                <p>Campaign that achieved 45% open rate for an e-commerce client</p>
                <a href="#" aria-label="View Project">
                  <i className="bx bx-link-external"></i>
                </a>
              </div>
            </div>
          </div>
        </section> */}

        {/* Contact Section */}
        <section className="contact" id="contact">
          <h2 className="section-title">Contact <span>Me</span></h2>
          <div className="contact-container">
            <div className="contact-info">
              <div className="contact-card">
                <i className="bx bx-envelope"></i>
                <h3>Email</h3>
                <p>contact@lsanalab.xyz</p>
              </div>
              
              <div className="contact-card">
                <i className="bx bx-phone"></i>
                <h3>Phone</h3>
                <p>+91-9774226815</p>
              </div>
              
              <div className="contact-card">
                <i className="bx bx-map"></i>
                <h3>Location</h3>
                <p>Imphal, India</p>
              </div>
            </div>

            <ContactForm />
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
