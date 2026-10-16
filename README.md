# Benguela Tickets — MAP (Minimum Awesome Product)

Plataforma de venda de ingressos online focada em eventos de **Benguela**, Angola.

## O que este MAP inclui

- Listagem de eventos publicados
- Página de evento com tipos de passe e preços
- Sistema de QR Code assinado (JWT) para cada ingresso
- Endpoint de validação de ingressos (`/api/tickets/validate`)
- Painel Admin básico (Dashboard + lista de eventos + Scanner)
- Schema Prisma completo e realista
- Formatação de valores em Kwanzas

## O que ainda precisa ser implementado

- Autenticação (login de admin e utilizadores)
- Fluxo completo de checkout + integração Multicaixa Express
- Página de criação/edição de eventos no admin
- Página "Meus Ingressos" com visualização do QR
- Upload de flyers
- Envio de email / WhatsApp após compra
- Webhook do gateway de pagamento

## Como correr localmente

1. Clone / extraia o projeto
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o `.env` (copie de `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Preencha `DATABASE_URL` (PostgreSQL) e `QR_SECRET`.

4. Gere o cliente Prisma e empurre o schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Corra o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

6. Abra [http://localhost:3000](http://localhost:3000)

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- jose (JWT assinado para QR Codes)

## Estrutura principal

```
src/
  app/
    page.tsx                 → Home
    eventos/[slug]/page.tsx  → Página do evento
    admin/                   → Painel de controlo
    api/tickets/validate/    → Validação de QR
  lib/
    prisma.ts
    qr.ts                    → Geração e verificação de QR
    tickets.ts               → Criação de ingressos após pagamento
prisma/
  schema.prisma
```

## Próximos passos recomendados

1. Implementar autenticação simples para o admin
2. Criar o formulário de criação de eventos
3. Integrar um gateway Multicaixa (AppyPay, Gpayment, Linkpaga ou Frantal Pay)
4. Adicionar a página de "Meus Ingressos" com o componente de QR Code

---

Feito para Benguela.  
Não é um brinquedo. É a base séria de um produto real.
