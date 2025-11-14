# 🎬 Video Optimization Guide

Your hero video (`7102288-hd_1920_1080_30fps.mp4`) is currently 7MB. For best performance on all devices, follow these steps.

---

## ✅ **Quick Fix: Re-encode with FFmpeg**

### **Step 1: Install FFmpeg**

**Windows:**
1. Download from: https://www.gyan.dev/ffmpeg/builds/
2. Extract to `C:\ffmpeg`
3. Add to PATH: System Properties → Environment Variables → Path → Add `C:\ffmpeg\bin`

**Verify:**
```bash
ffmpeg -version
```

---

### **Step 2: Optimize Your Video**

Run this command in your project root:

```bash
cd "E:\Wine Haven Website\wine-haven-next"

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

**What this does:**
- `scale=1280:-2` → Converts to 720p (smaller file, still looks great)
- `-b:v 1800k` → Sets bitrate to 1.8 Mbps (good quality/size balance)
- `-an` → Removes audio (saves space, you don't need it)
- `-movflags +faststart` → Enables progressive download (starts playing faster)
- `-g 15 -keyint_min 15` → Keyframe every 0.5 seconds (smooth scrubbing for scroll)
- `-preset slow -crf 23` → Better compression quality

**Expected result:** ~2-3MB file (down from 7MB)

---

### **Step 3: Update Hero Component**

Edit `src/components/home/Hero.tsx` line 101:

```tsx
// Change from:
src="/7102288-hd_1920_1080_30fps.mp4"

// To:
src="/hero-video-optimized.mp4"
```

---

### **Step 4: Test**

```bash
npm run dev
```

Visit `http://localhost:3000` and test scroll animation smoothness.

---

## 🚀 **Alternative: Use WebM (Even Smaller)**

WebM is more efficient than MP4. Create both formats:

```bash
# MP4 (for Safari/iOS)
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
  public/hero-video.mp4

# WebM (for Chrome/Firefox - smaller file)
ffmpeg -i public/7102288-hd_1920_1080_30fps.mp4 \
  -vf "scale=1280:-2" \
  -b:v 1500k \
  -an \
  -c:v libvpx-vp9 \
  -g 15 \
  -keyint_min 15 \
  public/hero-video.webm
```

Then update `Hero.tsx`:

```tsx
<video
  ref={videoRef}
  muted
  playsInline
  preload="auto"
  className="absolute inset-0 w-full h-full object-cover"
>
  <source src="/hero-video.webm" type="video/webm" />
  <source src="/hero-video.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

---

## 📊 **Performance Comparison**

| Format | Size | Load Time (3G) | Quality |
|--------|------|----------------|---------|
| Original (1080p) | 7MB | ~18s | Excellent |
| Optimized (720p) | 2-3MB | ~6s | Great |
| WebM (720p) | 1.5-2MB | ~4s | Great |

---

## ✅ **After Optimization**

1. ✅ Smaller file = faster load
2. ✅ Frequent keyframes = smooth scroll scrubbing
3. ✅ Faststart = progressive playback
4. ✅ Vercel CDN = global delivery

**Your scroll animation will be buttery smooth! 🎉**

---

## 🆘 **Troubleshooting**

**FFmpeg not found?**
- Make sure it's in your PATH
- Restart terminal after installing

**Video still laggy?**
- Check browser DevTools → Network tab (is video loading slowly?)
- Test on different devices (mobile vs desktop)
- Consider using external video hosting (Cloudflare Stream, Mux)

**File still too large?**
- Lower resolution: `scale=960:-2` (540p)
- Lower bitrate: `-b:v 1200k`
- Use WebM format (smaller than MP4)

