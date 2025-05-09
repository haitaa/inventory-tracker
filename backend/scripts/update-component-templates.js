import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Hero bileşeni için HTML şablonu
const heroTemplate = `<div class="hero-section">
  <div class="hero-content">
    <h1>{{{title}}}</h1>
    <p>{{{description}}}</p>
    <button class="cta-button">{{{buttonText}}}</button>
  </div>
</div>`;

// Hero bileşeni için CSS stili
const heroStyle = `.hero-section {
  background-color: #f8f9fa;
  background-image: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 80px 20px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  overflow: hidden;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(74, 108, 247, 0.1);
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 24px;
  color: #212529;
  line-height: 1.2;
  letter-spacing: -0.02em;
  transition: transform 0.3s ease;
}

.hero-content h1:hover {
  transform: translateY(-2px);
}

.hero-content p {
  font-size: 1.25rem;
  margin-bottom: 36px;
  color: #495057;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  background-color: #4a6cf7;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(74, 108, 247, 0.3);
  position: relative;
  overflow: hidden;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(74, 108, 247, 0.4);
  background-color: #3b5cf6;
}

.cta-button:active {
  transform: translateY(1px);
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-content p {
    font-size: 1rem;
  }
  
  .cta-button {
  padding: 12px 24px;
    font-size: 0.9rem;
  }
}`;

// Slider bileşeni için HTML şablonu
const sliderTemplate = `<div class="slider-container">
  <div class="slider">
    <div class="slider-track">
      <div class="slide active" id="slide1">
        <img src="{{{slide1Image}}}" alt="{{{slide1Alt}}}" />
        <div class="slide-caption">
          <h2>{{{slide1Title}}}</h2>
          <p>{{{slide1Description}}}</p>
          {{#slide1ButtonText}}
          <a href="{{{slide1ButtonUrl}}}" class="slide-button">{{{slide1ButtonText}}}</a>
          {{/slide1ButtonText}}
        </div>
      </div>
      <div class="slide" id="slide2">
        <img src="{{{slide2Image}}}" alt="{{{slide2Alt}}}" />
        <div class="slide-caption">
          <h2>{{{slide2Title}}}</h2>
          <p>{{{slide2Description}}}</p>
          {{#slide2ButtonText}}
          <a href="{{{slide2ButtonUrl}}}" class="slide-button">{{{slide2ButtonText}}}</a>
          {{/slide2ButtonText}}
        </div>
      </div>
      <div class="slide" id="slide3">
        <img src="{{{slide3Image}}}" alt="{{{slide3Alt}}}" />
        <div class="slide-caption">
          <h2>{{{slide3Title}}}</h2>
          <p>{{{slide3Description}}}</p>
          {{#slide3ButtonText}}
          <a href="{{{slide3ButtonUrl}}}" class="slide-button">{{{slide3ButtonText}}}</a>
          {{/slide3ButtonText}}
        </div>
      </div>
    </div>
    <button class="slider-nav slider-prev">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </button>
    <button class="slider-nav slider-next">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </button>
    <div class="slider-dots">
      <button class="slider-dot active" data-slide="1"></button>
      <button class="slider-dot" data-slide="2"></button>
      <button class="slider-dot" data-slide="3"></button>
    </div>
  </div>
</div>`;

// Slider bileşeni için CSS stili
const sliderStyle = `.slider-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.slider {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

.slider-track {
  display: flex;
  width: 300%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.slide {
  position: relative;
  width: 33.333%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
  z-index: 1;
}

.slide.active {
  opacity: 1;
  pointer-events: auto;
  z-index: 2;
}

.slide img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-caption {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 40px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  color: white;
  text-align: center;
  transform: translateY(0);
  transition: transform 0.5s ease;
}

.slide-caption h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.slide-caption p {
  font-size: 1.1rem;
  margin-bottom: 24px;
  line-height: 1.6;
}

.slide-button {
  display: inline-block;
  padding: 12px 28px;
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.slide-button:hover {
  background-color: #3b5cf6;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  color: #333;
  opacity: 0.7;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.slider-nav:hover {
  opacity: 1;
  background: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.slider-prev {
  left: 20px;
}

.slider-next {
  right: 20px;
}

.slider-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
}

.slider-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: rgba(255,255,255,0.5);
  border: 2px solid white;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
}

.slider-dot.active {
  background-color: #4a6cf7;
  transform: scale(1.2);
}

.slider-dot:hover {
  background-color: rgba(255,255,255,0.8);
}

.slider-dot.active:hover {
  background-color: #4a6cf7;
}

@media (max-width: 992px) {
  .slider {
    height: 400px;
  }
  
  .slide-caption h2 {
    font-size: 2rem;
  }
  
  .slide-caption p {
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .slider {
    height: 350px;
  }
  
  .slide-caption {
    padding: 20px;
    max-width: 90%;
  }
  
  .slide-caption h2 {
    font-size: 1.75rem;
    margin-bottom: 8px;
  }
  
  .slide-caption p {
    font-size: 0.9rem;
    margin-bottom: 16px;
  }
  
  .slide-button {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  
  .slider-nav {
    width: 40px;
    height: 40px;
  }
}`;

// Navbar bileşeni için HTML şablonu (basitleştirilmiş)
const navbarTemplate = `<div class="navbar-container">
  <div class="navbar-logo" style="width: {{{logoWidth}}}px;">
    <a href="{{{logoUrl}}}">
      <img src="{{{logoImage}}}" alt="{{{altText}}}" style="max-height: {{{logoHeight}}}px;" />
      <span class="logo-text">{{{logoText}}}</span>
    </a>
  </div>
  <div class="navbar-links">
    <a href="{{{link1Url}}}" class="navbar-link">{{{link1Text}}}</a>
    <a href="{{{link2Url}}}" class="navbar-link">{{{link2Text}}}</a>
    <a href="{{{link3Url}}}" class="navbar-link">{{{link3Text}}}</a>
    <a href="{{{link4Url}}}" class="navbar-link">{{{link4Text}}}</a>
  </div>
  <div class="navbar-search">
    <button aria-label="Ara">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
    </button>
  </div>
</div>`;

// Navbar bileşeni için CSS stili (basitleştirilmiş)
const navbarStyle = `.navbar-container {
  display: flex;
  width: 100%;
  height: 80px;
  background-color: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.navbar-container:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.navbar-logo {
  display: flex;
  align-items: center;
  margin-right: 2rem;
}

.navbar-logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.navbar-logo a:hover {
  transform: translateY(-2px);
}

.navbar-logo img {
  display: block;
  object-fit: contain;
  transition: filter 0.3s ease;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
}

.logo-text:hover {
  color: #4a6cf7;
}

.navbar-links {
  display: flex;
  gap: 2rem;
  transition: opacity 0.3s ease;
}

.navbar-link {
  color: #555;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: all 0.3s ease;
}

.navbar-link:hover {
  color: #4a6cf7;
}

.navbar-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #4a6cf7;
  transition: width 0.3s ease;
}

.navbar-link:hover::after {
  width: 100%;
}

.navbar-search button {
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.navbar-search button:hover {
  background-color: #f8f9fa;
  color: #4a6cf7;
  transform: rotate(5deg);
}

@media (max-width: 768px) {
  .navbar-container {
    flex-wrap: wrap;
    height: auto;
    padding: 1rem;
  }
  
  .navbar-logo {
    margin-bottom: 0.5rem;
  }
  
  .navbar-links {
    order: 3;
    width: 100%;
    justify-content: space-between;
    margin-top: 1rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    -webkit-overflow-scrolling: touch;
  }
  
  .navbar-link {
    white-space: nowrap;
    margin-right: 1rem;
  }
  
  .navbar-link:last-child {
    margin-right: 0;
  }
}`;

// Özellikler bileşeni için HTML şablonu
const featuresTemplate = `<div class="features-section">
  <h2 class="features-title">{{{sectionTitle}}}</h2>
  <div class="features-grid">
    <div class="feature-item">
      <div class="feature-icon">🚀</div>
      <h3>{{{feature1Title}}}</h3>
      <p>{{{feature1Description}}}</p>
    </div>
    <div class="feature-item">
      <div class="feature-icon">⚡</div>
      <h3>{{{feature2Title}}}</h3>
      <p>{{{feature2Description}}}</p>
    </div>
    <div class="feature-item">
      <div class="feature-icon">🔒</div>
      <h3>{{{feature3Title}}}</h3>
      <p>{{{feature3Description}}}</p>
    </div>
  </div>
</div>`;

