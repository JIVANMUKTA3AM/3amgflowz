-- Remover policies permissivas de sistema e criar versões mais seguras
DROP POLICY IF EXISTS "System can manage all service sessions" ON public.service_sessions;
DROP POLICY IF EXISTS "System can manage all service events" ON public.service_events;

-- Adicionar policy para DELETE em service_sessions (faltava)
CREATE POLICY "Tenant owners can delete their service sessions"
  ON public.service_sessions
  FOR DELETE
  USING (is_tenant_owner(tenant_id, auth.uid()));

-- Adicionar policy para UPDATE e DELETE em service_events
CREATE POLICY "Tenant members can update events in their sessions"
  ON public.service_events
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.service_sessions ss
      WHERE ss.id = service_events.service_session_id
      AND is_tenant_member(ss.tenant_id, auth.uid())
    )
  );

CREATE POLICY "Tenant owners can delete events in their sessions"
  ON public.service_events
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.service_sessions ss
      WHERE ss.id = service_events.service_session_id
      AND is_tenant_owner(ss.tenant_id, auth.uid())
    )
  );