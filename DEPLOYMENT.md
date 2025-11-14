# 🚀 Wine Haven - Vercel Deployment Guide

Complete step-by-step guide to deploy your Next.js site to Vercel and connect your Wix-purchased domain.

---

## ✅ **Step 1: Push Code to GitHub**

If you haven't already, push your code to GitHub:

```bash
cd "E:\Wine Haven Website\wine-haven-next"
git init  # if not already a git repo
git add .
git commit -m "Initial commit - Wine Haven Next.js site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wine-haven-next.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username.**

---

## ✅ **Step 2: Deploy to Vercel (Free Tier)**

### **Option A: Via Vercel Dashboard (Easiest)**

1. **Sign up/Login to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (recommended) or email

2. **Import Your Project:**
   - Click **"Add New..."** → **"Project"**
   - Click **"Import Git Repository"**
   - Select your `wine-haven-next` repository
   - Click **"Import"**

3. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)

4. **Add Environment Variables:**
   Click **"Environment Variables"** and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   (Get these from your Supabase project settings)

5. **Deploy:**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete
   - ✅ **You'll get a free preview URL:** `https://wine-haven-next.vercel.app`

### **Option B: Via Vercel CLI (Advanced)**

```bash
npm i -g vercel
cd "E:\Wine Haven Website\wine-haven-next"
vercel login
vercel
# Follow prompts, then:
vercel --prod
```

---

## ✅ **Step 3: Test Your Preview URL**

Your site is now live at: `https://wine-haven-next.vercel.app`

**Test these features:**
- ✅ Hero video scroll animation
- ✅ Shop page filtering
- ✅ Product pages
- ✅ Cart functionality
- ✅ Mobile responsiveness

**Every time you push to GitHub, Vercel auto-deploys a new preview!**

---

## ✅ **Step 4: Connect Your Wix Domain to Vercel**

### **A. Add Domain in Vercel:**

1. Go to your project on Vercel
2. Click **"Settings"** → **"Domains"**
3. Enter your domain: `winehavendunlaoghaire.com` (or `www.winehavendunlaoghaire.com`)
4. Click **"Add"**

Vercel will show you DNS records to add:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Copy these values!**

---

### **B. Update DNS in Wix:**

1. **Log into Wix:**
   - Go to [wix.com](https://wix.com) → Login
   - Go to **"Domains"** → Select your domain

2. **Access DNS Settings:**
   - Click **"Manage Domain"** or **"DNS Settings"**
   - Look for **"Advanced DNS Settings"** or **"DNS Records"**

3. **Add/Update DNS Records:**

   **For Root Domain (winehavendunlaoghaire.com):**
   - Find existing **A record** for `@` (or root)
   - **Edit** it or **Add New**:
     - **Type:** A
     - **Name:** @ (or leave blank, or `winehavendunlaoghaire.com`)
     - **Value:** `76.76.21.21`
     - **TTL:** 3600 (or default)

   **For WWW Subdomain:**
   - Find existing **CNAME** for `www`
   - **Edit** it or **Add New**:
     - **Type:** CNAME
     - **Name:** www
     - **Value:** `cname.vercel-dns.com`
     - **TTL:** 3600 (or default)

4. **Save Changes**

---

### **C. Wait for DNS Propagation:**

- ⏱️ **Usually takes 5-60 minutes** (can take up to 48 hours)
- Check status in Vercel → Settings → Domains
- Vercel will show ✅ "Valid Configuration" when ready

**Test your domain:**
- Visit `https://winehavendunlaoghaire.com` (should show your site)
- Visit `https://www.winehavendunlaoghaire.com` (should redirect to root)

---

## ✅ **Step 5: Enable HTTPS (Automatic)**

Vercel automatically provides:
- ✅ **Free SSL certificate** (Let's Encrypt)
- ✅ **Automatic HTTPS redirect**
- ✅ **HTTP/2 support**

No action needed! Your site will be secure.

---

## 🎬 **Step 6: Optimize Video Performance**

Your hero video (`7102288-hd_1920_1080_30fps.mp4`) is 7MB. For best performance:

### **Option A: Re-encode Video (Recommended)**

Use FFmpeg to optimize:

```bash
# Install FFmpeg first: https://ffmpeg.org/download.html

ffmpeg -i public/7102288-hd_1920_1080_30fps.mp4 \
  -vf "scale=1280:-2" \
  -b:v 1800k \
  -an \
  -movflags +faststart \
  -g 15 \
  -keyint_min 15 \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  public/hero-video-optimized.mp4
```

Then update `Hero.tsx` line 101:
```tsx
src="/hero-video-optimized.mp4"
```

### **Option B: Use Vercel CDN (Already Active)**

Vercel automatically serves `/public` files via CDN, so your video is already optimized for delivery.

### **Option C: External Video Hosting (Best for Large Files)**

Upload to:
- **Cloudflare Stream** (free tier: 100GB)
- **Mux** (free tier: 10GB)
- **YouTube/Vimeo** (unlisted, embed)

Then update `Hero.tsx` to use the external URL.

---

## 🔧 **Environment Variables in Vercel**

To update environment variables later:

1. Go to Vercel → Your Project → **Settings** → **Environment Variables**
2. Add/Edit variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Click **"Save"**
4. **Redeploy** (Vercel → Deployments → Click "..." → Redeploy)

---

## 📊 **Monitoring & Analytics**

Vercel provides:
- ✅ **Real-time analytics** (traffic, performance)
- ✅ **Error tracking** (check Vercel dashboard)
- ✅ **Build logs** (see deployment history)

---

## 🚨 **Troubleshooting**

### **DNS Not Working?**
- Wait 24-48 hours for full propagation
- Check DNS with: [dnschecker.org](https://dnschecker.org)
- Verify records match Vercel's requirements

### **Build Fails?**
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `package.json` scripts are correct

### **Video Not Loading?**
- Check file size (should be < 10MB for web)
- Verify file is in `/public` folder
- Check browser console for errors

### **Domain Shows "Invalid Configuration"?**
- Double-check DNS records match Vercel exactly
- Ensure TTL is set (3600 recommended)
- Wait for DNS propagation

---

## ✅ **Success Checklist**

- [ ] Code pushed to GitHub
- [ ] Site deployed to Vercel
- [ ] Preview URL works (`*.vercel.app`)
- [ ] Environment variables added
- [ ] DNS records updated in Wix
- [ ] Domain connected in Vercel
- [ ] Custom domain works (`winehavendunlaoghaire.com`)
- [ ] HTTPS enabled (automatic)
- [ ] Video optimized (optional but recommended)

---

## 🎉 **You're Live!**

Your site is now:
- ✅ Hosted on Vercel (fast, global CDN)
- ✅ Using your custom domain
- ✅ Secure (HTTPS)
- ✅ Auto-deploying on every Git push

**Next:** Share your site with the client and gather feedback!

---

## 📚 **Resources**

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [DNS Troubleshooting](https://vercel.com/docs/concepts/projects/domains/troubleshooting)

