import { useState, useEffect } from "react";
import axios from "axios";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import API from "@/lib/api/client";

export function ManageServices() {
  const [services, setServices] = useState<{ id: number; name: string }[]>([]);
  const [newServiceName, setNewServiceName] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await API.get("/api/services");
        setServices(response.data);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      }
    };
    fetchServices();
  }, []);

  const handleAddService = async () => {
    const trimmedName = newServiceName.trim();
    if (!trimmedName) {
      alert("Por favor, insira um nome para o serviço.");
      return;
    }
    try {
      const response = await axios.post("/api/services", {
        name: trimmedName,
      });
      setServices([...services, response.data]);
      setNewServiceName("");
      alert("Serviço adicionado com sucesso!");
    } catch (error) {
      let errorMessage = "Erro ao adicionar serviço";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      alert(errorMessage);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este serviço?")) return;
    try {
      await axios.delete("/api/services/${id}");
      setServices(services.filter((s) => s.id !== id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Erro ao remover serviço");
      }
    }
  };

  return (
    <div>
      <Card className="p-4 mb-6 max-w-md">
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            placeholder="Nome do novo serviço"
            className="flex-1 min-w-0"
          />
          <Button onClick={handleAddService}>Add</Button>
        </div>
        <ul className="border rounded divide-y">
          {services.map((service) => (
            <li
              key={service.id}
              className="p-3 flex justify-between items-center"
            >
              <span>{service.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteService(service.id)}
              >
                <XIcon className="w-5 h-5 text-white" />
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
