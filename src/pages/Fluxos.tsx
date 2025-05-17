import React from 'react';

const Fluxos = () => {
  const codeSnippets = [
    {
      id: 'fluxo1',
      title: 'Fluxo de Processamento de Dados',
      description: 'Automatiza a coleta, transformação e carregamento de dados.',
      code: `
      // Exemplo de fluxo para processamento de dados
      const data = fetchData();
      const transformedData = transformData(data);
      loadData(transformedData);
      `,
    },
    {
      id: 'fluxo2',
      title: 'Fluxo de Notificações',
      description: 'Envia notificações automatizadas por e-mail e SMS.',
      code: `
      // Exemplo de fluxo para envio de notificações
      const event = getEventData();
      if (event) {
        sendEmailNotification(event);
        sendSMSNotification(event);
      }
      `,
    },
    {
      id: 'fluxo3',
      title: 'Fluxo de Integração com APIs',
      description: 'Integração com serviços externos para sincronização de dados.',
      code: `
      // Exemplo de fluxo para integração com APIs
      const apiData = fetchApiData('https://api.example.com');
      saveDataToDatabase(apiData);
      `,
    },
  ];

  // Fix the showCode function to use proper DOM APIs
  const showCode = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Instead of using .click() which doesn't exist on Element type,
      // we toggle classes or properties directly
      const isHidden = element.classList.contains('hidden');
      if (isHidden) {
        element.classList.remove('hidden');
      } else {
        element.classList.add('hidden');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fluxos n8n</h1>
      <p className="mb-4">
        Exemplos de fluxos de trabalho automatizados utilizando n8n para integração e automação de tarefas.
      </p>
      {codeSnippets.map((snippet) => (
        <div key={snippet.id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{snippet.title}</h2>
          <p className="text-gray-600 mb-2">{snippet.description}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
            onClick={() => showCode(snippet.id)}
          >
            Mostrar Código
          </button>
          <pre id={snippet.id} className="hidden bg-gray-100 p-4 rounded">
            <code className="text-sm">{snippet.code}</code>
          </pre>
        </div>
      ))}
    </div>
  );
};

export default Fluxos;
