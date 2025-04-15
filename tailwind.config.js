export const content = [
  './app/**/*.{js,ts,jsx,tsx,mdx}', 
  './components/**/*.{js,ts,jsx,tsx,mdx}'
];
export const mode = 'jit';
export const theme = {
  extend: {
    textColor: {
      foreground: 'var(--foreground)',
      textbg: 'var(--text-on-bg)'
    },
    backgroundColor: {
      background: 'var(--background)'
    }
  }
};
export const plugins = [];
