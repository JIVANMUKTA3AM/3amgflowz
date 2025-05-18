
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Header from "@/components/Header";
import Arquitetura from "./pages/Arquitetura";
import ModeloDados from "./pages/ModeloDados";
import Documentacao from "./pages/Documentacao";
import NotFound from "./pages/NotFound";
import Fluxos from "./pages/Fluxos";
import Profile from "./pages/Profile";
import Organizations from "./pages/Organizations";
import OrganizationMembers from "./pages/OrganizationMembers";
import OrganizationSettings from "./pages/OrganizationSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/organizations/:id/members" element={<OrganizationMembers />} />
            <Route path="/organizations/:id/settings" element={<OrganizationSettings />} />
            <Route path="/arquitetura" element={<Arquitetura />} />
            <Route path="/modelo-dados" element={<ModeloDados />} />
            <Route path="/documentacao" element={<Documentacao />} />
            <Route path="/fluxos" element={<Fluxos />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
