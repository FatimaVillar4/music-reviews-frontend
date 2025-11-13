import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import CreateReview from "./CreateReview";
import ReviewList from "./ReviewList";
import ChangePlan from "./ChangePlan";
import GenreChart from "./GenreChart";
//import StorageUsage from "./StorageUsage";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <Header />
      
      <div className="home-content">
        <div className="left-section">
          <CreateReview />
        </div>

        <div className="right-section">
          <ReviewList />
        </div>

        <div className="bottom-section">
          <ChangePlan />
          <GenreChart height={220} />
        </div>
      </div>
    </div>
  );
};

export default Home;