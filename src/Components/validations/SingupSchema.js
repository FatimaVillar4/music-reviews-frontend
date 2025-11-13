import * as yup from "yup";

export const SignupSchema = (t) =>
  yup.object().shape({
    name: yup
      .string()
      .required(t("validation.required"))
      .min(3, t("validation.min", { count: 3 }))
      .max(30, t("validation.max", { count: 30 })),

    username: yup
      .string()
      .matches(/^[a-zA-Z0-9]+$/, t("validation.alphaNumeric"))
      .required(t("validation.required"))
      .min(3, t("validation.min", { count: 3 }))
      .max(20, t("validation.max", { count: 20 })),

    email: yup
      .string()
      .email(t("validation.email"))
      .required(t("validation.required")),

    password: yup
      .string()
      .matches(/^[a-zA-Z0-9]+$/, t("validation.alphaNumeric"))
      .required(t("validation.required"))
      .min(8, t("validation.min", { count: 8 }))
      .max(20, t("validation.max", { count: 20 })),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], t("validation.passwordMatch"))
      .required(t("validation.required")),
  });

export default SignupSchema;
