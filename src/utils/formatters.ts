
export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};
