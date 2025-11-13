import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "../styles/NumberofReviews.css";

const NumberOfReviews = () => {
    const { t } = useTranslation();
  const reviews = useSelector((state) => state.reviews.listaReseñas);
  const usuarioPlan = localStorage.getItem("plan");

  const totalReviews = reviews ? reviews.length : 0;
  const maxReviews = 10; 
  const porcentaje = Math.min((totalReviews / maxReviews) * 100, 100);

  return (
    <div className="NumberOfReviews-container">
      {usuarioPlan === "plus" ? (
        <>
          <div className="review-header">
            {t("form.useoftheplan")}: {porcentaje.toFixed(0)}%
          </div>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <div className="review-count">
            {totalReviews} {(t("form.of"))} {maxReviews} {(t("form.reviewsUsed"))}
          </div>
        </>
      ) : (
        <div className="premium-text">{(t("form.totalreviews"))}: {totalReviews}</div>
      )}
    </div>
  );
};

export default NumberOfReviews;
