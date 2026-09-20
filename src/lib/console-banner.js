// Recon starts at the front end. Nothing here is secret; it is a nod to
// whoever opens devtools. The flag is base64 in /humans.txt on purpose.
export function printConsoleBanner() {
  const art = String.raw`
 _   _       ____                       _         _     _
| | | |_ __ | __ ) _ __ ___  __ _  ___| | ____ _| |__ | | ___
| | | | '_ \|  _ \| '__/ _ \/ _' |/ __| |/ / _' | '_ \| |/ _ \
| |_| | | | | |_) | | |  __/ (_| | (__|   < (_| | |_) | |  __/
 \___/|_| |_|____/|_|  \___|\__,_|\___|_|\_\__,_|_.__/|_|\___|
`;
  console.log(
    `%c${art}`,
    "color:#a3ff12;font-family:monospace;font-weight:700",
  );
  console.log(
    "%cCurioso? Recon começa no front-end.%c\nProcure em /humans.txt — tem um flag esperando (UNB{...}).",
    "color:#b27cff;font:600 13px monospace",
    "color:#aab7ad;font:12px monospace",
  );
}
