// vite.config.ts
import react from "file:///C:/Users/mijsters/Documents/LNCOai/apps/survey-pages-lnco-ai-app/survey-pages-lnco-ai-app/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { resolve } from "path";
import { defineConfig, loadEnv } from "file:///C:/Users/mijsters/Documents/LNCOai/apps/survey-pages-lnco-ai-app/survey-pages-lnco-ai-app/node_modules/vite/dist/node/index.js";
import checker from "file:///C:/Users/mijsters/Documents/LNCOai/apps/survey-pages-lnco-ai-app/survey-pages-lnco-ai-app/node_modules/vite-plugin-checker/dist/esm/main.js";
import istanbul from "file:///C:/Users/mijsters/Documents/LNCOai/apps/survey-pages-lnco-ai-app/survey-pages-lnco-ai-app/node_modules/vite-plugin-istanbul/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\mijsters\\Documents\\LNCOai\\apps\\survey-pages-lnco-ai-app\\survey-pages-lnco-ai-app";
var vite_config_default = ({ mode }) => {
  process.env = {
    VITE_VERSION: "default",
    VITE_BUILD_TIMESTAMP: (/* @__PURE__ */ new Date()).toISOString(),
    ...process.env,
    ...loadEnv(mode, process.cwd())
  };
  return defineConfig({
    base: "",
    server: {
      port: parseInt(process.env.VITE_PORT, 10) || 4001,
      open: mode !== "test",
      // open only when mode is different from test
      watch: {
        ignored: ["**/coverage/**", "**/cypress/downloads/**"]
      }
    },
    preview: {
      port: parseInt(process.env.VITE_PORT || "3333", 10),
      strictPort: true
    },
    build: {
      outDir: "build"
    },
    plugins: [
      mode === "test" ? void 0 : checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "src/**/*.{ts,tsx}"',
          useFlatConfig: true
        }
      }),
      react(),
      istanbul({
        include: "src/*",
        exclude: ["node_modules", "test/", ".nyc_output", "coverage"],
        extension: [".js", ".ts", ".tsx"],
        requireEnv: false,
        forceBuildInstrument: mode === "test",
        checkProd: true
      })
    ],
    resolve: {
      alias: {
        "@": resolve(__vite_injected_original_dirname, "src")
      }
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtaWpzdGVyc1xcXFxEb2N1bWVudHNcXFxcTE5DT2FpXFxcXGFwcHNcXFxcc3VydmV5LXBhZ2VzLWxuY28tYWktYXBwXFxcXHN1cnZleS1wYWdlcy1sbmNvLWFpLWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbWlqc3RlcnNcXFxcRG9jdW1lbnRzXFxcXExOQ09haVxcXFxhcHBzXFxcXHN1cnZleS1wYWdlcy1sbmNvLWFpLWFwcFxcXFxzdXJ2ZXktcGFnZXMtbG5jby1haS1hcHBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL21panN0ZXJzL0RvY3VtZW50cy9MTkNPYWkvYXBwcy9zdXJ2ZXktcGFnZXMtbG5jby1haS1hcHAvc3VydmV5LXBhZ2VzLWxuY28tYWktYXBwL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCIuL3NyYy9lbnZcIi8+XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgVXNlckNvbmZpZ0V4cG9ydCwgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgY2hlY2tlciBmcm9tICd2aXRlLXBsdWdpbi1jaGVja2VyJztcbmltcG9ydCBpc3RhbmJ1bCBmcm9tICd2aXRlLXBsdWdpbi1pc3RhbmJ1bCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH06IHsgbW9kZTogc3RyaW5nIH0pOiBVc2VyQ29uZmlnRXhwb3J0ID0+IHtcbiAgcHJvY2Vzcy5lbnYgPSB7XG4gICAgVklURV9WRVJTSU9OOiAnZGVmYXVsdCcsXG4gICAgVklURV9CVUlMRF9USU1FU1RBTVA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAuLi5wcm9jZXNzLmVudixcbiAgICAuLi5sb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpLFxuICB9O1xuXG4gIHJldHVybiBkZWZpbmVDb25maWcoe1xuICAgIGJhc2U6ICcnLFxuICAgIHNlcnZlcjoge1xuICAgICAgcG9ydDogcGFyc2VJbnQocHJvY2Vzcy5lbnYuVklURV9QT1JULCAxMCkgfHwgNDAwMSxcbiAgICAgIG9wZW46IG1vZGUgIT09ICd0ZXN0JywgLy8gb3BlbiBvbmx5IHdoZW4gbW9kZSBpcyBkaWZmZXJlbnQgZnJvbSB0ZXN0XG4gICAgICB3YXRjaDoge1xuICAgICAgICBpZ25vcmVkOiBbJyoqL2NvdmVyYWdlLyoqJywgJyoqL2N5cHJlc3MvZG93bmxvYWRzLyoqJ10sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcHJldmlldzoge1xuICAgICAgcG9ydDogcGFyc2VJbnQocHJvY2Vzcy5lbnYuVklURV9QT1JUIHx8ICczMzMzJywgMTApLFxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBvdXREaXI6ICdidWlsZCcsXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICBtb2RlID09PSAndGVzdCdcbiAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgOiBjaGVja2VyKHtcbiAgICAgICAgICAgIHR5cGVzY3JpcHQ6IHRydWUsXG4gICAgICAgICAgICBlc2xpbnQ6IHtcbiAgICAgICAgICAgICAgbGludENvbW1hbmQ6ICdlc2xpbnQgXCJzcmMvKiovKi57dHMsdHN4fVwiJyxcbiAgICAgICAgICAgICAgdXNlRmxhdENvbmZpZzogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSksXG4gICAgICByZWFjdCgpLFxuICAgICAgaXN0YW5idWwoe1xuICAgICAgICBpbmNsdWRlOiAnc3JjLyonLFxuICAgICAgICBleGNsdWRlOiBbJ25vZGVfbW9kdWxlcycsICd0ZXN0LycsICcubnljX291dHB1dCcsICdjb3ZlcmFnZSddLFxuICAgICAgICBleHRlbnNpb246IFsnLmpzJywgJy50cycsICcudHN4J10sXG4gICAgICAgIHJlcXVpcmVFbnY6IGZhbHNlLFxuICAgICAgICBmb3JjZUJ1aWxkSW5zdHJ1bWVudDogbW9kZSA9PT0gJ3Rlc3QnLFxuICAgICAgICBjaGVja1Byb2Q6IHRydWUsXG4gICAgICB9KSxcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFDeEIsU0FBMkIsY0FBYyxlQUFlO0FBQ3hELE9BQU8sYUFBYTtBQUNwQixPQUFPLGNBQWM7QUFMckIsSUFBTSxtQ0FBbUM7QUFRekMsSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUEwQztBQUMvRCxVQUFRLE1BQU07QUFBQSxJQUNaLGNBQWM7QUFBQSxJQUNkLHVCQUFzQixvQkFBSSxLQUFLLEdBQUUsWUFBWTtBQUFBLElBQzdDLEdBQUcsUUFBUTtBQUFBLElBQ1gsR0FBRyxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUM7QUFBQSxFQUNoQztBQUVBLFNBQU8sYUFBYTtBQUFBLElBQ2xCLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxNQUNOLE1BQU0sU0FBUyxRQUFRLElBQUksV0FBVyxFQUFFLEtBQUs7QUFBQSxNQUM3QyxNQUFNLFNBQVM7QUFBQTtBQUFBLE1BQ2YsT0FBTztBQUFBLFFBQ0wsU0FBUyxDQUFDLGtCQUFrQix5QkFBeUI7QUFBQSxNQUN2RDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU0sU0FBUyxRQUFRLElBQUksYUFBYSxRQUFRLEVBQUU7QUFBQSxNQUNsRCxZQUFZO0FBQUEsSUFDZDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFNBQVMsU0FDTCxTQUNBLFFBQVE7QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLFFBQVE7QUFBQSxVQUNOLGFBQWE7QUFBQSxVQUNiLGVBQWU7QUFBQSxRQUNqQjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0wsTUFBTTtBQUFBLE1BQ04sU0FBUztBQUFBLFFBQ1AsU0FBUztBQUFBLFFBQ1QsU0FBUyxDQUFDLGdCQUFnQixTQUFTLGVBQWUsVUFBVTtBQUFBLFFBQzVELFdBQVcsQ0FBQyxPQUFPLE9BQU8sTUFBTTtBQUFBLFFBQ2hDLFlBQVk7QUFBQSxRQUNaLHNCQUFzQixTQUFTO0FBQUEsUUFDL0IsV0FBVztBQUFBLE1BQ2IsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsTUFDL0I7QUFBQSxJQUNGO0FBQUEsRUFDRixDQUFDO0FBQ0g7IiwKICAibmFtZXMiOiBbXQp9Cg==
