// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/summarizer/:path*',
        destination: 'http://127.0.0.1:8000/summarizer/:path*',
      },
    ];
  },
};
