import React from 'react';
import { Smartphone, ExternalLink } from 'lucide-react';

export default function PWABanner() {
  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-indigo-600 text-white"><Smartphone size={18}/></div>
        <div>
          <h2 className="text-lg font-semibold">Ready for Android PWA</h2>
          <p className="text-sm text-gray-700 mt-1">This page demonstrates stable audio fallbacks and gives you a permanent URL strategy suitable for PWABuilder. Once you deploy to your own domain, that link will be permanent.</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a href="https://www.pwabuilder.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 hover:bg-gray-50">
              Open PWABuilder <ExternalLink size={14}/>
            </a>
            <a href="https://docs.pwabuilder.com/#/builder/publish-pwa" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border px-3 py-1.5 hover:bg-gray-50">
              Publishing Guide <ExternalLink size={14}/>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
