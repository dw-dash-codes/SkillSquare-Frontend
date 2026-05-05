import React from "react";

const PrivacyPolicy = () => {
  return (
    <section className="app-section bg-light min-vh-100 py-5 mt-5" style={{ paddingTop: '100px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            
            <div className="card border-0 rounded-4 shadow-sm bg-white p-4 p-md-5">
              <h1 className="font-display fw-bold text-dark mb-4">Privacy Policy</h1>
              <p className="text-secondary font-body mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

              <div className="font-body text-secondary" style={{ lineHeight: '1.8' }}>
                <p>Welcome to SkillSquare. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at support@skillsquare.com.</p>

                <h4 className="fw-bold text-dark mt-4 mb-2">1. Information We Collect</h4>
                <p>We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products and Services, or otherwise when you contact us.</p>
                <ul>
                  <li><strong>Personal Info:</strong> Names, phone numbers, email addresses, mailing addresses, and passwords.</li>
                  <li><strong>Service Data:</strong> Service categories, skills, and professional bios (for Providers).</li>
                </ul>

                <h4 className="fw-bold text-dark mt-4 mb-2">2. How We Use Your Information</h4>
                <p>We use personal information collected via our platform for a variety of business purposes described below:</p>
                <ul>
                  <li>To facilitate account creation and logon process.</li>
                  <li>To manage user bookings and connect Customers with Providers.</li>
                  <li>To request feedback and contact you about your use of our platform.</li>
                  <li>To protect our Services (e.g., fraud monitoring and prevention).</li>
                </ul>

                <h4 className="fw-bold text-dark mt-4 mb-2">3. Will Your Information Be Shared?</h4>
                <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. When a booking is confirmed, necessary contact and location details are shared between the Customer and the Provider to facilitate the service.</p>

                <h4 className="fw-bold text-dark mt-4 mb-2">4. How We Keep Your Information Safe</h4>
                <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet can be guaranteed to be 100% secure.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;