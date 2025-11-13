import { useDispatch, useSelector } from "react-redux";
import { cargarReseñas, eliminarReseña, editarReseña } from "../store/slices/reviewSlice";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import '../styles/reviewList.css';

const ReviewList = () => {
  const dispatch = useDispatch();
  const { listaReseñas } = useSelector((state) => state.reviews);

  const [editando, setEditando] = useState(null);
  const [nuevaReview, setNuevaReview] = useState("");
  const [nuevaRating, setNuevaRating] = useState("");
  const [filtro, setFiltro] = useState("todo");
  const { t } = useTranslation();

  useEffect(() => {
    const obtenerReseñas = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/songs/allReviews`, {
        headers: { Authorization: `${token}` },
      });
      const data = await res.json();
      console.log("Reseñas:", data);
      dispatch(cargarReseñas(data));
    };

    obtenerReseñas();
  }, [dispatch]);

  const DeleteReview = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/songs/EliminarReview/${id}`, {
      method: "DELETE",
      headers: { Authorization: `${token}` },
    });

    if (res.ok) {
      toast.success(t("form.deleteSuccess"));
      dispatch(eliminarReseña(id));
    } else {
      toast.error(t("form.deleteError"));
    }
  };

  const EditReview = async (id, nuevaReviewValue, nuevaRatingValue) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/songs/editarReview/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ review: nuevaReviewValue, rating: nuevaRatingValue }),
    });

    if (res.ok) {
      const reviewActualizada = await res.json();
      dispatch(editarReseña(reviewActualizada.review));
      setEditando(null);
      toast.success(t("form.editSuccess"));
    } else {
      toast.error(t("form.editError"));
    }
  };

  // FILTRO DE FECHA 
  const filtrarPorFecha = (reviews) => {
    if (filtro === "todo") return reviews;

    const hoy = new Date();
    let fechaLimite;

    if (filtro === "semana") {
      fechaLimite = new Date(hoy);
      fechaLimite.setDate(hoy.getDate() - 7);
    } else if (filtro === "mes") {
      fechaLimite = new Date(hoy);
      fechaLimite.setMonth(hoy.getMonth() - 1);
    }

    return reviews.filter((r) => new Date(r.createdAt) >= fechaLimite);
  };

  const reseñasFiltradas = filtrarPorFecha(listaReseñas);

  return (
    <div className="review-dashboard">
      <div className="header">
        <h3>{t("form.miReview")}</h3>

        <div className="filters">
          <button
            className={`filter-btn ${filtro === "semana" ? "active" : ""}`}
            onClick={() => setFiltro("semana")}
          >
            {t("form.lastweek")}
          </button>
          <button
            className={`filter-btn ${filtro === "mes" ? "active" : ""}`}
            onClick={() => setFiltro("mes")}
          >
            {t("form.lastmonth")}
          </button>
          <button
            className={`filter-btn ${filtro === "todo" ? "active" : ""}`}
            onClick={() => setFiltro("todo")}
          >
            {t("form.all")}
          </button>
        </div>
      </div>

      <ul className="review-list">
        {reseñasFiltradas.length === 0 ? (
          <p className="no-reviews">{t("form.noReviews")}</p>
        ) : (
          reseñasFiltradas.map((r) => (
            <li key={r._id} className="review-card">
              <div className="card-top">
                <div className="card-title-area">
                  <strong className="title">{r.title}</strong>
                  <div className="meta">
                    {r.artist}
                    {r.genre?.name && ` • ${r.genre.name}`}
                  </div>
                </div>

                <div className="rating">{(r.rating || 0) + "/5"}</div>
                {r.image && (
                  <img
                    src={r.image}
                    alt="Imagen de la reseña"
                    className="preview-img"
                  />
                )}
              </div>

              {editando === r._id ? (
                <>
                  <label
                    style={{
                      fontSize: 12,
                      color: "#9aa6ad",
                      marginTop: 8,
                    }}
                  >{t("form.review")}
                  </label>
                  <textarea
                    value={nuevaReview}
                    onChange={(e) => setNuevaReview(e.target.value)}
                    placeholder="Nueva reseña"
                    rows={3}
                    className="edit-review-textarea"
                  />
                  <label
                    style={{
                      fontSize: 12,
                      color: "#9aa6ad",
                      marginTop: 8,
                    }}
                  >{t("form.calification")}
                  </label>
                  <select
                    value={nuevaRating}
                    onChange={(e) => setNuevaRating(e.target.value)}
                    className="edit-review-select"
                  >
                    <option value="">{t("form.select")}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>

                  <div className="review-buttons">
                    <button
                      className="btn-save"
                      onClick={() =>
                        EditReview(r._id, nuevaReview, nuevaRating)
                      }
                    >
                      {t("form.save")}
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => setEditando(null)}
                    >
                      {t("form.cancel")}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="desc">{r.review}</p>

                  <div className="review-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setEditando(r._id);
                        setNuevaReview(r.review || "");
                        setNuevaRating(String(r.rating || ""));
                      }}
                    >
                      {t("form.edit")}
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => DeleteReview(r._id)}
                    >
                      {t("form.delete")}
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ReviewList;