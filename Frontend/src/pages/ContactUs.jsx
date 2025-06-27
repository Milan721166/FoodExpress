import React, { useState, useEffect } from "react";
import styles from "../css/ContactUs.module.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Check for user's preferred color scheme
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(isDark);
    }
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      alert("Thank you for your message! We will get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className={`${styles.contactContainer} ${darkMode ? "dark" : ""}`}>
      {/* Navigation Bar */}
      
      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <div className={`${styles.blob} ${styles.blob1}`}></div>
        <div className={`${styles.blob} ${styles.blob2}`}></div>
        <div className={`${styles.blob} ${styles.blob3}`}></div>
        <div className={styles.gridPattern}></div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Animated title section */}
        <div className={styles.titleSection}>
          <h1>
            <span >Contact Us</span>
          </h1>
          <p className={styles.subtitle}>
            Have questions or want to work together? We'd love to hear from you!
          </p>
        </div>

        <div className={styles.contactContent}>
          {/* Team Info Section */}
          <div className={styles.teamSection}>
            <div className={styles.teamCard}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.titleDecoration}></span>
                Our Team
              </h2>

              {/* Team Member 1 */}
              <div className={`${styles.memberCard} ${styles.member1}`}>
                <div className={styles.memberContent}>
                  <div className={styles.memberAvatar}>
                    <div className={styles.avatarGlow}></div>
                    <img
                      src="https://milanprotfiolio.vercel.app/images/image.png"
                      alt="Milan Sahoo"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://via.placeholder.com/150?text=Milan+Sahoo";
                      }}
                    />
                  </div>
                  <div className={styles.memberDetails}>
                    <h3>Milan Sahoo</h3>
                    <p className={styles.role}>Frontend Developer</p>
                    <div className={styles.contactInfo}>
                      <div className={styles.infoItem}>
                        <svg className={styles.icon} viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                        </svg>
                        <span>Brainware University</span>
                      </div>
                      <div className={styles.infoItem}>
                        <svg className={styles.icon} viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                        <span>milansahoo7211662005@gmail.com</span>
                      </div>
                      <div className={styles.infoItem}>
                        <svg className={styles.icon} viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                        </svg>
                        <span>+91 6296740204</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className={`${styles.memberCard} ${styles.member2}`}>
                <div className={styles.memberContent}>
                  <div className={styles.memberAvatar}>
                    <div className={styles.avatarGlow}></div>
                    <img
                      src="https://media.licdn.com/dms/image/v2/D4D03AQFazpBw2SIxow/profile-displayphoto-shrink_400_400/B4DZZRxKc1GkAg-/0/1745128570373?e=1755734400&v=beta&t=_DBm7i6W-EvwvAdbSBE5vy6QBYtDGl0J9iWB1Kx9ftI"
                      alt="Malay Maity"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://via.placeholder.com/150?text=Malay+Maity";
                      }}
                    />
                  </div>
                  <div className={styles.memberDetails}>
                    <h3>Malay Maity</h3>
                    <p className={styles.role}>Backend Developer</p>
                    <div className={styles.contactInfo}>
                      <div className={styles.infoItem}>
                        <svg className={styles.icon} viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                        </svg>
                        <span>Brainware University</span>
                      </div>
                      <div className={styles.infoItem}>
                        <svg className={styles.icon} viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                        <span>maitymalay27747@gmail.com</span>
                      </div>
                      <div className={styles.infoItem}>
                        <svg className={styles.icon} viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                        </svg>
                        <span>+91 99329 63141</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* General Inquiries */}
              <div className={styles.inquiriesCard}>
                <h3>
                  <svg className={styles.icon} viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  General Inquiries
                </h3>
                <div className={styles.contactInfo}>
                  <div className={styles.infoItem}>
                    <svg className={styles.icon} viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    <span>support@foodieexpress.com</span>
                  </div>
                  <div className={styles.infoItem}>
                    <svg className={styles.icon} viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                    <span>+91 18**********</span>
                  </div>
                  <div className={styles.infoItem}>
                    <svg className={styles.icon} viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>
                      Brainware University, Barasat, Kolkata, West Bengal, India
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className={styles.formSection}>
            <div className={styles.formCard}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.titleDecoration}></span>
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <div className={styles.formGrid}>
                  {/* Name Field */}
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={styles.formInput}
                      placeholder=" "
                    />
                    <label className={styles.formLabel}>Your Name</label>
                    <div className={styles.inputHighlight}></div>
                  </div>

                  {/* Email Field */}
                  <div className={styles.formGroup}>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={styles.formInput}
                      placeholder=" "
                    />
                    <label className={styles.formLabel}>Email Address</label>
                    <div className={styles.inputHighlight}></div>
                  </div>

                  {/* Phone Field */}
                  <div className={styles.formGroup}>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={styles.formInput}
                      placeholder=" "
                    />
                    <label className={styles.formLabel}>Phone Number</label>
                    <div className={styles.inputHighlight}></div>
                  </div>

                  {/* Subject Field */}
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={styles.formInput}
                      placeholder=" "
                    />
                    <label className={styles.formLabel}>Subject</label>
                    <div className={styles.inputHighlight}></div>
                  </div>
                </div>

                {/* Message Field */}
                <div className={`${styles.formGroup} ${styles.messageGroup}`}>
                  <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                    placeholder=" "
                  />
                  <label className={styles.formLabel}>Your Message</label>
                  <div className={styles.inputHighlight}></div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`${styles.submitBtn} ${
                    isSubmitting ? styles.submitting : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className={styles.spinner}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg
                        className={styles.sendIcon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
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
    </div>
  );
};

export default ContactUs;
