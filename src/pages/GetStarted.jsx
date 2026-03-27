import { Link } from "react-router-dom";

const GetStarted = () => {
  return (
    <section className="app-section app-section-hero min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">
            <div className="card app-card border-0 selection-card-wrap">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-5">
                  <span className="badge rounded-pill text-bg-light border px-3 py-2 mb-3">
                    Get Started
                  </span>

                  <h1 className="app-section-title mb-3">
                    How would you like to use Neighborhood Services?
                  </h1>

                  <p className="text-secondary mb-0">
                    Choose how you want to continue and we will take you to the
                    right registration flow.
                  </p>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <Link
                      to="/userRegister"
                      state={{ role: "Customer" }}
                      className="selection-option-card text-decoration-none h-100"
                    >
                      <div className="selection-option-icon">
                        <i className="fas fa-user"></i>
                      </div>

                      <h5 className="fw-semibold mb-2">Hire a Professional</h5>

                      <p className="text-secondary mb-0">
                        I want to hire a trusted technician or service provider
                        near me.
                      </p>
                    </Link>
                  </div>

                  <div className="col-md-6">
                    <Link
                      to="/providerRegister"
                      state={{ role: "Provider" }}
                      className="selection-option-card text-decoration-none h-100"
                    >
                      <div className="selection-option-icon">
                        <i className="fas fa-wrench"></i>
                      </div>

                      <h5 className="fw-semibold mb-2">Offer My Services</h5>

                      <p className="text-secondary mb-0">
                        I want to join the platform and start offering my
                        services to customers.
                      </p>
                    </Link>
                  </div>
                </div>

                <div className="text-center mt-4 pt-2">
                  <p className="text-secondary mb-0 small">
                    You can always switch later depending on your account type.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;