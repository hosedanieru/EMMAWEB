"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import { ItemCarrito, CarritoState } from "@/types/carrito";

const STORAGE_KEY = "emmaweb_carrito";

type Accion =
  | { type: "HIDRATAR"; payload: ItemCarrito[] }
  | { type: "AGREGAR"; payload: ItemCarrito }
  | { type: "QUITAR"; payload: { presentacionId: string } }
  | { type: "ACTUALIZAR_CANTIDAD"; payload: { presentacionId: string; cantidad: number } }
  | { type: "VACIAR" };

function reducer(state: CarritoState, accion: Accion): CarritoState {
  switch (accion.type) {
    case "HIDRATAR":
      return { items: accion.payload };

    case "AGREGAR": {
      const existente = state.items.find(
        (i) => i.presentacionId === accion.payload.presentacionId
      );
      if (existente) {
        // Ya está en el carrito: sumamos cantidad, respetando el stock
        return {
          items: state.items.map((i) =>
            i.presentacionId === accion.payload.presentacionId
              ? {
                  ...i,
                  cantidad: Math.min(
                    i.cantidad + accion.payload.cantidad,
                    i.stockDisponible
                  ),
                }
              : i
          ),
        };
      }
      return { items: [...state.items, accion.payload] };
    }

    case "QUITAR":
      return {
        items: state.items.filter(
          (i) => i.presentacionId !== accion.payload.presentacionId
        ),
      };

    case "ACTUALIZAR_CANTIDAD":
      return {
        items: state.items.map((i) =>
          i.presentacionId === accion.payload.presentacionId
            ? {
                ...i,
                cantidad: Math.max(
                  1,
                  Math.min(accion.payload.cantidad, i.stockDisponible)
                ),
              }
            : i
        ),
      };

    case "VACIAR":
      return { items: [] };

    default:
      return state;
  }
}

interface CarritoContextValue {
  items: ItemCarrito[];
  agregarItem: (item: ItemCarrito) => void;
  quitarItem: (presentacionId: string) => void;
  actualizarCantidad: (presentacionId: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  totalItems: number;
  totalPrecio: number;
}

const CarritoContext = createContext<CarritoContextValue | undefined>(
  undefined
);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  // Hidratar desde localStorage al montar (solo corre en cliente)
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        dispatch({ type: "HIDRATAR", payload: JSON.parse(guardado) });
      }
    } catch {
      // localStorage corrupto o inaccesible: seguimos con carrito vacío
    }
  }, []);

  // Persistir en localStorage cada vez que cambian los items
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const value: CarritoContextValue = {
    items: state.items,
    agregarItem: (item) => dispatch({ type: "AGREGAR", payload: item }),
    quitarItem: (presentacionId) =>
      dispatch({ type: "QUITAR", payload: { presentacionId } }),
    actualizarCantidad: (presentacionId, cantidad) =>
      dispatch({
        type: "ACTUALIZAR_CANTIDAD",
        payload: { presentacionId, cantidad },
      }),
    vaciarCarrito: () => dispatch({ type: "VACIAR" }),
    totalItems: state.items.reduce((acc, i) => acc + i.cantidad, 0),
    totalPrecio: state.items.reduce(
      (acc, i) => acc + i.precio * i.cantidad,
      0
    ),
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  }
  return context;
}