// Özellikler bileşeni için CSS stili
const featuresStyle = `.features-section {
  padding: 80px 20px;
  background-color: #fff;
  position: relative;
  overflow: hidden;
}

.features-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 60px;
  color: #212529;
  position: relative;
  letter-spacing: -0.02em;
}

.features-title::after {
  content: '';
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #4a6cf7, #5e7ef8);
  border-radius: 5px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 992px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .features-title {
    font-size: 2rem;
    margin-bottom: 40px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    max-width: 480px;
  }
}

.feature-item {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 40px 30px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.03);
}

.feature-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  border-color: rgba(74, 108, 247, 0.1);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 24px;
  display: inline-block;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  width: 90px;
  height: 90px;
  line-height: 90px;
  border-radius: 50%;
  text-align: center;
  margin-bottom: 25px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.feature-item:hover .feature-icon {
  transform: rotate(5deg) scale(1.1);
  background: linear-gradient(135deg, #eaefff 0%, #e6eeff 100%);
}

.feature-item h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #212529;
  transition: color 0.3s ease;
}

.feature-item:hover h3 {
  color: #4a6cf7;
}

.feature-item p {
  color: #6c757d;
  line-height: 1.7;
  font-size: 1rem;
  margin-bottom: 0;
}`;

// Sidebar bileşeni için HTML şablonu
const sidebarTemplate = `<div class="sidebar">
  <div class="sidebar-header">
    <h3>{{{sidebarTitle}}}</h3>
  </div>
  <div class="sidebar-content">
    <div class="sidebar-section">
      <h4>{{{section1Title}}}</h4>
      <ul class="sidebar-menu">
        <li><a href="{{{link1Url}}}">{{{link1Text}}}</a></li>
        <li><a href="{{{link2Url}}}">{{{link2Text}}}</a></li>
        <li><a href="{{{link3Url}}}">{{{link3Text}}}</a></li>
        <li><a href="{{{link4Url}}}">{{{link4Text}}}</a></li>
      </ul>
    </div>
    <div class="sidebar-section">
      <h4>{{{section2Title}}}</h4>
      <p>{{{section2Content}}}</p>
    </div>
    {{{showContact}}} 
    <div class="sidebar-contact">
      <h4>İletişim</h4>
      <p>{{{contactInfo}}}</p>
    </div>
    {{{/showContact}}}
  </div>
</div>`;

// Sidebar bileşeni için CSS stili
const sidebarStyle = `.sidebar {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  padding: 30px;
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.03);
}

.sidebar:hover {
  box-shadow: 0 15px 40px rgba(0,0,0,0.08);
}

.sidebar-header {
  border-bottom: 1px solid #f1f3f5;
  padding-bottom: 18px;
  margin-bottom: 24px;
  position: relative;
}

.sidebar-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #4a6cf7, #5e7ef8);
  border-radius: 5px;
  transition: width 0.3s ease;
}

.sidebar:hover .sidebar-header::after {
  width: 100px;
}

.sidebar-header h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #212529;
  margin: 0;
  letter-spacing: -0.01em;
}

.sidebar-section {
  margin-bottom: 30px;
}

.sidebar-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 15px;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  margin-bottom: 10px;
  transition: transform 0.2s ease;
}

.sidebar-menu li:hover {
  transform: translateX(5px);
}

.sidebar-menu li a {
  color: #4a6cf7;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  display: block;
  padding: 6px 0;
  position: relative;
}

.sidebar-menu li a::before {
  content: '→';
  opacity: 0;
  margin-right: 8px;
  transition: all 0.2s ease;
  display: inline-block;
  transform: translateX(-10px);
}

.sidebar-menu li a:hover {
  color: #2843b6;
}

.sidebar-menu li a:hover::before {
  opacity: 1;
  transform: translateX(0);
}

.sidebar-contact {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-top: 25px;
  border-left: 3px solid #4a6cf7;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sidebar-contact:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.sidebar-contact h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
  margin-top: 0;
  margin-bottom: 12px;
}

.sidebar-contact p {
  font-size: 0.9rem;
  color: #495057;
  margin: 0;
  line-height: 1.6;
}`;

// Footer bileşeni için HTML şablonu
const footerTemplate = `<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-logo-section">
      <img src="{{{logoUrl}}}" alt="{{{companyName}}} Logo" class="footer-logo" />
      <p>{{{companyDescription}}}</p>
    </div>
    
    <div class="footer-links">
      <div class="footer-column">
        <h4>{{{column1Title}}}</h4>
        <ul>
          <li><a href="{{{column1Link1Url}}}">{{{column1Link1Text}}}</a></li>
          <li><a href="{{{column1Link2Url}}}">{{{column1Link2Text}}}</a></li>
          <li><a href="{{{column1Link3Url}}}">{{{column1Link3Text}}}</a></li>
        </ul>
      </div>
      
      <div class="footer-column">
        <h4>{{{column2Title}}}</h4>
        <ul>
          <li><a href="{{{column2Link1Url}}}">{{{column2Link1Text}}}</a></li>
          <li><a href="{{{column2Link2Url}}}">{{{column2Link2Text}}}</a></li>
          <li><a href="{{{column2Link3Url}}}">{{{column2Link3Text}}}</a></li>
        </ul>
      </div>
      
      <div class="footer-column">
        <h4>İletişim</h4>
        <address>
          {{{address}}}<br>
          <a href="mailto:{{{email}}}">{{{email}}}</a><br>
          <a href="tel:{{{phone}}}">{{{phone}}}</a>
        </address>
      </div>
    </div>
  </div>
  
  <div class="footer-bottom">
    <p>{{{copyright}}}</p>
    <div class="social-links">
      <a href="{{{socialLink1}}}" aria-label="Facebook">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="social-icon"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
      </a>
      <a href="{{{socialLink2}}}" aria-label="Twitter">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="social-icon"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
      </a>
      <a href="{{{socialLink3}}}" aria-label="Instagram">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="social-icon"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </a>
    </div>
  </div>
</footer>`;

// Footer bileşeni için CSS stili
const footerStyle = `.site-footer {
  background-color: #1a202c;
  color: #e2e8f0;
  padding: 80px 0 30px;
  position: relative;
  overflow: hidden;
}

.site-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #4a6cf7, #5e7ef8, #7476f9);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20px;
  position: relative;
}

.footer-logo-section {
  flex: 0 0 100%;
  max-width: 350px;
  margin-bottom: 40px;
}

.footer-logo {
  max-height: 50px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.footer-logo:hover {
  transform: translateY(-5px);
}

.footer-logo-section p {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #a0aec0;
  margin-bottom: 25px;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  justify-content: space-around;
}

.footer-column {
  flex: 0 0 25%;
  min-width: 160px;
  margin-bottom: 35px;
  padding-right: 20px;
}

.footer-column h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fff;
  position: relative;
  padding-bottom: 12px;
}

.footer-column h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background-color: #4a6cf7;
  transition: width 0.3s ease;
}

.footer-column:hover h4::after {
  width: 50px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 12px;
  transition: transform 0.2s ease;
}

.footer-column li:hover {
  transform: translateX(5px);
}

.footer-column a {
  color: #a0aec0;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  display: inline-block;
  position: relative;
}

.footer-column a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 1px;
  bottom: -3px;
  left: 0;
  background-color: #4a6cf7;
  transition: width 0.3s ease;
}

.footer-column a:hover {
  color: #fff;
}

.footer-column a:hover::after {
  width: 100%;
}

address {
  font-style: normal;
  line-height: 1.8;
  font-size: 0.95rem;
  color: #a0aec0;
  margin-bottom: 0;
}

.footer-bottom {
  border-top: 1px solid #2d3748;
  margin-top: 25px;
  padding-top: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
}

.footer-bottom p {
  font-size: 0.9rem;
  color: #a0aec0;
  margin: 0;
}

.social-links {
  display: flex;
  gap: 18px;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #2d3748;
  transition: all 0.3s ease;
}

.social-links a:hover {
  transform: translateY(-5px);
  background-color: #4a6cf7;
}

.social-icon {
  color: #fff;
  transition: transform 0.3s ease;
}

.social-links a:hover .social-icon {
  transform: scale(1.1);
}

@media (max-width: 992px) {
  .footer-logo-section {
    flex: 0 0 100%;
    max-width: 100%;
    margin-bottom: 30px;
  }
  
  .footer-column {
    flex: 0 0 33.333%;
  }
}

@media (max-width: 768px) {
  .site-footer {
    padding: 60px 0 20px;
  }
  
  .footer-container {
    flex-direction: column;
  }
  
  .footer-links {
    flex-direction: column;
  }
  
  .footer-column {
    flex: 0 0 100%;
    margin-bottom: 25px;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
}`;

