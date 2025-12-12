import React, { useState, useEffect, useRef } from 'react';

const CancerAwarenessWebsite = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', phone: '', subject: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sampleQuotes = [
    "Hope is the companion of power, and mother of success.",
    "Cancer may have started the fight, but I will finish it.",
    "You never know how strong you are until being strong is your only choice.",
    "Every day is a new beginning. Take a deep breath and start again.",
    "The human spirit is stronger than anything that can happen to it.",
    "Strength comes from overcoming the things you once thought you couldn't."
  ];

  useEffect(() => {
    setQuotes(sampleQuotes);
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % sampleQuotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const sections = ['home', 'about', 'services', 'support', 'resources', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = { id: Date.now(), ...formData, date: new Date().toLocaleString() };
    setMessages(prev => [newMessage, ...prev]);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
    setFormData({ name: '', email: '', message: '', phone: '', subject: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  const stats = [
    { number: "10M+", label: "People Supported", icon: "👥" },
    { number: "500+", label: "Medical Experts", icon: "⚕️" },
    { number: "24/7", label: "Support Available", icon: "⏰" },
    { number: "95%", label: "Satisfaction Rate", icon: "⭐" }
  ];

  const services = [
    { title: "Medical Consultation", description: "Expert medical advice and second opinions from oncology specialists worldwide.", icon: "🩺" },
    { title: "Emotional Support", description: "24/7 counseling and peer support groups for patients and caregivers.", icon: "💖" },
    { title: "Financial Assistance", description: "Guidance on insurance, treatment funding, and financial aid programs.", icon: "💰" },
    { title: "Nutrition Guidance", description: "Personalized diet plans and nutritional counseling for cancer patients.", icon: "🍎" },
    { title: "Clinical Trials", description: "Access to latest clinical trials and innovative treatment options.", icon: "🔬" },
    { title: "Caregiver Support", description: "Resources and training for family members and caregivers.", icon: "👨‍👩‍👧‍👦" }
  ];

  const testimonials = [
    { name: "Sarah M.", role: "Breast Cancer Survivor", text: "HopeBridge gave me the strength to fight. The support groups were invaluable." },
    { name: "Michael T.", role: "Caregiver", text: "I found the guidance and emotional support I desperately needed here." },
    { name: "Lisa K.", role: "5-Year Survivor", text: "The medical consultation service connected me with specialists who changed my life." }
  ];

  const resources = [
    { title: "Treatment Guide", description: "Comprehensive guide to modern cancer treatments", icon: "📚" },
    { title: "Nutrition Plans", description: "Meal plans designed for cancer patients", icon: "🥗" },
    { title: "Exercise Programs", description: "Safe exercise routines during treatment", icon: "🏃" },
    { title: "Mental Health", description: "Coping strategies and mindfulness techniques", icon: "🧘" }
  ];

  const FloatingHeart = ({ index }) => {
    const heartY = scrollY * (0.08 + index * 0.04);
    const heartX = Math.sin(scrollY * 0.01 + index) * 15;
    return (
      <div
        className="fixed pointer-events-none z-10 text-pink-400 opacity-20 transition-all duration-100"
        style={{
          left: `${10 + index * 18}%`,
          top: `${15 + index * 12}%`,
          transform: `translate(${heartX}px, ${-heartY}px) scale(${0.7 + Math.sin(scrollY * 0.01 + index) * 0.3})`,
          fontSize: `${25 + index * 8}px`
        }}
      >
        💖
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-black text-gray-100' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 text-gray-900'}`}>
      
      {[0, 1, 2, 3, 4].map(i => <FloatingHeart key={i} index={i} />)}

      {/* Floating Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'py-2 shadow-2xl' : 'py-4 shadow-lg'} ${darkMode ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-xl border-b ${darkMode ? 'border-purple-800/30' : 'border-purple-200/50'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className={`p-2 rounded-xl ${darkMode ? 'bg-gradient-to-br from-pink-600 to-purple-600' : 'bg-gradient-to-br from-pink-400 to-purple-500'} shadow-lg transform hover:scale-110 transition-transform`}>
                <span className="text-2xl">🎗️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">HopeBridge</h1>
                <p className="text-xs opacity-75">Cancer Awareness & Support</p>
              </div>
            </div>

            <nav className="hidden lg:flex space-x-1">
              {[
                { name: 'Home', id: 'home' },
                { name: 'About', id: 'about' },
                { name: 'Services', id: 'services' },
                { name: 'Support', id: 'support' },
                { name: 'Resources', id: 'resources' },
                { name: 'Contact', id: 'contact' }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${activeSection === item.id ? (darkMode ? 'bg-purple-600 text-white shadow-lg' : 'bg-purple-500 text-white shadow-lg') : (darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700')}`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-full transition-all ${darkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-purple-100 text-purple-700'} hover:scale-110`}>
                {darkMode ? '☀️' : '🌙'}
              </button>
              <button onClick={() => setShowMessages(!showMessages)} className={`relative p-2 rounded-full ${darkMode ? 'bg-pink-600/20 text-pink-400' : 'bg-pink-100 text-pink-600'}`}>
                💌
                {messages.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{messages.length}</span>}
              </button>
              <button onClick={() => scrollToSection('contact')} className={`hidden sm:block px-5 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform ${darkMode ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white' : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'}`}>
                Get Help
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
                <div className="space-y-1">
                  <div className={`w-6 h-0.5 ${darkMode ? 'bg-white' : 'bg-gray-900'}`}></div>
                  <div className={`w-6 h-0.5 ${darkMode ? 'bg-white' : 'bg-gray-900'}`}></div>
                  <div className={`w-6 h-0.5 ${darkMode ? 'bg-white' : 'bg-gray-900'}`}></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden mt-4 pb-4 px-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg mx-4 shadow-xl`}>
            {['home', 'about', 'services', 'support', 'resources', 'contact'].map((item) => (
              <button key={item} onClick={() => scrollToSection(item)} className={`block w-full text-left py-3 px-4 rounded-lg mb-1 ${activeSection === item ? (darkMode ? 'bg-purple-600' : 'bg-purple-500 text-white') : ''}`}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Messages Dropdown */}
        {showMessages && (
          <div className={`absolute top-full right-4 mt-2 w-96 max-w-[calc(100vw-2rem)] max-h-96 overflow-y-auto rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Messages ({messages.length})</h3>
                <button onClick={() => setShowMessages(false)} className="text-xl">×</button>
              </div>
            </div>
            {messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-4xl mb-2">📭</p>
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="divide-y dark:divide-gray-700">
                {messages.map(msg => (
                  <div key={msg.id} className={`p-4 ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{msg.name}</h4>
                      <span className="text-xs text-gray-500">{msg.date}</span>
                    </div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">{msg.subject}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{msg.message.substring(0, 100)}...</p>
                    <p className="text-xs text-gray-500 mt-1">📧 {msg.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden min-h-screen flex items-center pt-24 pb-12">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.5}px)`,
            opacity: darkMode ? 0.15 : 0.2
          }}
        />
        
        <div className={`absolute inset-0 z-10 ${darkMode ? 'bg-gradient-to-b from-gray-900/80 via-purple-900/50 to-black/90' : 'bg-gradient-to-b from-white/60 via-purple-50/50 to-pink-50/70'}`} />

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <span className={`inline-block px-6 py-3 rounded-full mb-6 text-lg font-semibold ${darkMode ? 'bg-pink-900/50 text-pink-300 border border-pink-700' : 'bg-pink-100 text-pink-700 border-2 border-pink-300'}`}>
              🎗️ You Are Not Alone
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
                Together We Can
              </span>
              <br />
              <span className={darkMode ? 'text-white' : 'text-gray-900'}>Beat Cancer</span>
            </h1>
            <p className={`text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Join our global community of survivors, fighters, and supporters. Find hope, strength, and comprehensive support for every step of your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => scrollToSection('support')} className={`px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition-transform ${darkMode ? 'bg-gradient-to-r from-pink-600 to-purple-600' : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'}`}>
                Join Support Group
              </button>
              <button onClick={() => scrollToSection('about')} className={`px-8 py-4 rounded-full font-bold text-lg border-2 hover:scale-105 transition-transform ${darkMode ? 'border-purple-500 text-purple-400 hover:bg-purple-900/30' : 'border-purple-600 text-purple-700 hover:bg-purple-50'}`}>
                Learn More
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className={`w-6 h-10 rounded-full border-2 flex justify-center p-2 ${darkMode ? 'border-purple-400' : 'border-purple-600'}`}>
            <div className={`w-1 h-3 rounded-full animate-pulse ${darkMode ? 'bg-purple-400' : 'bg-purple-600'}`}></div>
          </div>
        </div>
      </section>

      {/* Quotes Section */}
      <section className={`py-16 ${darkMode ? 'bg-gradient-to-r from-gray-900/80 to-purple-900/80' : 'bg-gradient-to-r from-white/80 to-purple-50/80'}`} style={{ transform: `translateY(${scrollY * 0.08}px)` }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className={`p-8 rounded-3xl shadow-2xl ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-700' : 'bg-gradient-to-br from-white to-purple-50 border border-purple-200'}`}>
              <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                  <span className="text-4xl">💬</span>
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-2xl font-bold mb-4">Words of Hope & Inspiration</h3>
                  <div className="h-24 overflow-hidden">
                    <div className="transition-transform duration-1000" style={{ transform: `translateY(-${currentQuote * 96}px)` }}>
                      {quotes.map((quote, index) => (
                        <div key={index} className="h-24 flex items-center">
                          <p className={`text-lg italic ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>"{quote}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center mt-6 space-x-2">
                    {quotes.map((_, index) => (
                      <button key={index} onClick={() => setCurrentQuote(index)} className={`h-2 rounded-full transition-all ${currentQuote === index ? (darkMode ? 'bg-purple-500 w-8' : 'bg-purple-600 w-8') : (darkMode ? 'bg-gray-700 w-2' : 'bg-gray-300 w-2')}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20" style={{ transform: `translateY(${scrollY * 0.05}px)` }}>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">Making a Global Difference</h2>
          <p className={`text-center text-xl mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Our impact in numbers</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className={`p-6 rounded-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-white shadow-xl hover:shadow-2xl'}`}>
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">{stat.number}</div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className={`py-20 ${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-gray-900/30' : 'bg-gradient-to-r from-purple-50 to-pink-50'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">About HopeBridge</h2>
                <p className={`text-xl leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Founded in 2015, HopeBridge has been at the forefront of cancer support and awareness. We believe that no one should face cancer alone.
                </p>
                <p className={`text-lg leading-relaxed mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Our mission is to provide comprehensive support, resources, and hope to cancer patients, survivors, and their families worldwide.
                </p>
                <div className="space-y-4">
                  {['10+ Years of Excellence', 'Global Network of Experts', 'Evidence-Based Support'].map((item, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${darkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                        <span className="text-xl">✓</span>
                      </div>
                      <span className="text-lg font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50' : 'bg-gradient-to-br from-purple-100 to-pink-100'}`}>
                <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80" alt="Support" className="rounded-2xl shadow-2xl w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className={`py-20 ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">Our Services</h2>
          <p className={`text-center text-xl mb-12 max-w-3xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Holistic support for every aspect of your journey
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className={`p-8 rounded-3xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-white shadow-xl hover:shadow-2xl'}`}>
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className={`leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support/Testimonials */}
      <section id="support" className={`py-20 ${darkMode ? 'bg-gradient-to-r from-gray-900/80 to-purple-900/50' : 'bg-gradient-to-r from-purple-50 to-pink-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">Voices of Hope</h2>
          <p className={`text-center text-xl mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Real stories from our community</p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`p-8 rounded-3xl hover:scale-105 transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-700' : 'bg-white shadow-xl hover:shadow-2xl'}`}>
                <div className="text-5xl mb-4">👤</div>
                <p className={`text-lg italic mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>"{testimonial.text}"</p>
                <h4 className="font-bold text-lg">{testimonial.name}</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className={`py-20 ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">Resources & Tools</h2>
          <p className={`text-center text-xl mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Everything you need for your journey</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className={`p-6 rounded-3xl hover:scale-105 transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-white shadow-xl hover:shadow-2xl'}`}>
                <div className="text-4xl mb-4">{resource.icon}</div>
                <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className={`py-20 ${darkMode ? 'bg-gradient-to-r from-purple-900/30 to-gray-900/30' : 'bg-gradient-to-r from-purple-50 to-pink-50'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className={`p-8 md:p-12 rounded-3xl shadow-2xl ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-700' : 'bg-white'}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">Get In Touch</h2>
              <p className={`mb-8 text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Reach out for support, information, or to share your story
              </p>
              
              {isSubmitted && (
                <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-100 border-2 border-green-300'} animate-fade-in`}>
                  <p className="text-green-700 dark:text-green-400 font-semibold flex items-center">
                    <span className="text-2xl mr-2">✅</span>
                    Thank you! We've received your message and will get back to you soon.
                  </p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50' : 'bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50'}`}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50' : 'bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50'}`}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50' : 'bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50'}`}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50' : 'bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50'}`}
                      placeholder="How can we help?"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block mb-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-700 border border-gray-600 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50' : 'bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50'}`}
                    placeholder="Tell us your story or how we can help you..."
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all duration-300 ${darkMode ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'}`}
                >
                  Send Message 💌
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-16 ${darkMode ? 'bg-gray-950 border-t border-gray-800' : 'bg-gray-900 text-gray-300'}`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-pink-600 to-purple-600">
                  <span className="text-2xl">🎗️</span>
                </div>
                <h3 className="text-xl font-bold text-white">HopeBridge</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Empowering cancer patients and their families with comprehensive support, resources, and hope since 2015.
              </p>
              <div className="flex space-x-3">
                {['F', 'T', 'I', 'L'].map((social) => (
                  <button key={social} className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 flex items-center justify-center transition-all hover:scale-110 font-bold">
                    {social}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['About Us', 'Our Services', 'Support Groups', 'Resources', 'Donate Now', 'Volunteer', 'Events', 'News'].map((item) => (
                  <li key={item}>
                    <button onClick={() => scrollToSection(item.toLowerCase().replace(' ', ''))} className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block">
                      → {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Contact Info</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start space-x-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="font-medium text-white">24/7 Helpline</p>
                    <p>1-800-HOPE-NOW</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-xl">✉️</span>
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p>support@hopebridge.org</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="font-medium text-white">Address</p>
                    <p>123 Hope Street<br/>Support City, SC 12345</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe for updates, stories, and resources</p>
              <div className="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
                <button className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold transition-all hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-500 text-center md:text-left">
                © {new Date().getFullYear()} HopeBridge Cancer Awareness & Support. All rights reserved.
              </p>
              <div className="flex space-x-6 text-gray-500">
                <button className="hover:text-white transition-colors">Privacy Policy</button>
                <button className="hover:text-white transition-colors">Terms of Service</button>
                <button className="hover:text-white transition-colors">Cookie Policy</button>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600 italic">
              💖 Together, we fight. Together, we heal. Together, we hope. 💖
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CancerAwarenessWebsite;