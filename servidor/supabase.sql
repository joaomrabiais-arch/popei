-- Brota: base de dados no Supabase (criar o projeto na região UE, por exemplo Frankfurt).
-- Corre isto uma vez no SQL Editor do Supabase. Depois põe o URL e a chave "anon" em BRAND.supabase (app/src/js/01-config.js).
-- A chave "anon" pode estar na app: quem protege os dados são as regras RLS abaixo (cada pessoa só vê a sua linha).

create table if not exists public.brota_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  constraint brota_state_size check (pg_column_size(data) < 2000000)  -- limite de ~2 MB por pessoa
);

alter table public.brota_state enable row level security;

create policy "ler os meus dados"     on public.brota_state for select using (auth.uid() = user_id);
create policy "criar os meus dados"   on public.brota_state for insert with check (auth.uid() = user_id);
create policy "mudar os meus dados"   on public.brota_state for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "apagar os meus dados"  on public.brota_state for delete using (auth.uid() = user_id);

-- Autenticação: em Authentication > Providers, deixar só "Email" (ligação mágica).
-- Em Authentication > URL Configuration, pôr em "Site URL" e "Redirect URLs" o endereço da app (o da Vercel).
-- Em Authentication > Rate Limits, manter os limites de envio de e-mail (protege contra abuso).

-- Apagar a conta (a App Store e o Google Play exigem que a pessoa o possa fazer dentro da app).
-- Corre com os direitos do dono da função, mas só apaga a conta de quem a chama (auth.uid()).
-- Os dados em brota_state desaparecem também, por causa do "on delete cascade".
create or replace function public.delete_my_account() returns void
language sql security definer set search_path = public as $$
  delete from auth.users where id = auth.uid();
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