// Ürünler bileşeni için HTML şablonu
const productsTemplate = `<div class="products-section">
  <div class="products-header">
    <h2 class="products-title">{{{sectionTitle}}}</h2>
    <p class="products-description">{{{sectionDescription}}}</p>
  </div>
  
  <div class="products-grid">
    <div class="product-card">
      <div class="product-badge">{{{product1Badge}}}</div>
      <div class="product-image">
        <img src="{{{product1Image}}}" alt="{{{product1Title}}}" />
      </div>
      <div class="product-content">
        <h3 class="product-title">{{{product1Title}}}</h3>
        <div class="product-rating">
          {{#showRating1}}
          <div class="stars">
            <span class="star filled">★</span>
            <span class="star filled">★</span>
            <span class="star filled">★</span>
            <span class="star filled">★</span>
            <span class="star">★</span>
          </div>
          <span class="rating-count">({{{product1Reviews}}})</span>
          {{/showRating1}}
        </div>
        <p class="product-description">{{{product1Description}}}</p>
        <div class="product-price-row">
          <div class="product-price-block">
            {{#product1OldPrice}}
            <span class="product-old-price">{{{product1OldPrice}}} TL</span>
            {{/product1OldPrice}}
            <span class="product-price">{{{product1Price}}} TL</span>
          </div>
          <button class="add-to-cart-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            {{{addToCartText}}}
          </button>
        </div>
      </div>
    </div>
    
    <div class="product-card">
      <div class="product-badge">{{{product2Badge}}}</div>
      <div class="product-image">
        <img src="{{{product2Image}}}" alt="{{{product2Title}}}" />
      </div>
      <div class="product-content">
        <h3 class="product-title">{{{product2Title}}}</h3>
        <div class="product-rating">
          {{#showRating2}}
          <div class="stars">
            <span class="star filled">★</span>
            <span class="star filled">★</span>
            <span class="star filled">★</span>
            <span class="star filled">★</span>
            <span class="star filled">★</span>
          </div>
          <span class="rating-count">({{{product2Reviews}}})</span>
          {{/showRating2}}
        </div>
        <p class="product-description">{{{product2Description}}}</p>
        <div class="product-price-row">
          <div class="product-price-block">
            {{#product2OldPrice}}
            <span class="product-old-price">{{{product2OldPrice}}} TL</span>
            {{/product2OldPrice}}
            <span class="product-price">{{{product2Price}}} TL</span>
          </div>
          <button class="add-to-cart-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            {{{addToCartText}}}
          </button>
        </div>
      </div>
    </div>
    
    <div class="product-card">
      <div class="product-badge">{{{product3Badge}}}</div>
      <div class="product-image">
        <img src="{{{product3Image}}}" alt="{{{product3Title}}}" />
      </div>
      <div class="product-content">
        <h3 class="product-title">{{{product3Title}}}</h3>
        <div class="product-rating">
          {{#showRating3}}
          <div class="stars">
            <span class="star filled">★</span>
            <span class="star filled">★</span>
            <span class="star filled">★</span>
            <span class="star">★</span>
            <span class="star">★</span>
          </div>
          <span class="rating-count">({{{product3Reviews}}})</span>
          {{/showRating3}}
        </div>
        <p class="product-description">{{{product3Description}}}</p>
        <div class="product-price-row">
          <div class="product-price-block">
            {{#product3OldPrice}}
            <span class="product-old-price">{{{product3OldPrice}}} TL</span>
            {{/product3OldPrice}}
            <span class="product-price">{{{product3Price}}} TL</span>
          </div>
          <button class="add-to-cart-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            {{{addToCartText}}}
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <div class="products-footer">
    <a href="{{{viewAllUrl}}}" class="view-all-btn">{{{viewAllText}}}</a>
  </div>
</div>`;

// Ürünler bileşeni için CSS stili
const productsStyle = `.products-section {
  padding: 80px 20px;
  background-color: #fff;
  max-width: 1200px;
  margin: 0 auto;
}

.products-header {
  text-align: center;
  margin-bottom: 50px;
}

.products-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 16px;
  position: relative;
  display: inline-block;
}

.products-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 3px;
  background: linear-gradient(90deg, #4a6cf7, #5e7ef8);
  border-radius: 5px;
}

.products-description {
  max-width: 700px;
  margin: 0 auto;
  color: #6c757d;
  font-size: 1.1rem;
  line-height: 1.6;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 50px;
}

@media (max-width: 992px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}

.product-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid #f1f3f5;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
  border-color: rgba(74, 108, 247, 0.1);
}

.product-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #4a6cf7;
  color: white;
  padding: 5px 12px;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(74, 108, 247, 0.3);
}

.product-image {
  height: 220px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-content {
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #212529;
  transition: color 0.3s ease;
}

.product-card:hover .product-title {
  color: #4a6cf7;
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  margin-right: 8px;
}

.star {
  color: #d1d5db;
  font-size: 1rem;
}

.star.filled {
  color: #fbbf24;
}

.rating-count {
  color: #6c757d;
  font-size: 0.85rem;
}

.product-description {
  font-size: 0.95rem;
  color: #6c757d;
  line-height: 1.5;
  margin-bottom: 20px;
}

.product-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.product-price-block {
  display: flex;
  flex-direction: column;
}

.product-old-price {
  font-size: 0.9rem;
  color: #adb5bd;
  text-decoration: line-through;
  margin-bottom: 2px;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #212529;
}

.add-to-cart-btn {
  background-color: #4a6cf7;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.add-to-cart-btn:hover {
  background-color: #3b5cf6;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(74, 108, 247, 0.25);
}

.add-to-cart-btn svg {
  transition: transform 0.3s ease;
}

.add-to-cart-btn:hover svg {
  transform: translateX(-3px);
}

.products-footer {
  text-align: center;
  margin-top: 20px;
}

.view-all-btn {
  display: inline-block;
  padding: 12px 28px;
  background-color: transparent;
  border: 2px solid #4a6cf7;
  color: #4a6cf7;
  font-weight: 600;
  border-radius: 50px;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  background-color: #4a6cf7;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(74, 108, 247, 0.2);
}`;

