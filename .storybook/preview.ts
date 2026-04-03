import type { Preview } from '@storybook/react-vite'
import '../src/styles.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      backgrounds: {
        default: 'dark',
        values: [
          { name: 'dark', value: '#020817' }, // slate-950
          { name: 'card', value: '#0f172a' }, // slate-900
          { name: 'light', value: '#f8fafc' }, // slate-50
        ],
      },
    },
  },
}

export default preview
