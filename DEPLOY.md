# 🚀 Ghid pentru Deploy pe Vercel

## 📋 Pași pentru Deploy

### 1. **Pregătirea Variabilelor de Mediu**

Înainte de deploy, asigură-te că ai următoarele variabile de mediu configurate:
### 2. **Deploy pe Vercel**

#### Opțiunea A: Deploy prin Vercel CLI
```bash
# Instalează Vercel CLI
npm i -g vercel

# Login în Vercel
vercel login

# Deploy
vercel

# Pentru production
vercel --prod
```

#### Opțiunea B: Deploy prin GitHub
1. **Push codul pe GitHub**
2. **Conectează repository-ul la Vercel**
3. **Configurează variabilele de mediu în Vercel Dashboard**

### 3. **Configurarea Variabilelor în Vercel**

În Vercel Dashboard:
1. Mergi la **Settings** → **Environment Variables**
2. Adaugă fiecare variabilă:
   - `NEXT_PUBLIC_STEAM_API_KEY`
   - `NEXT_PUBLIC_STEAM_USER_ID`
   - `NEXT_PUBLIC_DISCORD_USER_ID`
   - `NEXT_PUBLIC_CORS_PROXY_URL`

### 4. **Verificarea Deploy-ului**

După deploy, verifică:
- ✅ Site-ul se încarcă corect
- ✅ Steam status se afișează
- ✅ Link-urile Discord și GitHub funcționează
- ✅ Counter-ul de vizitatori funcționează

## 🔒 Securitate

- ✅ **API Keys protejate** - Nu sunt expuse în cod
- ✅ **Environment Variables** - Configurate în Vercel
- ✅ **Gitignore** - Fișierele `.env*` sunt ignorate
- ✅ **CORS Proxy** - Pentru apelurile API externe

## 🛠️ Comenzi Utile

```bash
# Development
npm run dev

# Build pentru production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## 📝 Note Importante

- **Steam API Key** este publică (pentru că este folosită în frontend)
- **Discord ID** este public (nu este o informație sensibilă)
- **CORS Proxy** poate fi schimbat dacă este necesar
- **Environment Variables** trebuie configurate în Vercel pentru production
