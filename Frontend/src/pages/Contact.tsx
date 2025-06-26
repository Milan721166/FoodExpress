import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animate-float-slow"></div>
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animate-float-medium animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animate-float-fast animation-delay-4000"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iIzAwMCIgY3g9IjIwIiBjeT0iMjAiIHI9IjEiLz48L2c+PC9zdmc+')]"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Enhanced animated title */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-transparent animate-gradient-x">Contact Us</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animation-delay-100">
            Have questions or want to work together? We'd love to hear from you!
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Team Info Section */}
          <div className="lg:w-5/12 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-80 border border-gray-100 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
              <h2 className="text-2xl font-bold mb-6 relative pl-4">
                <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full animate-pulse"></span>
                Our Team
              </h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-200 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:border-blue-300 transition-all duration-300">
                      <img 
                        src="https://milanprotfiolio.vercel.app/images/image.png" 
                        alt="Milan Sahoo"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = "https://milanprotfiolio.vercel.app/images/image.png"
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Milan Sahoo</h3>
                    <p className="text-gray-600 text-sm mb-2 group-hover:text-gray-700 transition-colors duration-300">Diploma in Computer Science & Engineering</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-300 group-hover:translate-x-1 transform transition-transform">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                        </svg>
                        <span>Brainware University</span>
                      </div>
                      <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-300 group-hover:translate-x-1 transform transition-transform">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                        <span>milansahoo7211662005@gmail.com</span>
                      </div>
                      <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-300 group-hover:translate-x-1 transform transition-transform">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                        </svg>
                        <span>+91 6296740204</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl mb-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-200 rounded-full blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:border-purple-300 transition-all duration-300">
                      <img 
                        src="https://media.licdn.com/dms/image/v2/D4D03AQFazpBw2SIxow/profile-displayphoto-shrink_400_400/B4DZZRxKc1GkAg-/0/1745128570373?e=1755734400&v=beta&t=_DBm7i6W-EvwvAdbSBE5vy6QBYtDGl0J9iWB1Kx9ftI" 
                        alt="Malay Maity"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = "https://via.placeholder.com/150?text=Malay+Maity"
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 transition-colors duration-300">Malay Maity</h3>
                    <p className="text-gray-600 text-sm mb-2 group-hover:text-gray-700 transition-colors duration-300">Diploma in Computer Science & Engineering</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-gray-700 hover:text-purple-600 transition-colors duration-300 group-hover:translate-x-1 transform transition-transform">
                        <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                        </svg>
                        <span>Brainware University</span>
                      </div>
                      <div className="flex items-center text-gray-700 hover:text-purple-600 transition-colors duration-300 group-hover:translate-x-1 transform transition-transform">
                        <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                        <span>maitymalay27747@gmail.com</span>
                      </div>
                      <div className="flex items-center text-gray-700 hover:text-purple-600 transition-colors duration-300 group-hover:translate-x-1 transform transition-transform">
                        <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                        </svg>
                        <span>+91 99329 63141</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-xl border border-blue-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] group">
                <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                  <svg className="w-5 h-5 inline-block mr-2 text-blue-600 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                  </svg>
                  General Inquiries
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-300 group-hover:translate-x-1 transform transition-transform">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    <span>support@foodieexpress.com</span>
                  </div>
                  <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-300 group-hover:translate-x-1 transform transition-transform">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                    <span>+91 18**********</span>
                  </div>
                  <div className="flex items-start text-gray-700 hover:text-blue-600 transition-colors duration-300 group-hover:translate-x-1 transform transition-transform">
                    <svg className="w-4 h-4 mr-2 text-blue-500 mt-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    <span>Brainware University, Barasat, Kolkata, West Bengal, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form Section */}
          <div className="lg:w-7/12">
            <div className="bg-white p-8 rounded-2xl shadow-xl backdrop-blur-sm bg-opacity-80 border border-gray-100 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
              <h2 className="text-2xl font-bold mb-6 relative pl-4">
                <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full animate-pulse"></span>
                Send Us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer group-hover:shadow-sm group-hover:border-blue-300"
                      placeholder=" "
                    />
                    <label className="absolute left-4 top-3 text-gray-500 transition-all pointer-events-none peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-focus:rounded peer-placeholder-shown:-top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:bg-white peer-placeholder-shown:px-1 peer-placeholder-shown:rounded">
                      Your Name
                    </label>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                  
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer group-hover:shadow-sm group-hover:border-blue-300"
                      placeholder=" "
                    />
                    <label className="absolute left-4 top-3 text-gray-500 transition-all pointer-events-none peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-focus:rounded peer-placeholder-shown:-top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:bg-white peer-placeholder-shown:px-1 peer-placeholder-shown:rounded">
                      Email Address
                    </label>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                  
                  <div className="relative group">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer group-hover:shadow-sm group-hover:border-blue-300"
                      placeholder=" "
                    />
                    <label className="absolute left-4 top-3 text-gray-500 transition-all pointer-events-none peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-focus:rounded peer-placeholder-shown:-top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:bg-white peer-placeholder-shown:px-1 peer-placeholder-shown:rounded">
                      Phone Number
                    </label>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                  
                  <div className="relative group">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer group-hover:shadow-sm group-hover:border-blue-300"
                      placeholder=" "
                    />
                    <label className="absolute left-4 top-3 text-gray-500 transition-all pointer-events-none peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-focus:rounded peer-placeholder-shown:-top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:bg-white peer-placeholder-shown:px-1 peer-placeholder-shown:rounded">
                      Subject
                    </label>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                </div>
                
                <div className="relative group">
                  <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all peer group-hover:shadow-sm group-hover:border-blue-300"
                    placeholder=" "
                  />
                  <label className="absolute left-4 top-3 text-gray-500 transition-all pointer-events-none peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-1 peer-focus:rounded peer-placeholder-shown:-top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:bg-white peer-placeholder-shown:px-1 peer-placeholder-shown:rounded">
                    Your Message
                  </label>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
                
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Add these styles to your globals.css or equivalent */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(-15px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 8s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 6s ease-in-out infinite; }
        .animate-gradient-x { background-size: 200% auto; animation: gradient-x 3s ease infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

export default Contact;