import { readdir, watch } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'public', 'identidade-visual');
const generatorScript = path.join(rootDir, 'scripts', 'generate-visual-identity-manifest.mjs');
const projectRoots = [
  path.join(rootDir, 'src'),
  path.join(rootDir, 'public'),
  path.join(rootDir, 'index.html'),
  path.join(rootDir, 'scripts'),
];
const watchedDirs = new Set();
let refreshTimer = null;

const isRelevantChange = (filePath) => {
  if (!filePath) return false;
  const normalized = filePath.replace(/\\/g, '/');

  const relevantPatterns = [
    '/public/identidade-visual/',
    '/scripts/generate-visual-identity-manifest.mjs',
    '/src/data/visual-identity-manifest.js',
  ];

  return relevantPatterns.some((pattern) => normalized.includes(pattern));
};

const refreshManifest = async () => {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [generatorScript], {
      cwd: rootDir,
      stdio: 'inherit',
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Manifest generator exited with code ${code}`));
      }
    });

    child.on('error', reject);
  });
};

const scheduleRefresh = (filePath) => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  refreshTimer = setTimeout(async () => {
    try {
      if (isRelevantChange(filePath)) {
        await refreshManifest();
        console.log('[site-watch] atualização relevante detectada e manifesto regenerado');
        return;
      }

      console.log('[site-watch] mudança ignorada: o Vite já recarrega o restante do site');
    } catch (error) {
      console.error('[site-watch] erro ao processar mudança no site:', error.message);
    }
  }, 200);
};

const watchDirectory = async (dirPath) => {
  if (watchedDirs.has(dirPath)) return;

  watchedDirs.add(dirPath);

  watch(dirPath, { persistent: true }, (_eventType, filename) => {
    if (!filename) return;

    const fullPath = path.join(dirPath, filename);
    scheduleRefresh(fullPath);
  });

  const entries = await new Promise((resolve, reject) => {
    readdir(dirPath, { withFileTypes: true }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });

  for (const entry of entries) {
    if (entry.isDirectory() && !['node_modules', 'dist', '.git'].includes(entry.name)) {
      const childPath = path.join(dirPath, entry.name);
      await watchDirectory(childPath);
    }
  }
};

try {
  await refreshManifest();

  for (const root of projectRoots) {
    await watchDirectory(root);
  }

  console.log('[site-watch] monitorando alterações do projeto e da identidade visual');

  process.on('SIGINT', () => process.exit(0));
  process.on('SIGTERM', () => process.exit(0));

  setInterval(() => {
    // mantém o processo vivo enquanto o Vite está rodando
  }, 1000);
} catch (error) {
  console.error('[site-watch] falha ao inicializar monitor:', error.message);
  process.exit(1);
}
