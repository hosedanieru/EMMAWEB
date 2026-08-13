import Hero from "./_components/Hero";
import Pilares from "./_components/Pilares";
import CompromisoAmbiental from "./_components/CompromisoAmbiental";
import CtaCierre from "./_components/CtaCierre";
import NuestraEstrategia from "./_components/NuestraEstrategia";
import CadenaDeValor from "./_components/CadenaDeValor";
import Liderazgo from "./_components/Liderazgo";

export default function Conocenos() {
  return (
    // 1. Contenedor principal con la imagen fija
    <div className="bg-[url('/images/paisajeemma.png')] bg-fixed bg-cover bg-center bg-no-repeat min-h-screen">
      
      {/* 2. El overlay blanco envuelve TODO el contenido para que se aplique la transparencia */}
      <div className="bg-white/40 backdrop-blur-sm min-h-screen">
        <Hero />
        <CadenaDeValor />
        <CompromisoAmbiental />
        <Liderazgo />
        <NuestraEstrategia />
        <Pilares />
        <CtaCierre />
      </div>
      
    </div>
  );
}