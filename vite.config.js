import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   server: {
//     port: 3000,
//   },
//   root: "./client",
//   plugins: [react()],
// });

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(),'') };
  return defineConfig({
    server: {
      port: parseInt(process.env.CLIENT_PORT) || 3000,
    },
    root: "./client",
    plugins: [react()],
  });
};
