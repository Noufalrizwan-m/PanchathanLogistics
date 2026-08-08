module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        titillium: ['"Titillium Web"', 'sans-serif'],
      },
      colors: {
        brand: {
          green: '#175d29',
          amber: '#f5a623',
          amberDark: '#d4890f',
        },
      },
      screens: {
        '3xl': '1920px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(23,93,41,0.12)',
        'glass-lg': '0 20px 60px rgba(23,93,41,0.18)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      },
    },
  },
  plugins: [],
};
