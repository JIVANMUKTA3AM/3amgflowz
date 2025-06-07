
export const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "available":
      return "bg-blue-100 text-blue-800";
    case "coming_soon":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return "Ativo";
    case "available":
      return "Disponível";
    case "coming_soon":
      return "Em breve";
    default:
      return "Indisponível";
  }
};
