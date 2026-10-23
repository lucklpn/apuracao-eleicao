# Dashboard Dinâmico de Apuração de Votos (TSE)

Aplicação web client-side moderna, reativa e de alta performance para acompanhamento da apuração e contagem de votos das eleições brasileiras em tempo real, consumindo diretamente a CDN oficial do Tribunal Superior Eleitoral (TSE).

Disponível em: `https://apuracao.hexadm.com.br`

---

## 🛠 Stack Tecnológica

* **Frontend:** React 18+ com Vite & TypeScript (Strict Mode).
* **Estilização:** Tailwind CSS (modo escuro/claro com persistência local e tokens de acessibilidade WCAG 2.1 AA).
* **Gerenciamento de Estado & Cache:** TanStack Query v5 (React Query) com polling inteligente, revalidação e retentativas exponenciais.
* **Componentes & Ícones:** Lucide React & Tailwind UI Primitives.
* **Visualização de Dados:** Recharts (gráfico dinâmico de evolução por lote sincronizado na sessão).
* **Testes & Qualidade:** Vitest (testes unitários e de integração real contra endpoints do TSE) + Playwright (automação e inspeção de rede).
* **Servidor de Produção:** Nginx Alpine (multi-stage Docker build) atuando como SPA server e proxy reverso local para o TSE.

---

## 🏛 Arquitetura & Integração com o TSE

Durante os ciclos eleitorais modernos (2024 / 2026), o TSE migrou sua distribuição pública de arquivos JSON estáticos abertos para o padrão **JWS (JSON Web Signature)** sob compressão `base64url` em endpoints de dados oficiais:

### Padrão dos Endpoints Oficiais

1. **Configuração Geral de Eleições:**
   ```text
   https://resultados.tse.jus.br/oficial/comum/config/ele-c.json
   ```
2. **Dados de Totalização e Votos por Cargo / UF:**
   ```text
   https://resultados.tse.jus.br/oficial/{ciclo}/{codigo_eleicao}/dados/{uf}/{uf}-c{cargo}-e{codigo_eleicao}-u.jws
   ```
   * Exemplo (Presidente 2026 - 1º Turno):
     `https://resultados.tse.jus.br/oficial/ele2026/6257/dados/br/br-c0001-e006257-u.jws`
   * Exemplo (Governador SP 2026 - 1º Turno):
     `https://resultados.tse.jus.br/oficial/ele2026/6259/dados/sp/sp-c0003-e006259-u.jws`
3. **Fotos Oficiais dos Candidatos:**
   ```text
   https://resultados.tse.jus.br/oficial/{ciclo}/{codigo_eleicao}/fotos/{uf}/{sqcand}.jpeg
   ```

### Códigos das Eleições Mapeadas (2026)

* **`6257`**: Eleição Ordinária Federal 2026 (1º Turno) — Cargo: Presidente (`c0001`, escopo `BR`).
* **`6259`**: Eleições Gerais Estaduais 2026 (1º Turno) — Cargos: Governador (`c0003`), Senador (`c0005`), Deputado Federal (`c0006`), Deputado Estadual (`c0007`) e Deputado Distrital (`c0008`, DF).
* **`6258`**: Eleição Federal (2º Turno - Presidente).
* **`6260`**: Eleições Estaduais (2º Turno - Governador).

### Parser Universal JWS (`src/utils/tseParser.ts`)
O formato JWS devolvido pelo TSE é composto por 3 partes (`header.payload.signature`). A aplicação intercepta o payload, decodifica a base64url preservando caracteres acentuados UTF-8 e mapeia a árvore hierárquica `carg[].agr[].par[].cand[]` em uma lista plana padronizada com seções totalizadas, votos válidos, brancos, nulos e abstenções.

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
* Node.js 18+ (recomendado Node 20+)
* npm

### Passo a Passo
```powershell
# Instalar dependências
npm install

# Rodar a suíte de testes
npm test

# Iniciar servidor de desenvolvimento (acessível no PC e na rede Wi-Fi)
npm run dev
```

Acesse no navegador: `http://localhost:5173`.

---

## 🐳 Deploy na VPS com Docker & Docker Compose

A aplicação conta com um build multi-stage Docker:
1. **Estágio Builder:** Node.js Alpine instala dependências e compila os assets para a pasta `dist`.
2. **Estágio Final:** Nginx Alpine leve (~25MB) serve os arquivos estáticos e atua como proxy reverso em `/api-tse/`, eliminando qualquer problema de CORS em produção.

