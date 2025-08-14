
import { Badge } from "@/components/ui/badge";

const TechSection = () => {
  const technologies = [
    { name: "React", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "Python", category: "IA/ML" },
    { name: "OpenAI GPT", category: "IA" },
    { name: "N8N", category: "Automação" },
    { name: "Supabase", category: "Database" },
    { name: "WhatsApp API", category: "Messaging" },
    { name: "Telegram API", category: "Messaging" },
    { name: "Webhooks", category: "Integração" },
    { name: "REST APIs", category: "Integração" },
    { name: "TypeScript", category: "Development" },
    { name: "Tailwind CSS", category: "Styling" }
  ];

  const categories = [...new Set(technologies.map(tech => tech.category))];

  return (
    <section className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-3amg bg-clip-text text-transparent">Tecnologias</span> que Utilizamos
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stack moderno e confiável para entregar soluções robustas e escaláveis
          </p>
        </div>

        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-4">{category}</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {technologies
                  .filter(tech => tech.category === category)
                  .map((tech, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-lg px-4 py-2 border-3amg-orange/30 text-3amg-orange hover:bg-3amg-orange hover:text-white transition-all duration-300"
                    >
                      {tech.name}
                    </Badge>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechSection;
