import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SignUpSchema from "./validations/SingupSchema";
import { useTranslation } from "react-i18next";
import '../styles/signup.css';

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(SignUpSchema(t)),
    mode: "onChange",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...datos } = data;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/singup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const body = await res.json();

      if (res.ok && body.token) {
        localStorage.setItem("token", body.token);
        localStorage.setItem("plan", body.plan);
        localStorage.setItem("usuario", body.username);
        setMensaje(t("form.success"));
        setTimeout(() => setMensaje(""), 3000);
        navigate("/home");
      } else {
        setMensaje(body.message || t("form.errorsignup"));
        setTimeout(() => setMensaje(""), 3000);
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setMensaje(t("form.errorsignup"));
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <div className="signup-container">
      <h2>{t("form.signup")}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">{t("form.name")}</label>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <input 
              {...field} 
              type="text" 
              id="name"
              placeholder={t("form.name")}
            />
          )}
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}

        <label htmlFor="username">{t("form.username")}</label>
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

        <label htmlFor="email">{t("form.email")}</label>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <input 
              {...field} 
              type="email" 
              id="email"
              placeholder={t("form.email")}
            />
          )}
        />
        {errors.email && <p className="error-message">{errors.email.message}</p>}

        <label htmlFor="password">{t("form.password")}</label>
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

        <label htmlFor="confirmPassword">{t("form.confirmPassword")}</label>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <input 
              {...field} 
              type="password" 
              id="confirmPassword"
              placeholder={t("form.confirmPassword")}
            />
          )}
        />
        {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}

        <button type="submit" disabled={!isValid}>
          {t("form.signupButton")}
        </button>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>

      <p>
        ¿Ya tienes cuenta?{" "}
        <Link to="/login">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
};

export default SignUp;