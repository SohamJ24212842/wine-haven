# ⚡ Quick Start - Deploy to Vercel in 5 Minutes

## 🎯 **What You Need**

1. ✅ GitHub account
2. ✅ Vercel account (free)
3. ✅ Your Wix domain: `winehavendunlaoghaire.com`

---

## 🚀 **Deploy Steps**

### **1. Push to GitHub** (2 min)

```bash
cd "E:\Wine Haven Website\wine-haven-next"
git init
git add .
git commit -m "Next.js Wine Haven site - ready for Vercel deployment"
git branch -M main
git remote add origin https://github.com/SohamJ24212842/wine-haven.git
git push -u origin main
```

---

### **2. Deploy to Vercel** (2 min)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your `wine-haven-next` repo
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **"Deploy"**

✅ **You'll get:** `https://wine-haven-next.vercel.app`

---

### **3. Connect Wix Domain** (1 min)

1. Vercel → Project → **Settings** → **Domains**
2. Add: `winehavendunlaoghaire.com`
3. Copy DNS records shown by Vercel
4. Wix → Domains → DNS Settings → Add:
   - **A record:** `@` → `76.76.21.21`
   - **CNAME:** `www` → `cname.vercel-dns.com`
5. Wait 5-60 minutes

✅ **Your site is live!**

---

## 📚 **Full Guides**

- **Detailed deployment:** See `DEPLOYMENT.md`
- **Video optimization:** See `VIDEO_OPTIMIZATION.md`
- **DNS troubleshooting:** See `DEPLOYMENT.md` → Troubleshooting

---

## 🎉 **That's It!**

Your site is now:
- ✅ Live on Vercel
- ✅ Using your custom domain
- ✅ Auto-deploying on every Git push
- ✅ Fast & secure (HTTPS)

**Test your preview URL and share with the client!**

