import React, { useRef, useState } from "react";
import emailjs from '@emailjs/browser';

const ContactUs = () => {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);

    // Yahan apni EmailJS ki details daalein
    const serviceID = 'service_ti93x3q'; 
    const templateID = 'template_r8brkgo';
    const publicKey = 'GzQznLGOjJQ2Kc-Ku';

    emailjs.sendForm(serviceID, templateID, form.current, publicKey)
      .then((result) => {
          console.log(result.text);
          setAlertInfo({ show: true, type: "success", message: "Message sent successfully! We will get back to you soon." });
          form.current.reset(); // Form clear kar dega
      }, (error) => {
          console.log(error.text);
          setAlertInfo({ show: true, type: "danger", message: "Failed to send message. Please try again later." });
      })
      .finally(() => {
          setIsSending(false);
          // 5 seconds baad alert gayab ho jayega
          setTimeout(() => setAlertInfo({ show: false, type: "", message: "" }), 5000);
      });
  };

  return (
    <section className="app-section bg-light min-vh-100 py-5" style={{ paddingTop: '100px' }}>
      <div className="container">
        
        <div className="text-center mb-5">
          <h1 className="font-display fw-bold text-dark display-5 mb-2">Get in Touch</h1>
          <p className="text-secondary font-body lead">We are here to help. Send us a message or contact us directly.</p>
        </div>

        <div className="row justify-content-center g-4">
          
          {/* Contact Information (Same as before) */}
          <div className="col-lg-4 col-md-5">
            <div className="card border-0 rounded-4 shadow-sm bg-white p-4 h-100">
              <h4 className="font-display fw-bold text-dark mb-4">Contact Info</h4>
              
              <div className="d-flex align-items-start mb-4">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px', color: 'var(--app-primary)' }}>
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Email Us</h6>
                  <p className="text-secondary small mb-0">support@skillsquare.com</p>
                </div>
              </div>

              <div className="d-flex align-items-start mb-4">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px', color: 'var(--app-primary)' }}>
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Call Us</h6>
                  <p className="text-secondary small mb-0">+92 (300) 123-4567</p>
                  <span className="badge bg-light text-secondary border mt-1">Mon - Fri, 9am - 6pm</span>
                </div>
              </div>

              <div className="d-flex align-items-start">
                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '45px', height: '45px', color: 'var(--app-primary)' }}>
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Headquarters</h6>
                  <p className="text-secondary small mb-0">SkillSquare Tech Hub,<br/>Islamabad, Pakistan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-6 col-md-7">
            <div className="card border-0 rounded-4 shadow-sm bg-white p-4 p-md-5 h-100">
              <h4 className="font-display fw-bold text-dark mb-4">Send a Message</h4>
              
              {/* Alert Message */}
              {alertInfo.show && (
                <div className={`alert alert-${alertInfo.type} py-2 small`} role="alert">
                  {alertInfo.message}
                </div>
              )}

              {/* Note: 'ref={form}' is important here */}
              <form ref={form} onSubmit={handleSubmit} className="font-body">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label fw-bold text-dark small mb-1">Your Name</label>
                    {/* Note: name attribute must match EmailJS template variable */}
                    <input type="text" name="user_name" className="form-control px-3 py-2 bg-light border-0 shadow-none" style={{ borderRadius: '0.75rem' }} required />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-bold text-dark small mb-1">Email Address</label>
                    <input type="email" name="user_email" className="form-control px-3 py-2 bg-light border-0 shadow-none" style={{ borderRadius: '0.75rem' }} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold text-dark small mb-1">Subject</label>
                    <input type="text" name="subject" className="form-control px-3 py-2 bg-light border-0 shadow-none" style={{ borderRadius: '0.75rem' }} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold text-dark small mb-1">Message</label>
                    <textarea name="message" className="form-control px-3 py-3 bg-light border-0 shadow-none" style={{ borderRadius: '0.75rem', minHeight: '120px' }} required></textarea>
                  </div>
                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-gradient-warm w-100 rounded-pill py-3 fw-bold shadow-warm" disabled={isSending}>
                      {isSending ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactUs;