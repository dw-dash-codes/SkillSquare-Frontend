import React from "react";

const TermsOfService = () => {
  return (
    <section className="app-section bg-light min-vh-100 py-5 mt-5" style={{ paddingTop: '100px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            
            <div className="card border-0 rounded-4 shadow-sm bg-white p-4 p-md-5">
              <h1 className="font-display fw-bold text-dark mb-4">Terms of Service</h1>
              <p className="text-secondary font-body mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

              <div className="font-body text-secondary" style={{ lineHeight: '1.8' }}>
                <p>These Terms of Service ("Terms") govern your access to and use of the SkillSquare website and services. By accessing or using the platform, you agree to be bound by these Terms.</p>

                <h4 className="fw-bold text-dark mt-4 mb-2">1. Our Role as a Marketplace</h4>
                <p>SkillSquare acts solely as an online marketplace connecting individuals seeking services ("Customers") with individuals providing services ("Providers"). <strong>SkillSquare does not directly provide these services.</strong> We are not responsible for the performance, quality, or outcome of the services provided by the Providers.</p>

                <h4 className="fw-bold text-dark mt-4 mb-2">2. User Accounts</h4>
                <p>To use certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate. You are responsible for safeguarding your password.</p>

                <h4 className="fw-bold text-dark mt-4 mb-2">3. Provider Obligations</h4>
                <p>If you are a Provider, you agree that:</p>
                <ul>
                  <li>You have the necessary skills, licenses, and qualifications to perform the services you offer.</li>
                  <li>You will honor your accepted bookings and provide services professionally.</li>
                  <li>You will not attempt to bypass the platform by requesting direct payments outside of SkillSquare's authorized methods.</li>
                </ul>

                <h4 className="fw-bold text-dark mt-4 mb-2">4. Booking and Cancellations</h4>
                <p>Users can book services through the platform. Both parties are expected to honor the agreed-upon time. Continuous unexcused cancellations by either Customers or Providers may result in temporary suspension or permanent termination of the account.</p>

                <h4 className="fw-bold text-dark mt-4 mb-2">5. Account Termination</h4>
                <p>We reserve the right to suspend or terminate your account at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users of the platform, us, or third parties, or for any other reason.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;