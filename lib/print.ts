export function printHTML(html: string, title = "Cammada"): void {
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed; top:-9999px; left:-9999px; width:1px; height:1px; border:none; opacity:0;";
  document.body.appendChild(iframe);

  const iframeDoc =
    iframe.contentDocument ?? iframe.contentWindow?.document ?? null;

  if (!iframeDoc) {
    document.body.removeChild(iframe);
    console.error(
      "[print] No se pudo acceder al documento del iframe. " +
        "Verificá que el contexto sea seguro (HTTPS o localhost).",
    );
    return;
  }

  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();
  iframeDoc.title = title;

  const iframeWin = iframe.contentWindow;
  if (!iframeWin) {
    document.body.removeChild(iframe);
    return;
  }

  setTimeout(() => {
    iframeWin.focus();
    iframeWin.print();
    iframeWin.addEventListener("afterprint", () => {
      document.body.removeChild(iframe);
    });
  }, 300);
}
