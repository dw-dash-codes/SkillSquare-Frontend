import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // Har dafa URL change hone par ye update hoga

  useEffect(() => {
    // Page ko smoothly top par scroll kar dega
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth" 
    });
  }, [pathname]); 

  return null; 
};

export default ScrollToTop;