import Hero from "./_components/Hero";
import FeaturedProducts from "./_components/FeaturedProducts"; 
import NacimosEnElCampo from "./_components/NacimosEnElCampo";
import CalidadQueSeSiente from "./_components/CalidadQueSeSiente";
import Sostenibilidad from "./_components/Sostenibilidad";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedProducts/>
      <NacimosEnElCampo/>
      <CalidadQueSeSiente/>
      <Sostenibilidad/>
    </div>
  );
}