### 1. Clonar / Copiar o projeto para a VPS
Envie o projeto para a sua VPS (ex: `/var/www/apuracao-votos` ou `~/apuracao-votos`):
```bash
cd /caminho/do/projeto/ApuracaoVotosBrasil
```

### 2. Subir o Container
O arquivo `docker-compose.yml` mapeia a porta interna do container para `127.0.0.1:8080` na VPS:
```bash
docker compose up -d --build
```

Para verificar se o container está rodando e saudável:
```bash
docker compose ps
docker compose logs -f
```

---

## 🌐 Configuração do Apache 2 (Proxy Reverso na VPS)

Se você já possui o Apache 2 rodando na sua VPS servindo outros sites, basta criar um novo VirtualHost para redirecionar as requisições de `apuracao.hexadm.com.br` para o container Docker rodando em `127.0.0.1:8080`.

### 1. Habilitar os módulos necessários no Apache
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod rewrite
```

### 2. Criar o arquivo de VirtualHost
Crie o arquivo `/etc/apache2/sites-available/apuracao.hexadm.com.br.conf`:
```bash
sudo nano /etc/apache2/sites-available/apuracao.hexadm.com.br.conf
```

Cole o conteúdo (já disponível no arquivo `apache-vhost.conf` deste repositório):
```apache
<VirtualHost *:80>
    ServerName apuracao.hexadm.com.br
    ServerAdmin webmaster@hexadm.com.br

    ProxyPreserveHost On
    ProxyRequests Off

    <Proxy *>
        Require all granted
    </Proxy>

    ProxyPass / http://127.0.0.1:8080/ retry=0 timeout=60
    ProxyPassReverse / http://127.0.0.1:8080/

    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteRule /(.*)           ws://127.0.0.1:8080/$1 [P,L]

    ErrorLog ${APACHE_LOG_DIR}/apuracao_hexadm_error.log
    CustomLog ${APACHE_LOG_DIR}/apuracao_hexadm_access.log combined
</VirtualHost>
```

### 3. Ativar o site e recarregar o Apache
```bash
sudo a2ensite apuracao.hexadm.com.br.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

---

## ☁️ Configuração na Cloudflare (Túnel & Subdomínio)

Como a sua VPS já está conectada via **Cloudflare Tunnel (cloudflared)**:

### Opção A: Pelo Painel Web da Cloudflare (Zero Trust Dashboard)
1. Acesse o [Cloudflare Zero Trust](https://one.dash.cloudflare.com/).
2. Vá em **Networks** > **Tunnels**.
3. Clique no túnel ativo da sua VPS e clique em **Configure**.
4. Acesse a aba **Public Hostnames** e clique em **Add a public hostname**.
5. Preencha os campos:
   * **Subdomain:** `apuracao`
   * **Domain:** `hexadm.com.br`
   * **Path:** (deixe vazio)
   * **Service Type:** `HTTP`
   * **URL:** `localhost:80` (se quiser que passe pelo Apache) ou `localhost:8080` (se quiser apontar direto para o container Docker).
     > *Recomendação:* Se usar `localhost:80`, o tráfego passa pelo Apache configurado acima. Se apontar para `localhost:8080`, a Cloudflare entrega direto para o Nginx do Docker, sem precisar de configuração extra no Apache!
6. Clique em **Save hostname**.

### Opção B: Via arquivo de configuração do Cloudflared (`config.yml` na VPS)
Se você gerencia o túnel via arquivo de configuração na VPS (normalmente em `/etc/cloudflared/config.yml`):
Adicione a rota em `ingress`:
```yaml
ingress:
  - hostname: apuracao.hexadm.com.br
    service: http://localhost:80
  # ou direto no docker:
  # - hostname: apuracao.hexadm.com.br
  #   service: http://localhost:8080
  - service: http_status:404
```
Reinicie o serviço do cloudflared na VPS:
```bash
sudo systemctl restart cloudflared
```

---

## 🧪 Suíte de Testes Automatizados

Para garantir que a integração com os endpoints do TSE continue íntegra:
```powershell
npm test
```
* **Testes unitários:** validação de decodificação JWS, tratamento de acentuação, cálculos proporcionais e montagem de URLs.
* **Testes de integração ao vivo:** requisições reais aos servidores de apuração do TSE garantindo retorno `HTTP 200`.