// Bileşen şablonlarını güncellemek için ana fonksiyon
async function updateComponentTemplates() {
  try {
    // Navbar bileşenini kontrol et
    const createNavbar = await prisma.component.findFirst({
      where: {
        name: {
          contains: "Navbar",
        },
      },
    });

    // Navbar bileşeni yoksa oluştur
    if (!createNavbar) {
      console.log("Navbar bileşeni oluşturuluyor...");
      const navbarComponent = await prisma.component.create({
        data: {
          name: "Navbar",
          description: "Dinamik olarak özelleştirilebilir navigasyon menüsü",
          tags: ["navbar", "menu", "navigasyon"],
          category: "layout",
          userId: null, // Şablon bileşen olduğunu belirtmek için null
        },
      });

      // Navbar bileşeni için versiyon oluştur
      const navbarSchema = {
        properties: {
          logoImage: {
            type: "string",
            title: "Logo Görseli",
            default: "https://via.placeholder.com/150x50",
          },
          logoUrl: {
            type: "string",
            title: "Logo Bağlantısı",
            default: "/",
          },
          altText: {
            type: "string",
            title: "Logo Alt Metni",
            default: "Site Logosu",
          },
          logoWidth: {
            type: "number",
            title: "Logo Genişliği (px)",
            default: 150,
          },
          logoHeight: {
            type: "number",
            title: "Logo Yüksekliği (px)",
            default: 40,
          },
          showLogo: {
            type: "boolean",
            title: "Logo Görseli Göster",
            default: true,
          },
          showLogoText: {
            type: "boolean",
            title: "Logo Metni Göster",
            default: false,
          },
          logoText: {
            type: "string",
            title: "Logo Metni",
            default: "Site Adı",
          },
          link1Url: {
            type: "string",
            title: "Link 1 URL",
            default: "/",
          },
          link1Text: {
            type: "string",
            title: "Link 1 Metni",
            default: "Ana Sayfa",
          },
          link2Url: {
            type: "string",
            title: "Link 2 URL",
            default: "/abonelik",
          },
          link2Text: {
            type: "string",
            title: "Link 2 Metni",
            default: "Abonelik",
          },
          link3Url: {
            type: "string",
            title: "Link 3 URL",
            default: "/urunler",
          },
          link3Text: {
            type: "string",
            title: "Link 3 Metni",
            default: "Ürünler",
          },
          link4Url: {
            type: "string",
            title: "Link 4 URL",
            default: "/iletisim",
          },
          link4Text: {
            type: "string",
            title: "Link 4 Metni",
            default: "İletişim",
          },
        },
      };

      const navbarCode = `
<!-- HTML Template -->
${navbarTemplate}

<!-- CSS Styles -->
<style>
${navbarStyle}
</style>
      `;

      await prisma.componentVersion.create({
        data: {
          componentId: navbarComponent.id,
          version: "1.0.0",
          code: navbarCode,
          schema: navbarSchema,
          preview: `data:image/svg+xml;base64,${Buffer.from(
            '<svg width="200" height="50" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffffff"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#333" text-anchor="middle">Navbar</text></svg>'
          ).toString("base64")}`,
          isActive: true,
        },
      });

      console.log(`Navbar bileşeni başarıyla oluşturuldu.`);
    }

    // Hero bileşenini kontrol et
    const createHero = await prisma.component.findFirst({
      where: {
        name: {
          contains: "Hero",
        },
      },
    });

    // Hero bileşeni yoksa oluştur
    if (!createHero) {
      console.log("Hero bileşeni oluşturuluyor...");
      const heroComponent = await prisma.component.create({
        data: {
          name: "Hero Bölümü",
          description: "Ana sayfa üst bölümü için görsel ve çağrı",
          tags: ["hero", "banner", "header"],
          category: "Layout",
          userId: null,
        },
      });

      // Hero şeması
      const heroSchema = {
        properties: {
          title: {
            type: "string",
            title: "Başlık",
            default: "Modern Web Sitesi Oluşturun",
          },
          description: {
            type: "string",
            title: "Açıklama",
            default:
              "Kullanımı kolay araçlarımızla profesyonel bir web sitesi oluşturun. Sürükle ve bırak arayüzü ile dakikalar içinde hazır olun.",
          },
          buttonText: {
            type: "string",
            title: "Buton Metni",
            default: "Hemen Başlayın",
          },
        },
      };

      const heroCode = `
<!-- HTML Template -->
${heroTemplate}

<!-- CSS Styles -->
<style>
${heroStyle}
</style>

<!-- JavaScript -->
<script>
// Hero specific JavaScript
</script>
      `;

      await prisma.componentVersion.create({
        data: {
          componentId: heroComponent.id,
          version: "1.0.0",
          code: heroCode,
          schema: heroSchema,
          preview: `data:image/svg+xml;base64,${Buffer.from(
            '<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#4a6cf7" text-anchor="middle">Hero Bölümü</text></svg>'
          ).toString("base64")}`,
          isActive: true,
        },
      });

      console.log(`Hero bileşeni başarıyla oluşturuldu.`);
    }

    // Features bileşenini kontrol et
    const createFeatures = await prisma.component.findFirst({
      where: {
        name: {
          contains: "Özellik",
        },
      },
    });

    // Features bileşeni yoksa oluştur
    if (!createFeatures) {
      console.log("Özellikler bileşeni oluşturuluyor...");
      const featuresComponent = await prisma.component.create({
        data: {
          name: "Özellikler Bölümü",
          description:
            "Ürün veya hizmet özelliklerini göstermek için kullanılan bölüm",
          tags: ["özellikler", "features", "satış noktaları"],
          category: "Content",
          userId: null,
        },
      });

      // Özellikler bileşeni için şema
      const featuresSchema = {
        properties: {
          sectionTitle: {
            type: "string",
            title: "Bölüm Başlığı",
            default: "Öne Çıkan Özellikler",
          },
          feature1Title: {
            type: "string",
            title: "Özellik 1 Başlığı",
            default: "Kolay Kullanım",
          },
          feature1Description: {
            type: "string",
            title: "Özellik 1 Açıklaması",
            default:
              "Kullanıcı dostu arayüzümüz sayesinde teknik bilgiye gerek kalmadan site oluşturabilirsiniz.",
          },
          feature2Title: {
            type: "string",
            title: "Özellik 2 Başlığı",
            default: "Hızlı Performans",
          },
          feature2Description: {
            type: "string",
            title: "Özellik 2 Açıklaması",
            default:
              "Optimize edilmiş kodlar sayesinde siteleriniz her zaman hızlı yüklenir ve sorunsuz çalışır.",
          },
          feature3Title: {
            type: "string",
            title: "Özellik 3 Başlığı",
            default: "Güvenli Altyapı",
          },
          feature3Description: {
            type: "string",
            title: "Özellik 3 Açıklaması",
            default:
              "En son güvenlik önlemleriyle siteniz ve verileriniz her zaman koruma altındadır.",
          },
        },
      };

      const featuresCode = `
<!-- HTML Template -->
${featuresTemplate}

<!-- CSS Styles -->
<style>
${featuresStyle}
</style>

<!-- JavaScript -->
<script>
// Features specific JavaScript
</script>
      `;

      await prisma.componentVersion.create({
        data: {
          componentId: featuresComponent.id,
          version: "1.0.0",
          code: featuresCode,
          schema: featuresSchema,
          preview: `data:image/svg+xml;base64,${Buffer.from(
            '<svg width="200" height="120" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f8f9fa"/><rect x="20" y="20" width="160" height="80" fill="#e9ecef" rx="10" ry="10"/><text x="100" y="65" font-family="Arial" font-size="14" fill="#4a6cf7" text-anchor="middle">Özellikler Bölümü</text></svg>'
          ).toString("base64")}`,
          isActive: true,
        },
      });

      console.log(`Özellikler bileşeni başarıyla oluşturuldu.`);
    }

    // Yeni bileşenler oluşturacak mıyız kontrol et
    const createSidebar = await prisma.component.findFirst({
      where: {
        name: {
          contains: "Sidebar",
        },
      },
    });

    const createFooter = await prisma.component.findFirst({
      where: {
        name: {
          contains: "Footer",
        },
      },
    });

    // Sidebar bileşeni yoksa oluştur
    if (!createSidebar) {
      console.log("Sidebar bileşeni oluşturuluyor...");
      const sidebarComponent = await prisma.component.create({
        data: {
          name: "Sidebar Bölümü",
          description:
            "Yan menü için kullanılabilecek özelleştirilebilir kenar çubuğu",
          tags: ["sidebar", "menu", "kenar çubuğu"],
          category: "Layout",
          userId: null, // Şablon bileşen olduğunu belirtmek için null
        },
      });

      // Sidebar bileşeni için versiyon oluştur
      const sidebarSchema = {
        properties: {
          sidebarTitle: {
            type: "string",
            title: "Sidebar Başlığı",
            default: "Kenar Çubuğu",
          },
          section1Title: {
            type: "string",
            title: "1. Bölüm Başlığı",
            default: "Hızlı Linkler",
          },
          link1Text: {
            type: "string",
            title: "Link 1 Metni",
            default: "Ana Sayfa",
          },
          link1Url: {
            type: "string",
            title: "Link 1 URL",
            default: "/",
          },
          link2Text: {
            type: "string",
            title: "Link 2 Metni",
            default: "Ürünler",
          },
          link2Url: {
            type: "string",
            title: "Link 2 URL",
            default: "/products",
          },
          link3Text: {
            type: "string",
            title: "Link 3 Metni",
            default: "Hakkımızda",
          },
          link3Url: {
            type: "string",
            title: "Link 3 URL",
            default: "/about",
          },
          link4Text: {
            type: "string",
            title: "Link 4 Metni",
            default: "İletişim",
          },
          link4Url: {
            type: "string",
            title: "Link 4 URL",
            default: "/contact",
          },
          section2Title: {
            type: "string",
            title: "2. Bölüm Başlığı",
            default: "Bilgi",
          },
          section2Content: {
            type: "string",
            title: "2. Bölüm İçeriği",
            default: "Bu alanda kısa bir bilgi veya açıklama yer alabilir.",
          },
          showContact: {
            type: "boolean",
            title: "İletişim Göster",
            default: true,
          },
          contactInfo: {
            type: "string",
            title: "İletişim Bilgileri",
            default: "Email: info@example.com\nTel: 0212 555 55 55",
          },
        },
      };

      const sidebarCode = `
<!-- HTML Template -->
${sidebarTemplate}

<!-- CSS Styles -->
<style>
${sidebarStyle}
</style>

<!-- JavaScript -->
<script>
// Sidebar specific JavaScript
</script>
      `;

      await prisma.componentVersion.create({
        data: {
          componentId: sidebarComponent.id,
          version: "1.0.0",
          code: sidebarCode,
          schema: sidebarSchema,
          preview: `data:image/svg+xml;base64,${Buffer.from(
            '<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#333" text-anchor="middle">Sidebar Bölümü</text></svg>'
          ).toString("base64")}`,
          isActive: true,
        },
      });

      console.log(`Sidebar bileşeni başarıyla oluşturuldu.`);
    }

    // Footer bileşeni yoksa oluştur
    if (!createFooter) {
      console.log("Footer bileşeni oluşturuluyor...");
      const footerComponent = await prisma.component.create({
        data: {
          name: "Footer Bölümü",
          description:
            "Sayfa altı bölüm için kullanılabilecek özelleştirilebilir footer",
          tags: ["footer", "alt bilgi"],
          category: "Layout",
          userId: null, // Şablon bileşen olduğunu belirtmek için null
        },
      });

      // Footer bileşeni için versiyon oluştur
      const footerSchema = {
        properties: {
          logoUrl: {
            type: "string",
            title: "Logo URL",
            default: "https://via.placeholder.com/150x50",
          },
          companyName: {
            type: "string",
            title: "Şirket Adı",
            default: "Şirket Adı",
          },
          companyDescription: {
            type: "string",
            title: "Şirket Açıklaması",
            default:
              "Şirketimiz hakkında kısa bir açıklama metni. Bu alanda işletmenizin değerlerini ve misyonunu belirtebilirsiniz.",
          },
          column1Title: {
            type: "string",
            title: "1. Sütun Başlığı",
            default: "Şirket",
          },
          column1Link1Text: {
            type: "string",
            title: "1. Sütun Link 1 Metni",
            default: "Hakkımızda",
          },
          column1Link1Url: {
            type: "string",
            title: "1. Sütun Link 1 URL",
            default: "/about",
          },
          column1Link2Text: {
            type: "string",
            title: "1. Sütun Link 2 Metni",
            default: "Kariyer",
          },
          column1Link2Url: {
            type: "string",
            title: "1. Sütun Link 2 URL",
            default: "/careers",
          },
          column1Link3Text: {
            type: "string",
            title: "1. Sütun Link 3 Metni",
            default: "Blog",
          },
          column1Link3Url: {
            type: "string",
            title: "1. Sütun Link 3 URL",
            default: "/blog",
          },
          column2Title: {
            type: "string",
            title: "2. Sütun Başlığı",
            default: "Destek",
          },
          column2Link1Text: {
            type: "string",
            title: "2. Sütun Link 1 Metni",
            default: "Yardım Merkezi",
          },
          column2Link1Url: {
            type: "string",
            title: "2. Sütun Link 1 URL",
            default: "/help",
          },
          column2Link2Text: {
            type: "string",
            title: "2. Sütun Link 2 Metni",
            default: "Gizlilik Politikası",
          },
          column2Link2Url: {
            type: "string",
            title: "2. Sütun Link 2 URL",
            default: "/privacy",
          },
          column2Link3Text: {
            type: "string",
            title: "2. Sütun Link 3 Metni",
            default: "Kullanım Şartları",
          },
          column2Link3Url: {
            type: "string",
            title: "2. Sütun Link 3 URL",
            default: "/terms",
          },
          address: {
            type: "string",
            title: "Adres",
            default: "Adres Caddesi No: 123\nŞehir/İlçe, 34000",
          },
          email: {
            type: "string",
            title: "E-posta",
            default: "info@example.com",
          },
          phone: {
            type: "string",
            title: "Telefon",
            default: "+90 212 555 55 55",
          },
          copyright: {
            type: "string",
            title: "Telif Hakkı Metni",
            default: "© 2023 Şirket Adı. Tüm hakları saklıdır.",
          },
          socialLink1: {
            type: "string",
            title: "Sosyal Medya 1 URL",
            default: "https://facebook.com",
          },
          socialLink2: {
            type: "string",
            title: "Sosyal Medya 2 URL",
            default: "https://twitter.com",
          },
          socialLink3: {
            type: "string",
            title: "Sosyal Medya 3 URL",
            default: "https://instagram.com",
          },
        },
      };

      const footerCode = `
<!-- HTML Template -->
${footerTemplate}

<!-- CSS Styles -->
<style>
${footerStyle}
</style>

<!-- JavaScript -->
<script>
// Footer specific JavaScript
</script>
      `;

      await prisma.componentVersion.create({
        data: {
          componentId: footerComponent.id,
          version: "1.0.0",
          code: footerCode,
          schema: footerSchema,
          preview: `data:image/svg+xml;base64,${Buffer.from(
            '<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#1f2937"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#ffffff" text-anchor="middle">Footer Bölümü</text></svg>'
          ).toString("base64")}`,
          isActive: true,
        },
      });

      console.log(`Footer bileşeni başarıyla oluşturuldu.`);
    }

    // Ürünler bileşenini kontrol et
    const createProducts = await prisma.component.findFirst({
      where: {
        name: {
          contains: "Ürünler",
        },
      },
    });

    // Ürünler bileşeni yoksa oluştur
    if (!createProducts) {
      console.log("Ürünler bileşeni oluşturuluyor...");
      const productsComponent = await prisma.component.create({
        data: {
          name: "Ürünler Bölümü",
          description:
            "Sayfada gösterilecek ürünler için 3 ürünlük görsel bileşen",
          tags: ["ürünler", "ürün listesi", "ürün kartları"],
          category: "content",
          userId: null, // Şablon bileşen olduğunu belirtmek için null
        },
      });

      // Ürünler bileşeni için versiyon oluştur
      const productsSchema = {
        properties: {
          sectionTitle: {
            type: "string",
            title: "Bölüm Başlığı",
            default: "Öne Çıkan Ürünlerimiz",
          },
          sectionDescription: {
            type: "string",
            title: "Bölüm Açıklaması",
            default:
              "En çok tercih edilen ve en son eklenen ürünlerimizden bir seçki",
          },
          product1Title: {
            type: "string",
            title: "Ürün 1 Başlığı",
            default: "Akıllı Saat X30 Pro",
          },
          product1Description: {
            type: "string",
            title: "Ürün 1 Açıklaması",
            default:
              "Su geçirmez, nabız ölçer, uyku takibi ve 15 gün pil ömrü. Tüm aktivitelerinizde yanınızda.",
          },
          product1Image: {
            type: "string",
            title: "Ürün 1 Görseli",
            default: "https://via.placeholder.com/300x300?text=Ürün+1",
          },
          product1Price: {
            type: "string",
            title: "Ürün 1 Fiyatı",
            default: "1.299",
          },
          product1OldPrice: {
            type: "string",
            title: "Ürün 1 Eski Fiyatı (İndirimliyse)",
            default: "1.699",
          },
          product1Badge: {
            type: "string",
            title: "Ürün 1 Rozeti",
            default: "İndirimli",
          },
          showRating1: {
            type: "boolean",
            title: "Ürün 1 Puanını Göster",
            default: true,
          },
          product1Reviews: {
            type: "string",
            title: "Ürün 1 Değerlendirme Sayısı",
            default: "128",
          },
          product2Title: {
            type: "string",
            title: "Ürün 2 Başlığı",
            default: "Kablosuz Kulaklık M5",
          },
          product2Description: {
            type: "string",
            title: "Ürün 2 Açıklaması",
            default:
              "Aktif gürültü engelleme, 30 saat pil ömrü ve kristal netliğinde ses kalitesi.",
          },
          product2Image: {
            type: "string",
            title: "Ürün 2 Görseli",
            default: "https://via.placeholder.com/300x300?text=Ürün+2",
          },
          product2Price: {
            type: "string",
            title: "Ürün 2 Fiyatı",
            default: "899",
          },
          product2OldPrice: {
            type: "string",
            title: "Ürün 2 Eski Fiyatı (İndirimliyse)",
            default: "",
          },
          product2Badge: {
            type: "string",
            title: "Ürün 2 Rozeti",
            default: "Yeni",
          },
          showRating2: {
            type: "boolean",
            title: "Ürün 2 Puanını Göster",
            default: true,
          },
          product2Reviews: {
            type: "string",
            title: "Ürün 2 Değerlendirme Sayısı",
            default: "89",
          },
          product3Title: {
            type: "string",
            title: "Ürün 3 Başlığı",
            default: "Akıllı Ev Asistanı",
          },
          product3Description: {
            type: "string",
            title: "Ürün 3 Açıklaması",
            default:
              "Evinizi sesinizle kontrol edin. Akıllı cihazlarla uyumlu, müzik çalar ve günlük bilgiler sunar.",
          },
          product3Image: {
            type: "string",
            title: "Ürün 3 Görseli",
            default: "https://via.placeholder.com/300x300?text=Ürün+3",
          },
          product3Price: {
            type: "string",
            title: "Ürün 3 Fiyatı",
            default: "749",
          },
          product3OldPrice: {
            type: "string",
            title: "Ürün 3 Eski Fiyatı (İndirimliyse)",
            default: "999",
          },
          product3Badge: {
            type: "string",
            title: "Ürün 3 Rozeti",
            default: "İndirimli",
          },
          showRating3: {
            type: "boolean",
            title: "Ürün 3 Puanını Göster",
            default: true,
          },
          product3Reviews: {
            type: "string",
            title: "Ürün 3 Değerlendirme Sayısı",
            default: "46",
          },
          addToCartText: {
            type: "string",
            title: "Sepete Ekle Butonu Metni",
            default: "Sepete Ekle",
          },
          viewAllText: {
            type: "string",
            title: "Tümünü Gör Butonu Metni",
            default: "Tüm Ürünleri Gör",
          },
          viewAllUrl: {
            type: "string",
            title: "Tümünü Gör Butonu URL",
            default: "/urunler",
          },
        },
      };

      const productsCode = `
<!-- HTML Template -->
${productsTemplate}

<!-- CSS Styles -->
<style>
${productsStyle}
</style>

<!-- JavaScript -->
<script>
// Ürünler bileşeni JavaScript
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', function() {
    // Burada sepete ekleme işlemleri yapılabilir
    alert('Ürün sepete eklendi!');
  });
});
</script>
      `;

      await prisma.componentVersion.create({
        data: {
          componentId: productsComponent.id,
          version: "1.0.0",
          code: productsCode,
          schema: productsSchema,
          preview: `data:image/svg+xml;base64,${Buffer.from(
            '<svg width="200" height="120" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f8f9fa"/><rect x="20" y="20" width="160" height="80" fill="#e9ecef" rx="10" ry="10"/><text x="100" y="65" font-family="Arial" font-size="14" fill="#4a6cf7" text-anchor="middle">Ürünler Bölümü</text></svg>'
          ).toString("base64")}`,
          isActive: true,
        },
      });

      console.log(`Ürünler bileşeni başarıyla oluşturuldu.`);
    }

    // Slider bileşeni kontrol et
    const createSlider = await prisma.component.findFirst({
      where: {
        name: {
          contains: "Slider",
        },
      },
    });

    // Slider bileşeni yoksa oluştur
    if (!createSlider) {
      console.log("Slider bileşeni oluşturuluyor...");
      const sliderComponent = await prisma.component.create({
        data: {
          name: "Slider Bölümü",
          description: "Tam genişlikli otomatik slider/kaydırıcı bileşeni",
          tags: ["slider", "kaydırıcı", "galeri", "fotoğraf"],
          category: "content",
          userId: null,
        },
      });

      // Slider bileşeni için şema
      const sliderSchema = {
        properties: {
          slide1Image: {
            type: "string",
            title: "Slayt 1 Görsel",
            default: "https://via.placeholder.com/1200x500?text=Slayt+1",
          },
          slide1Alt: {
            type: "string",
            title: "Slayt 1 Görsel Alt Metni",
            default: "Slayt 1",
          },
          slide1Title: {
            type: "string",
            title: "Slayt 1 Başlık",
            default: "Etkileyici Web Siteleri Oluşturun",
          },
          slide1Description: {
            type: "string",
            title: "Slayt 1 Açıklama",
            default:
              "Modern tasarım araçlarımızla profesyonel siteler oluşturun",
          },
          slide1ButtonText: {
            type: "string",
            title: "Slayt 1 Buton Metni",
            default: "Daha Fazla Bilgi",
          },
          slide1ButtonUrl: {
            type: "string",
            title: "Slayt 1 Buton Bağlantısı",
            default: "/hakkimizda",
          },
          slide2Image: {
            type: "string",
            title: "Slayt 2 Görsel",
            default: "https://via.placeholder.com/1200x500?text=Slayt+2",
          },
          slide2Alt: {
            type: "string",
            title: "Slayt 2 Görsel Alt Metni",
            default: "Slayt 2",
          },
          slide2Title: {
            type: "string",
            title: "Slayt 2 Başlık",
            default: "Güçlü E-Ticaret Özellikleri",
          },
          slide2Description: {
            type: "string",
            title: "Slayt 2 Açıklama",
            default:
              "Online satış çözümlerimizle ürünlerinizi kolayca pazarlayın",
          },
          slide2ButtonText: {
            type: "string",
            title: "Slayt 2 Buton Metni",
            default: "Özellikleri Keşfet",
          },
          slide2ButtonUrl: {
            type: "string",
            title: "Slayt 2 Buton Bağlantısı",
            default: "/ozellikler",
          },
          slide3Image: {
            type: "string",
            title: "Slayt 3 Görsel",
            default: "https://via.placeholder.com/1200x500?text=Slayt+3",
          },
          slide3Alt: {
            type: "string",
            title: "Slayt 3 Görsel Alt Metni",
            default: "Slayt 3",
          },
          slide3Title: {
            type: "string",
            title: "Slayt 3 Başlık",
            default: "7/24 Teknik Destek",
          },
          slide3Description: {
            type: "string",
            title: "Slayt 3 Açıklama",
            default: "Profesyonel ekibimiz tüm sorularınızda yanınızda",
          },
          slide3ButtonText: {
            type: "string",
            title: "Slayt 3 Buton Metni",
            default: "İletişime Geç",
          },
          slide3ButtonUrl: {
            type: "string",
            title: "Slayt 3 Buton Bağlantısı",
            default: "/iletisim",
          },
        },
      };

      const sliderCode = `
<!-- HTML Template -->
${sliderTemplate}

<!-- CSS Styles -->
<style>
${sliderStyle}
</style>

<!-- JavaScript -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Slider fonksiyonlarını başlat
  initSlider();
  
  function initSlider() {
    // Slider için gerekli elementleri seç
    const slider = document.querySelector('.slider');
    if (!slider) return; // Slider yoksa fonksiyondan çık
    
    const slides = slider.querySelectorAll('.slide');
    const track = slider.querySelector('.slider-track');
    const dots = slider.querySelectorAll('.slider-dot');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    
    let currentIndex = 0;
    let autoSlideInterval;
    
    // Başlangıç slaytını göster
    showSlide(0);
    
    // Butonlara tıklama olaylarını ekle
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        goToPrevSlide();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        goToNextSlide();
      });
    }
    
    // Noktalara tıklama olaylarını ekle
    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        showSlide(index);
        resetAutoSlide();
      });
    });
    
    // Otomatik slayt değiştirmeyi başlat
    startAutoSlide();
    
    // Slaytı değiştirme fonksiyonu
    function showSlide(index) {
      // Geçerli slaytı deaktif et
      slides.forEach(function(slide) {
        slide.classList.remove('active');
      });
      
      dots.forEach(function(dot) {
        dot.classList.remove('active');
      });
      
      // Yeni slaytı aktif et
      if (slides[index]) {
        slides[index].classList.add('active');
      }
      
      if (dots[index]) {
        dots[index].classList.add('active');
      }
      
      // Slayt pozisyonunu güncelle
      if (track) {
        track.style.transform = 'translateX(-' + (index * 33.333) + '%)';
      }
      
      // Geçerli indeksi güncelle
      currentIndex = index;
    }
    
    // Önceki slayta git
    function goToPrevSlide() {
      const newIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(newIndex);
      resetAutoSlide();
    }
    
    // Sonraki slayta git
    function goToNextSlide() {
      const newIndex = (currentIndex + 1) % slides.length;
      showSlide(newIndex);
      resetAutoSlide();
    }
    
    // Otomatik slayt değiştirmeyi başlat
    function startAutoSlide() {
      autoSlideInterval = setInterval(function() {
        goToNextSlide();
      }, 5000);
    }
    
    // Otomatik slayt değiştirmeyi sıfırla
    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }
    
    // Touch ve sürükleme desteği
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Dokunma olaylarını ekle
    slider.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    // Fare tıklama ve sürükleme için
    slider.addEventListener('mousedown', function(e) {
      touchStartX = e.screenX;
      slider.style.cursor = 'grabbing';
    });
    
    slider.addEventListener('mouseup', function(e) {
      touchEndX = e.screenX;
      slider.style.cursor = 'grab';
      handleSwipe();
    });
    
    // Kaydırma yönünü belirle
    function handleSwipe() {
      if (touchEndX === 0) return;
      
      const difference = touchStartX - touchEndX;
      const threshold = 50; // Minimum kaydırma mesafesi
      
      if (difference > threshold) {
        // Sola kaydırma - Sonraki slayt
        goToNextSlide();
      } else if (difference < -threshold) {
        // Sağa kaydırma - Önceki slayt
        goToPrevSlide();
      }
      
      // Değerleri sıfırla
      touchStartX = 0;
      touchEndX = 0;
    }
  }
});
</script>
      `;

      await prisma.componentVersion.create({
        data: {
          componentId: sliderComponent.id,
          version: "1.0.0",
          code: sliderCode,
          schema: sliderSchema,
          preview: `data:image/svg+xml;base64,${Buffer.from(
            '<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f8f9fa"/><rect x="20" y="30" width="160" height="40" fill="#e9ecef" rx="4"/><circle cx="40" cy="80" r="5" fill="#4a6cf7"/><circle cx="60" cy="80" r="5" fill="#e9ecef"/><circle cx="80" cy="80" r="5" fill="#e9ecef"/><text x="100" y="25" font-family="Arial" font-size="10" fill="#4a6cf7" text-anchor="middle">Slider Bölümü</text></svg>'
          ).toString("base64")}`,
          isActive: true,
        },
      });

      console.log(`Slider bileşeni başarıyla oluşturuldu.`);
    }

    // Tüm bileşenleri al
    const components = await prisma.component.findMany();

    if (components.length === 0) {
      console.log("Bileşen bulunamadı. Önce bileşenler oluşturulmalı.");
      return;
    }

    // Her bileşeni kontrol et ve şablonları güncelle
    for (const component of components) {
      console.log(`Bileşen işleniyor: ${component.name}`);

      // Bileşenin versiyonlarını al
      const versions = await prisma.componentVersion.findMany({
        where: {
          componentId: component.id,
        },
      });

      // İsme göre şablon ve şema seç
      let template = "";
      let style = "";
      let schemaObj = {};

      if (component.name.toLowerCase().includes("hero")) {
        template = heroTemplate;
        style = heroStyle;
        schemaObj = {
          properties: {
            title: {
              type: "string",
              title: "Başlık",
              default: "Modern Web Sitesi Oluşturun",
            },
            description: {
              type: "string",
              title: "Açıklama",
              default:
                "Kullanımı kolay araçlarımızla profesyonel bir web sitesi oluşturun. Sürükle ve bırak arayüzü ile dakikalar içinde hazır olun.",
            },
            buttonText: {
              type: "string",
              title: "Buton Metni",
              default: "Hemen Başlayın",
            },
          },
        };
      } else if (
        component.name.toLowerCase().includes("özellik") ||
        component.name.toLowerCase().includes("feature")
      ) {
        template = featuresTemplate;
        style = featuresStyle;
        schemaObj = {
          properties: {
            sectionTitle: {
              type: "string",
              title: "Bölüm Başlığı",
              default: "Öne Çıkan Özellikler",
            },
            feature1Title: {
              type: "string",
              title: "Özellik 1 Başlığı",
              default: "Kolay Kullanım",
            },
            feature1Description: {
              type: "string",
              title: "Özellik 1 Açıklaması",
              default:
                "Kullanıcı dostu arayüzümüz sayesinde teknik bilgiye gerek kalmadan site oluşturabilirsiniz.",
            },
            feature2Title: {
              type: "string",
              title: "Özellik 2 Başlığı",
              default: "Hızlı Performans",
            },
            feature2Description: {
              type: "string",
              title: "Özellik 2 Açıklaması",
              default:
                "Optimize edilmiş kodlar sayesinde siteleriniz her zaman hızlı yüklenir ve sorunsuz çalışır.",
            },
            feature3Title: {
              type: "string",
              title: "Özellik 3 Başlığı",
              default: "Güvenli Altyapı",
            },
            feature3Description: {
              type: "string",
              title: "Özellik 3 Açıklaması",
              default:
                "En son güvenlik önlemleriyle siteniz ve verileriniz her zaman koruma altındadır.",
            },
          },
        };
      } else if (component.name.toLowerCase().includes("slider")) {
        template = sliderTemplate;
        style = sliderStyle;
        schemaObj = {
          properties: {
            slide1Image: {
              type: "string",
              title: "Slayt 1 Görsel",
              default: "https://via.placeholder.com/1200x500?text=Slayt+1",
            },
            slide1Alt: {
              type: "string",
              title: "Slayt 1 Görsel Alt Metni",
              default: "Slayt 1",
            },
            slide1Title: {
              type: "string",
              title: "Slayt 1 Başlık",
              default: "Etkileyici Web Siteleri Oluşturun",
            },
            slide1Description: {
              type: "string",
              title: "Slayt 1 Açıklama",
              default:
                "Modern tasarım araçlarımızla profesyonel siteler oluşturun",
            },
            slide1ButtonText: {
              type: "string",
              title: "Slayt 1 Buton Metni",
              default: "Daha Fazla Bilgi",
            },
            slide1ButtonUrl: {
              type: "string",
              title: "Slayt 1 Buton Bağlantısı",
              default: "/hakkimizda",
            },
            slide2Image: {
              type: "string",
              title: "Slayt 2 Görsel",
              default: "https://via.placeholder.com/1200x500?text=Slayt+2",
            },
            slide2Alt: {
              type: "string",
              title: "Slayt 2 Görsel Alt Metni",
              default: "Slayt 2",
            },
            slide2Title: {
              type: "string",
              title: "Slayt 2 Başlık",
              default: "Güçlü E-Ticaret Özellikleri",
            },
            slide2Description: {
              type: "string",
              title: "Slayt 2 Açıklama",
              default:
                "Online satış çözümlerimizle ürünlerinizi kolayca pazarlayın",
            },
            slide2ButtonText: {
              type: "string",
              title: "Slayt 2 Buton Metni",
              default: "Özellikleri Keşfet",
            },
            slide2ButtonUrl: {
              type: "string",
              title: "Slayt 2 Buton Bağlantısı",
              default: "/ozellikler",
            },
            slide3Image: {
              type: "string",
              title: "Slayt 3 Görsel",
              default: "https://via.placeholder.com/1200x500?text=Slayt+3",
            },
            slide3Alt: {
              type: "string",
              title: "Slayt 3 Görsel Alt Metni",
              default: "Slayt 3",
            },
            slide3Title: {
              type: "string",
              title: "Slayt 3 Başlık",
              default: "7/24 Teknik Destek",
            },
            slide3Description: {
              type: "string",
              title: "Slayt 3 Açıklama",
              default: "Profesyonel ekibimiz tüm sorularınızda yanınızda",
            },
            slide3ButtonText: {
              type: "string",
              title: "Slayt 3 Buton Metni",
              default: "İletişime Geç",
            },
            slide3ButtonUrl: {
              type: "string",
              title: "Slayt 3 Buton Bağlantısı",
              default: "/iletisim",
            },
          },
        };
      } else if (component.name.toLowerCase() === "navbar") {
        // Navbar bileşeni zaten yukarıda oluşturuldu, güncelleme yapmayalım
        console.log("Navbar bileşeni zaten güncel.");
        continue;
      } else if (component.name.toLowerCase().includes("sidebar")) {
        // Sidebar bileşeni güncellenmesin, zaten yukarıda oluşturuldu
        console.log("Sidebar bileşeni zaten güncel.");
        continue;
      } else if (component.name.toLowerCase().includes("footer")) {
        // Footer bileşeni güncellenmesin, zaten yukarıda oluşturuldu
        console.log("Footer bileşeni zaten güncel.");
        continue;
      } else if (component.name.toLowerCase().includes("ürün")) {
        template = productsTemplate;
        style = productsStyle;
        schemaObj = {
          properties: {
            sectionTitle: {
              type: "string",
              title: "Bölüm Başlığı",
              default: "Öne Çıkan Ürünlerimiz",
            },
            sectionDescription: {
              type: "string",
              title: "Bölüm Açıklaması",
              default:
                "En çok tercih edilen ve en son eklenen ürünlerimizden bir seçki",
            },
            product1Title: {
              type: "string",
              title: "Ürün 1 Başlığı",
              default: "Akıllı Saat X30 Pro",
            },
            product1Description: {
              type: "string",
              title: "Ürün 1 Açıklaması",
              default:
                "Su geçirmez, nabız ölçer, uyku takibi ve 15 gün pil ömrü. Tüm aktivitelerinizde yanınızda.",
            },
            product1Image: {
              type: "string",
              title: "Ürün 1 Görseli",
              default: "https://via.placeholder.com/300x300?text=Ürün+1",
            },
            product1Price: {
              type: "string",
              title: "Ürün 1 Fiyatı",
              default: "1.299",
            },
            product1OldPrice: {
              type: "string",
              title: "Ürün 1 Eski Fiyatı (İndirimliyse)",
              default: "1.699",
            },
            product1Badge: {
              type: "string",
              title: "Ürün 1 Rozeti",
              default: "İndirimli",
            },
            showRating1: {
              type: "boolean",
              title: "Ürün 1 Puanını Göster",
              default: true,
            },
            product1Reviews: {
              type: "string",
              title: "Ürün 1 Değerlendirme Sayısı",
              default: "128",
            },
            product2Title: {
              type: "string",
              title: "Ürün 2 Başlığı",
              default: "Kablosuz Kulaklık M5",
            },
            product2Description: {
              type: "string",
              title: "Ürün 2 Açıklaması",
              default:
                "Aktif gürültü engelleme, 30 saat pil ömrü ve kristal netliğinde ses kalitesi.",
            },
            product2Image: {
              type: "string",
              title: "Ürün 2 Görseli",
              default: "https://via.placeholder.com/300x300?text=Ürün+2",
            },
            product2Price: {
              type: "string",
              title: "Ürün 2 Fiyatı",
              default: "899",
            },
            product2OldPrice: {
              type: "string",
              title: "Ürün 2 Eski Fiyatı (İndirimliyse)",
              default: "",
            },
            product2Badge: {
              type: "string",
              title: "Ürün 2 Rozeti",
              default: "Yeni",
            },
            showRating2: {
              type: "boolean",
              title: "Ürün 2 Puanını Göster",
              default: true,
            },
            product2Reviews: {
              type: "string",
              title: "Ürün 2 Değerlendirme Sayısı",
              default: "89",
            },
            product3Title: {
              type: "string",
              title: "Ürün 3 Başlığı",
              default: "Akıllı Ev Asistanı",
            },
            product3Description: {
              type: "string",
              title: "Ürün 3 Açıklaması",
              default:
                "Evinizi sesinizle kontrol edin. Akıllı cihazlarla uyumlu, müzik çalar ve günlük bilgiler sunar.",
            },
            product3Image: {
              type: "string",
              title: "Ürün 3 Görseli",
              default: "https://via.placeholder.com/300x300?text=Ürün+3",
            },
            product3Price: {
              type: "string",
              title: "Ürün 3 Fiyatı",
              default: "749",
            },
            product3OldPrice: {
              type: "string",
              title: "Ürün 3 Eski Fiyatı (İndirimliyse)",
              default: "999",
            },
            product3Badge: {
              type: "string",
              title: "Ürün 3 Rozeti",
              default: "İndirimli",
            },
            showRating3: {
              type: "boolean",
              title: "Ürün 3 Puanını Göster",
              default: true,
            },
            product3Reviews: {
              type: "string",
              title: "Ürün 3 Değerlendirme Sayısı",
              default: "46",
            },
            addToCartText: {
              type: "string",
              title: "Sepete Ekle Butonu Metni",
              default: "Sepete Ekle",
            },
            viewAllText: {
              type: "string",
              title: "Tümünü Gör Butonu Metni",
              default: "Tüm Ürünleri Gör",
            },
            viewAllUrl: {
              type: "string",
              title: "Tümünü Gör Butonu URL",
              default: "/urunler",
            },
          },
        };
      } else {
        // Diğer bileşenler için varsayılan şablon
        template = `<div class="component">
  <h2>{{{title}}}</h2>
  <p>{{{content}}}</p>
</div>`;
        style = `.component {
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #eee;
  border-radius: 8px;
}`;
        schemaObj = {
          properties: {
            title: {
              type: "string",
              title: "Başlık",
              default: "Bileşen Başlığı",
            },
            content: {
              type: "string",
              title: "İçerik",
              default: "Bileşen içeriği burada yer alacak.",
            },
          },
        };
      }

      // HTML, CSS ve şema bilgilerini birleştir
      const fullCode = `
<!-- HTML Template -->
${template}

<!-- CSS Styles -->
<style>
${style}
</style>

<!-- JavaScript -->
<script>
// Component specific JavaScript
</script>
      `;

      // Veritabanında güncelle
      if (versions.length > 0) {
        // Var olan versiyonu güncelle
        await prisma.componentVersion.update({
          where: { id: versions[0].id },
          data: {
            code: fullCode,
            schema: schemaObj,
            isActive: true,
          },
        });
        console.log(`Bileşen versiyonu güncellendi: ${component.name}`);
      } else {
        // Yeni versiyon oluştur
        await prisma.componentVersion.create({
          data: {
            componentId: component.id,
            version: "1.0.0",
            code: fullCode,
            schema: schemaObj,
            preview: `data:image/svg+xml;base64,${Buffer.from(
              '<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#333" text-anchor="middle">' +
                component.name +
                "</text></svg>"
            ).toString("base64")}`,
            isActive: true,
          },
        });
        console.log(`Yeni bileşen versiyonu oluşturuldu: ${component.name}`);
      }

      // Varsayılan prop değerlerini konsola yazdır (sadece bilgi amaçlı)
      console.log(
        `${component.name} için şema:`,
        JSON.stringify(schemaObj, null, 2)
      );
    }

    console.log("Tüm bileşen şablonları başarıyla güncellendi.");
  } catch (error) {
    console.error("Bileşen şablonları güncellenirken hata oluştu:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Scripti çalıştır
updateComponentTemplates();
