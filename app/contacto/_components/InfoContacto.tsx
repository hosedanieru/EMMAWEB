import { MapPin, Phone, Clock, Mail } from 'lucide-react';

export default function InfoContacto() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3">
        <MapPin className="text-brand-green-500 shrink-0" size={22} />
        <div>
          <h3 className="font-semibold text-black">Dirección</h3>
          <p className="text-gray-600">[ Av. Troncal de Occidente 18 – 76, Bodega B9, Parque Industrial Santo Domingo]</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Phone className="text-brand-green-500 shrink-0" size={22} />
        <div>
          <h3 className="font-semibold text-black">Teléfono</h3>
          <p className="text-gray-600">[311 371 2834]</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Mail className="text-brand-green-500 shrink-0" size={22} />
        <div>
          <h3 className="font-semibold text-black">Correo</h3>
          <p className="text-gray-600">[PENDIENTE: correo real]</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Clock className="text-brand-green-500 shrink-0" size={22} />
        <div>
          <h3 className="font-semibold text-black">Horario de atención</h3>
          <p className="text-gray-600">[PENDIENTE: horario real]</p>
        </div>
      </div>
    </div>
  );
}