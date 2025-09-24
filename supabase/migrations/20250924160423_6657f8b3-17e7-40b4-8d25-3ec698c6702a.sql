-- Create table for provider plans
CREATE TABLE public.planos_provedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provedor_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  nome_plano TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  promocao TEXT,
  condicoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.planos_provedores ENABLE ROW LEVEL SECURITY;

-- Create policies for provider plans
CREATE POLICY "Users can view plans from their providers" 
ON public.planos_provedores 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.providers p 
  WHERE p.id = planos_provedores.provedor_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Users can create plans for their providers" 
ON public.planos_provedores 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.providers p 
  WHERE p.id = planos_provedores.provedor_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Users can update plans from their providers" 
ON public.planos_provedores 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.providers p 
  WHERE p.id = planos_provedores.provedor_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Users can delete plans from their providers" 
ON public.planos_provedores 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.providers p 
  WHERE p.id = planos_provedores.provedor_id 
  AND p.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_planos_provedores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_planos_provedores_updated_at
BEFORE UPDATE ON public.planos_provedores
FOR EACH ROW
EXECUTE FUNCTION public.update_planos_provedores_updated_at();

-- Create index for better performance
CREATE INDEX idx_planos_provedores_provedor_id ON public.planos_provedores(provedor_id);
CREATE INDEX idx_planos_provedores_ativo ON public.planos_provedores(ativo);