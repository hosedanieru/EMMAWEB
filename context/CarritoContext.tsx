"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ItemCarrito } from "@/types/carrito";

const STORAGE_KEY = "emma-carrito";

type CarritoContextType = {
  items: ItemCarrito[];
  agregarItem: (item: ItemCarrito) => void;
  quitarItem: (presentacionId: string) => void;
  actualizarCantidad: (presentacionId: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  total: number;
  cantidadTotal: number;
};

const CarritoContext = createContext<CarritoContextType | undefined>(
  undefined
);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [hidratado, setHidratado] = useState(false);

  // El carrito guardado se lee DESPUÉS de montar, nunca durante el render:
  // en el servidor no existe localStorage, y si el primer render dependiera
  // de él, el HTML del servidor (carrito vacío) no coincidiría con el del
  // navegador y React tumbaría la hidratación.
  //
  // El flag "hidratado" existe para no pisar el carrito guardado con el
  // arreglo vacío inicial en el efecto de abajo.
  //
  // La regla set-state-in-effect avisa del render extra; acá es inevitable.
  useEffect(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(guardado));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (hidratado) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hidratado]);

  function agregarItem(nuevo: ItemCarrito) {
    setItems((prev) => {
      const existente = prev.find(
        (i) => i.presentacionId === nuevo.presentacionId
      );
      if (existente) {
        const cantidadSumada = existente.cantidad + nuevo.cantidad;
        const cantidadFinal = Math.min(cantidadSumada, existente.stockDisponible);
        return prev.map((i) =>
          i.presentacionId === nuevo.presentacionId
            ? { ...i, cantidad: cantidadFinal }
            : i
        );
      }
      const cantidadInicial = Math.min(nuevo.cantidad, nuevo.stockDisponible);
      return [...prev, { ...nuevo, cantidad: cantidadInicial }];
    });
  }

  function quitarItem(presentacionId: string) {
    setItems((prev) =>
      prev.filter((i) => i.presentacionId !== presentacionId)
    );
  }

  function actualizarCantidad(presentacionId: string, cantidad: number) {
    if (cantidad <= 0) {
      quitarItem(presentacionId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.presentacionId === presentacionId
          ? { ...i, cantidad: Math.min(cantidad, i.stockDisponible) }
          : i
      )
    );
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarItem,
        quitarItem,
        actualizarCantidad,
        vaciarCarrito,
        total,
        cantidadTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) {
    throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  }
  return ctx;
}