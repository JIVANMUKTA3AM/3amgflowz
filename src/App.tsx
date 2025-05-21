
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Arquitetura from "./pages/Arquitetura";
import ModeloDados from "./pages/ModeloDados";
import Documentacao from "./pages/Documentacao";
import NotFound from "./pages/NotFound";
import Fluxos from "./pages/Fluxos";
import Pagamentos from "./pages/Pagamentos";
import PagamentoMetodo from "./pages/PagamentoMetodo";
import Agentes from "./pages/Agentes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/arquitetura" element={<Arquitetura />} />
          <Route path="/modelo-dados" element={<ModeloDados />} />
          <Route path="/documentacao" element={<Documentacao />} />
          <Route path="/fluxos" element={<Fluxos />} />
          <Route path="/pagamentos" element={<Pagamentos />} />
          <Route path="/pagamentos/metodo" element={<PagamentoMetodo />} />
          <Route path="/agentes" element={<Agentes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
