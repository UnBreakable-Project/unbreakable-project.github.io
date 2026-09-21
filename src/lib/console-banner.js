// Brand mark for whoever opens devtools. Nothing here is a puzzle or a secret.
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
}
