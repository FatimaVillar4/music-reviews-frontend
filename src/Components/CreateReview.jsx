import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateReview.css";
import { useDispatch, useSelector } from "react-redux";
import { agregarReseña } from "../store/slices/reviewSlice";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import SongReviewSchema from "./validations/songReviewSchema";
console.log("Schema cargado:", SongReviewSchema);

import { ImageUploader } from "./ImageUploader";

const CreateReview = () => {
  const { t, i18n } = useTranslation();
  const [mensaje, setMensaje] = useState("");
  const [genres, setGenres] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [resetImage, setResetImage] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SongReviewSchema(t)),
    mode: "onChange",
    defaultValues: {
      title: "",
      artist: "",
      genre: "",
      review: "",
      rating: "",
      image: "",
    },
  });

  // Cargar géneros 
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/genres`, {
          headers: { Authorization: `${token}` },
        });

        if (!response.ok) throw new Error("Error al cargar géneros");
        const data = await response.json();
        setGenres(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setMensaje(t("form.errorGenres"));
      }
    };

    fetchGenres();
  }, [t]);

  // Enviar reseña
  const onSubmit = async (data) => {

    try {
      const token = localStorage.getItem("token");
      const body = { ...data, image: imageUrl };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/songs/crearReview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(body),
      });

      const respuesta = await res.json();
      console.log("Respuesta del servidor:", respuesta);

      if (res.status === 201) {
        const nuevaReseña = {
          _id: respuesta._id,
          title: respuesta.title,
          artist: respuesta.artist,
          review: respuesta.review,
          rating: respuesta.rating,
          genre: respuesta.genre,
          image: respuesta.image,
          createdAt: respuesta.createdAt,
        };

        dispatch(agregarReseña(nuevaReseña));
        setMensaje(t("form.success"));
        setTimeout(() => setMensaje(""), 3000);

        reset();
        setImageUrl("");
        setResetImage(true);

        setTimeout(() => {
          setResetImage(false);
          navigate("/home");
        }, 2000);
      } else {
        setMensaje(respuesta.message || t("form.error"));
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje(t("form.error"));
    }
  };

  return (
    <div className="CreateReview-container">


      <h2 className="text-center">{t("form.titleReview")}</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>{t("form.title")}</label>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <input {...field} type="text" className="form-control" placeholder={t("form.title")} />
            )}
          />
          {errors.title && <p className="error">{errors.title.message}</p>}
        </div>

        <div >
          <label>{t("form.artist")}</label>
          <Controller
            control={control}
            name="artist"
            render={({ field }) => (
              <input {...field} type="text" className="form-control" placeholder={t("form.artist")} />
            )}
          />
          {errors.artist && <p className="error">{errors.artist.message}</p>}
        </div>


        <div>
          <label>{t("form.genre")}</label>
          <Controller
            control={control}
            name="genre"
            render={({ field }) => (
              <select {...field} className="form-control" >
                <option value="">{t("form.genre")}</option>
                {genres.map((g) => (
                  <option key={g._id || g.id} value={g._id || g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.genre && <p className="error">{errors.genre.message}</p>}
        </div>

        <div>
          <label>{t("form.review")}</label>
          <Controller
            control={control}
            name="review"
            render={({ field }) => (
              <textarea {...field} className="form-control" placeholder={t("form.review")} />
            )}
          />
          {errors.review && <p className="error">{errors.review.message}</p>}
        </div>

        <div>
          <label>{t("form.rating")}</label>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <select {...field} className="form-control rating-input">
                <option value="">{t("form.selectRating")}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            )}
          />
          {errors.rating && <p className="error">{errors.rating.message}</p>}
        </div>

        <div>
          <label>{t("form.image")}</label>
          <ImageUploader onUpload={(url) => setImageUrl(url)} reset={resetImage} />
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-3">
          {t("form.submit")}
        </button>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>
    </div>
  );
};

export default CreateReview;
