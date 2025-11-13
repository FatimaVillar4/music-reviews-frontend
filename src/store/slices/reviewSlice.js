import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listaReseñas: [],
};

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    cargarReseñas: (state, action) => {
      state.listaReseñas = action.payload;
    },
    agregarReseña: (state, action) => {
      state.listaReseñas.push(action.payload);
    },
    eliminarReseña: (state, action) => {
      state.listaReseñas = state.listaReseñas.filter(
        (r) => r._id !== action.payload
      );
    },
    editarReseña: (state, action) => {
      const index = state.listaReseñas.findIndex(
        (r) => r._id === action.payload._id
      );
      if (index !== -1) {
        state.listaReseñas[index] = action.payload;
      }
    },
  },
});

export const { cargarReseñas, agregarReseña, eliminarReseña, editarReseña } =
  reviewsSlice.actions;

export default reviewsSlice.reducer;