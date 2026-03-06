"use client";

import { useEffect } from "react";

const COUNTER_ID = process.env.NEXT_PUBLIC_YM_ID;

export function YandexMetrika() {
  useEffect(() => {
    if (!COUNTER_ID) return;

    const script = document.createElement("script");
    script.innerHTML = `
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      ym(${COUNTER_ID}, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
      });
    `;
    document.head.appendChild(script);

    const noscript = document.createElement("noscript");
    noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${COUNTER_ID}" style="position:absolute; left:-9999px;" alt="" /></div>`;
    document.body.appendChild(noscript);
  }, []);

  return null;
}
