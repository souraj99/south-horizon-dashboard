import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function htaccessPlugin(baseUrl = "/"): import("vite").PluginOption {
  if (!baseUrl.endsWith("/")) baseUrl += "/";
  return {
    name: "generate-htaccess",
    apply: "build",
    closeBundle() {
      const htaccessContent = `
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase ${baseUrl}
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . ${baseUrl}index.html [L]
</IfModule>
      `.trim();
      const outputPath = path.resolve(__dirname, "dist/.htaccess");
      fs.writeFileSync(outputPath, htaccessContent, "utf8");
      console.log("✅ .htaccess file generated at dist/.htaccess");
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const plugins = [react()];

  const htPlugin = htaccessPlugin(env.BASE_URL || "/");
  if (Array.isArray(htPlugin)) {
    htPlugin.forEach((p) => {
      if (p && typeof p === "object" && "name" in p) (plugins as any[]).push(p);
    });
  } else if (htPlugin && typeof htPlugin === "object" && "name" in htPlugin) {
    (plugins as any[]).push(htPlugin);
  }

  return {
    plugins,
    base: env.BASE_URL || "/",
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$BASE_URL: "${env.BASE_URL || "/"}";`,
        },
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: true,
        mangle: true,
        format: {
          comments: false,
        },
      },
      commonjsOptions: { transformMixedEsModules: true },
    },
  };
});
