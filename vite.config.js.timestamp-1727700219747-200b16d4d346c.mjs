// vite.config.js
import { defineConfig } from "file:///C:/Develop/Tefora/indoor/Paatha-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Develop/Tefora/indoor/Paatha-frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///C:/Develop/Tefora/indoor/Paatha-frontend/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Paatha : College Indoor",
        short_name: "Paatha",
        description: "The Indoor map Of Govt.Medical College Kozhikode",
        background_color: "#FFFFFF",
        theme_color: "#FFFFFF",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["@headlessui/react"],
    include: ["react-dom"],
  },
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxEZXZlbG9wXFxcXFRlZm9yYVxcXFxpbmRvb3JcXFxcUGFhdGhhLWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxEZXZlbG9wXFxcXFRlZm9yYVxcXFxpbmRvb3JcXFxcUGFhdGhhLWZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9EZXZlbG9wL1RlZm9yYS9pbmRvb3IvUGFhdGhhLWZyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKSxcclxuICAgIFZpdGVQV0EoeyByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcclxuICAgIG1hbmlmZXN0OiB7XHJcbiAgICAgIFwibmFtZVwiOiBcIlBhYXRoYSA6IENvbGxlZ2UgSW5kb29yXCIsXHJcbiAgICAgIFwic2hvcnRfbmFtZVwiOiBcIlBhYXRoYVwiLFxyXG4gICAgICBcImRlc2NyaXB0aW9uXCI6IFwiVGhlIEluZG9vciBtYXAgT2YgR292dC5NZWRpY2FsIENvbGxlZ2UgS296aGlrb2RlXCIsXHJcbiAgICAgIFwiYmFja2dyb3VuZF9jb2xvclwiOiBcIiNGRkZGRkZcIixcclxuICAgICAgXCJ0aGVtZV9jb2xvclwiOiBcIiNGRkZGRkZcIixcclxuICAgICAgaWNvbnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcInNyY1wiOiBcIi9wd2EtMTkyeDE5Mi5wbmdcIixcclxuICAgICAgICAgIFwic2l6ZXNcIjogXCIxOTJ4MTkyXCIsXHJcbiAgICAgICAgICBcInR5cGVcIjogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgIFwicHVycG9zZVwiOiBcImFueVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcInNyY1wiOiBcIi9wd2EtNTEyeDUxMi5wbmdcIixcclxuICAgICAgICAgIFwic2l6ZXNcIjogXCI1MTJ4NTEyXCIsXHJcbiAgICAgICAgICBcInR5cGVcIjogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgIFwicHVycG9zZVwiOiBcImFueVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcInNyY1wiOiBcIi9wd2EtbWFza2FibGUtMTkyeDE5Mi5wbmdcIixcclxuICAgICAgICAgIFwic2l6ZXNcIjogXCIxOTJ4MTkyXCIsXHJcbiAgICAgICAgICBcInR5cGVcIjogXCJpbWFnZS9wbmdcIixcclxuICAgICAgICAgIFwicHVycG9zZVwiOiBcIm1hc2thYmxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwic3JjXCI6IFwiL3B3YS1tYXNrYWJsZS01MTJ4NTEyLnBuZ1wiLFxyXG4gICAgICAgICAgXCJzaXplc1wiOiBcIjUxMng1MTJcIixcclxuICAgICAgICAgIFwidHlwZVwiOiBcImltYWdlL3BuZ1wiLFxyXG4gICAgICAgICAgXCJwdXJwb3NlXCI6IFwibWFza2FibGVcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgXSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGV4Y2x1ZGU6IFsnQGhlYWRsZXNzdWkvcmVhY3QnXSxcclxuICAgIGluY2x1ZGU6IFsncmVhY3QtZG9tJ10sXHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9ULFNBQVMsb0JBQW9CO0FBQ2pWLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFHeEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQUMsTUFBTTtBQUFBLElBQ2QsUUFBUTtBQUFBLE1BQUUsY0FBYztBQUFBLE1BQ3hCLFVBQVU7QUFBQSxRQUNSLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxRQUNmLG9CQUFvQjtBQUFBLFFBQ3BCLGVBQWU7QUFBQSxRQUNmLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxPQUFPO0FBQUEsWUFDUCxTQUFTO0FBQUEsWUFDVCxRQUFRO0FBQUEsWUFDUixXQUFXO0FBQUEsVUFDYjtBQUFBLFVBQ0E7QUFBQSxZQUNFLE9BQU87QUFBQSxZQUNQLFNBQVM7QUFBQSxZQUNULFFBQVE7QUFBQSxZQUNSLFdBQVc7QUFBQSxVQUNiO0FBQUEsVUFDQTtBQUFBLFlBQ0UsT0FBTztBQUFBLFlBQ1AsU0FBUztBQUFBLFlBQ1QsUUFBUTtBQUFBLFlBQ1IsV0FBVztBQUFBLFVBQ2I7QUFBQSxVQUNBO0FBQUEsWUFDRSxPQUFPO0FBQUEsWUFDUCxTQUFTO0FBQUEsWUFDVCxRQUFRO0FBQUEsWUFDUixXQUFXO0FBQUEsVUFDYjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDRDtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLG1CQUFtQjtBQUFBLElBQzdCLFNBQVMsQ0FBQyxXQUFXO0FBQUEsRUFDdkI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
