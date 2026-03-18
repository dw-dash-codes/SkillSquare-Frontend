import { Link } from "react-router-dom";

const GetStarted = () => {
  return (
    <main className="selection-container mt-5">
      <div className="selection-card">
        <h1 className="selection-title">
          How would you like to use Neighborhood Services?
        </h1>

        <div className="row">
          <div className="col-md-6 mb-3">
            <Link
              to="/userRegister"
              state={{ role: "Customer" }}
              className="option-card"
            >
              <i className="fas fa-user option-icon"></i>
              <span className="option-text">
                I want to hire
                <br />a service provider
              </span>
            </Link>
          </div>

          <div className="col-md-6 mb-3">
            <Link
              to="/providerRegister"
              state={{ role: "Provider" }}
              className="option-card"
            >
              <i className="fas fa-wrench option-icon"></i>
              <span className="option-text">
                I want to offer
                <br />
                my services
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GetStarted;
