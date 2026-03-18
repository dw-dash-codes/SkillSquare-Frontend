import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate add kia
import api from "../services/api";

const TechnitianByCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate(); // Hook for button click
  const [technicians, setTechnicians] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        // 1. Providers fetch karo
        const response = await api.get(`/Provider/by-category/${categoryId}`);
        const providers = response.data;

        // 2. Rating fetch karo (Ta k Card me Stars 0 na dikhayen)
        const providersWithRatings = await Promise.all(
          providers.map(async (p) => {
            try {
              // Note: Backend se id 'id' ya 'providerId' k naam se aa sakti hai check kar lena
              const idToUse = p.id || p.providerId;
              const ratingRes = await api.get(`/Review/average/${idToUse}`);
              return {
                ...p,
                rating: ratingRes.data.averageRating,
              };
            } catch (error) {
              return { ...p, rating: 0 };
            }
          })
        );

        setTechnicians(providersWithRatings);

        // Category Name Logic (Same as your code)
        if (providers.length > 0) {
          setCategoryName(providers[0].categoryName || "Technicians Near You");
        } else {
          setCategoryName("Technicians Near You");
        }
      } catch (error) {
        console.error("Error fetching technicians:", error.message);
      }
    };

    fetchTechnicians();
  }, [categoryId]);

  return (
    <section className="tbc-page-content mt-5">
      <div className="container">
        <h1 className="tbc-page-title">
          <i className="fas fa-bolt me-3"></i>
          {categoryName ? `${categoryName}` : "Technicians Near You"}
        </h1>

        <div className="row tbc-page-technitian-grid mt-4">
          {technicians.length > 0 ? (
            technicians.map((tech) => (
              <div
                key={tech.id || tech.providerId}
                className="col-xl-3 col-lg-4 col-md-6 mb-4"
              >
                {/* 👇 YAHAN CARD CHANGE KIA HAI (Home Page Style) */}
                <div className="technician-card text-center">
                  <div className="technician-avatar">
                    <i className="fas fa-user"></i>
                  </div>

                  <h3 className="technician-name">
                    {tech.firstName + " " + tech.lastName}
                  </h3>

                  <h5>{tech.categoryName}</h5>

                  <p className="technician-rate">
                    {tech.hourlyRate ? `$${tech.hourlyRate}/hr` : "N/A"}
                  </p>

                  {/* Dynamic Stars */}
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={
                          i < (tech.rating || 0)
                            ? "fas fa-star text-warning"
                            : "far fa-star text-muted"
                        }
                      ></i>
                    ))}
                  </div>

                  <button
                    className="btn btn-primary mt-2"
                    onClick={() =>
                      navigate(`/providerProfile/${tech.id || tech.providerId}`)
                    }
                  >
                    View Profile
                  </button>
                </div>
                {/* 👆 CARD END */}
              </div>
            ))
          ) : (
            <p className="text-center text-muted">
              No technicians found for this category.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default TechnitianByCategory;
