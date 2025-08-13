import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
    {
        name: 'reactApp',
        entry: 'http://localhost:3000',
        container: '#container',
        activeRule: '/react',
    },
    {
        name: 'vueApp',
        entry: 'http://localhost:5173',
        container: '#container',
        activeRule: '/vue',
    }
])

start();