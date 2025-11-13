import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import LoginSchema from './validations/LoginSchema';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid }, // ✅ Agregar isValid
  } = useForm({
    resolver: yupResolver(LoginSchema(t)),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const body = await res.json();

      console.log("Respuesta del login:", body);

      if (res.ok && body.token) {
        localStorage.setItem("token", body.token);
        localStorage.setItem("plan", body.plan);
        localStorage.setItem("usuario", body.username);
        setMensaje(t("form.success"));
        setTimeout(() => setMensaje(""), 3000);
        navigate("/home");
      } else {
        setMensaje(body.message || t("form.errorlogin"));
        setTimeout(() => setMensaje(""), 3000);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setMensaje(t("form.errorlogin"));
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <div className="login-container">
      <h2>{t("form.login")}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username" className="form-label">{t("form.username")}</label>
        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <input 
              {...field} 
              type="text" 
              id="username"
              placeholder={t("form.username")}
            />
          )}
        />
        {errors.username && <p className="error-message">{errors.username.message}</p>}

        <label htmlFor="password" className="form-label">{t("form.password")}</label>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <input 
              {...field} 
              type="password" 
              id="password"
              placeholder={t("form.password")}
            />
          )}
        />
        {errors.password && <p className="error-message">{errors.password.message}</p>}

        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={!isValid} // ✅ Deshabilitar si no es válido
        >
          {t("form.loginButton")}
        </button>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>

      <p>
        {t("form.noAccount")}{" "}
        <Link to="/signup">
          {t("form.registerHere")}
        </Link>
      </p>
    </div>
  );
};

export default Login;