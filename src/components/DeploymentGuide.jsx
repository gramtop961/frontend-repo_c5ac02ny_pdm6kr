import React from 'react';
import { Link as LinkIcon, Cloud, ShieldCheck } from 'lucide-react';

export default function DeploymentGuide() {
  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold flex items-center gap-2"><Cloud size={18}/> Deployment & Permanent Audio URLs</h2>

      <ol className="mt-4 space-y-4 text-sm text-gray-700 list-decimal pl-5">
        <li>
          Create a public GitHub repository named for your audio assets, e.g., <code>yn-audio</code>.
        </li>
        <li>
          Add your MP3 files under folders (letters/, vocab/, sentences/). Commit & push.
        </li>
        <li>
          Permanent CDN link via jsDelivr:
          <div className="mt-2 rounded-md bg-gray-50 p-2 font-mono text-xs overflow-x-auto">https://cdn.jsdelivr.net/gh/USERNAME/yn-audio/main/vocab/apple.mp3</div>
          - Fast, global, versionable (pin to a tag for immutable URL)
        </li>
        <li>
          Optional mirror link (GitHub Raw as fallback):
          <div className="mt-2 rounded-md bg-gray-50 p-2 font-mono text-xs overflow-x-auto">https://raw.githubusercontent.com/USERNAME/yn-audio/main/vocab/apple.mp3</div>
        </li>
        <li>
          In your app, store both URLs and try primary → mirror → TTS, just like the tester component above.
        </li>
        <li>
          Deploy your PWA build to a stable host (Netlify, Vercel, or GitHub Pages). The URL will be permanent and HTTPS.
        </li>
        <li>
          For Android via PWABuilder: point it to your deployed HTTPS domain and generate the Android package.
        </li>
      </ol>

      <div className="mt-6 rounded-lg border bg-gradient-to-r from-emerald-50 to-green-50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="text-emerald-600" size={20} />
          <div>
            <div className="font-medium">Immutable, always-available URLs</div>
            <p className="text-sm text-gray-700 mt-1">Pin to a git tag to make links immutable:</p>
            <div className="mt-2 rounded-md bg-white p-2 font-mono text-xs overflow-x-auto border">https://cdn.jsdelivr.net/gh/USERNAME/yn-audio@v1.0.0/vocab/apple.mp3</div>
            <p className="text-sm text-gray-700 mt-2">When you update audio, publish a new tag (v1.0.1). Your app can safely rely on the pinned version or move to the latest.</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-sm flex items-center gap-2"><LinkIcon size={16}/> Recommended CDN patterns</h3>
        <ul className="mt-2 text-sm text-gray-700 list-disc pl-5 space-y-1">
          <li>jsDelivr: https://cdn.jsdelivr.net/gh/USER/REPO@TAG/path/file.mp3</li>
          <li>Cloudflare R2 public bucket: https://cdn.YOURDOMAIN.com/path/file.mp3</li>
          <li>Backblaze B2 public URL: https://f00.backblazeb2.com/file/BUCKET/path/file.mp3</li>
        </ul>
      </div>
    </section>
  );
}
