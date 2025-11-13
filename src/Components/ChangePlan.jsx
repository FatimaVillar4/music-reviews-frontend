import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NumberOfReviews from "./NumberofReviews"; // Importar
import { useTranslation } from "react-i18next";
import "../styles/ChangePlan.css";

const ChangePlan = () => {
  const [t] = useTranslation();
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
   
    const username = localStorage.getItem("usuario");
    const plan = localStorage.getItem("plan");

    if (username && plan) {
      setUsuario({ username, plan });
    } else {
      setMensaje("No se pudo cargar la información del usuario");
    }
  }, []);

  const cambiarPlan = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/Plan`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ nuevoPlan: "premium" }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("Plan cambiado a premium exitosamente");
        setUsuario({ ...usuario, plan: "premium" });
        localStorage.setItem("plan", "premium");
        window.dispatchEvent(new Event("storage"));
        setTimeout(() => setMensaje(""), 3000)
      } else {
        setMensaje(data.message || "Error al cambiar el plan");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error en la solicitud");
    }
  };

  return (
    <div className="changePlan-container">
      <div className="plan-header">
        <h2>{t("form.useofreviews")}</h2>
      </div>

      {/* Aquí va el componente de uso */}
      <NumberOfReviews />

      {usuario && (
        <div className="plan-actions">
          <p className="plan-label">
           {t("form.actualplan")}: <strong>{usuario.plan.charAt(0).toUpperCase() + usuario.plan.slice(1)}</strong>
          </p>

          {usuario.plan === "plus" ? (
            <button className="btn-upgrade" onClick={cambiarPlan}>
              <i className="fas fa-crown"></i> {t("form.upgradepremium")}
            </button>
          ) : (
            <p className="plan-premium">{t("form.haveplanpremium")}</p>
          )}
        </div>
      )}

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
};

export default ChangePlan;