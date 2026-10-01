import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'node:path'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        symbolId: 'icon-[name]'
      }),
      viteMockServe({
        mockPath: 'src/mock',
        deep: true,
        localEnabled: command === 'serve',
        prodEnabled: false,
        supportTs: true
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          additionalData: `@use "@/styles/variable.scss" as *;\n@use "@/styles/mixin.scss" as *;`
        }
      }
    },
    server: {
      host: true,
      port: 5173
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            echarts: ['echarts'],
            'element-plus': ['element-plus', '@element-plus/icons-vue']
          }
        }
      }
    }
  }
})
