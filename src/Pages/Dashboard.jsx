import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    api.get("/locations")
      .then((res) => setLocations(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Locais Cadastrados</h1>
      <ul>
        {locations.map(l => (
          <li key={l.id}>{l.name} - {l.address || "Sem endereço"}</li>
        ))}
      </ul>
    </div>
  );
}
