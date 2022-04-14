import {defineConfig, loadEnv} from 'vite'
import viteSvgIcons from 'vite-plugin-svg-icons'
import path from 'path'
import vue from '@vitejs/plugin-vue'

const version = (new Date()).getTime()

// https://vitejs.dev/config/
export default ({mode}) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())}

    return defineConfig({
        publicDir: process.env.VITE_PUBLIC_DIR,
        // alias: {
        //     // 键必须以斜线开始和结束
        //     '/@/': path.resolve(__dirname, './src')
        //     // '/@components/': path.resolve(__dirname, './src/components')
        // },
        // proxy: {
        //     // 如果是 /lsbdb 打头，则访问地址如下
        //     '/lsbdb': process.env.VITE_PUBLIC_DIR,
        // },
        plugins: [
            vue(),
            viteSvgIcons({
                // Specify the icon folder to be cached
                iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
                // Specify symbolId format
                // symbolId: 'icon-[dir]-[name]',
                symbolId: '[name]',
            }),
        ],
        build: {
            chunkSizeWarningLimit: 500,
            rollupOptions: {
                output: {
                    entryFileNames: `assets/[name].${version}.js`,
                    chunkFileNames: `assets/[name].${version}.js`,
                    assetFileNames: `assets/[name].${version}.[ext]`
                }
            }
        }
    })
}
