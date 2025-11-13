import * as yup from "yup";

export const LoginSchema = (t) =>
  yup.object().shape({
    username: yup 
        .string()
        .matches(/^[a-zA-Z0-9]+$/, t("validation.alphaNumeric"))
        .required(t("validation.required"))
        .min(5, t("validation.min", { count: 5 }))
        .max(20, t("validation.max", { count: 30 })),


    password: yup
        .string()
        .matches(/^[a-zA-Z0-9]+$/, t("validation.alphaNumeric"))
        .required(t("validation.required"))
        .min(8, t("validation.min", { count: 8 }))
        .max(20, t("validation.max", { count: 20 })),
  });

  export default LoginSchema;