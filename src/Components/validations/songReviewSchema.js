import * as yup from "yup";

export const SongReviewSchema = (t) =>
  yup.object().shape({
    title: yup
      .string()
      .required(t("validation.required"))
      .min(3, t("validation.min", { count: 3 }))
      .max(100, t("validation.max", { count: 100 })),

    artist: yup
      .string()
      .required(t("validation.required"))
      .min(2, t("validation.min", { count: 2 }))
      .max(50, t("validation.max", { count: 50 })),

    genre: yup.string().required(t("validation.required")),

    review: yup
      .string()
      .required(t("validation.required"))
      .min(10, t("validation.min", { count: 10 }))
      .max(300, t("validation.max", { count: 300 })),

    rating: yup
      .number()
      .typeError(t("validation.number"))
      .required(t("validation.required"))
      .min(1, t("validation.minn", { count: 1 }))
      .max(5, t("validation.maxx", { count: 5 })),


  });



export default SongReviewSchema;
