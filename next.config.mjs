/** @type {import('next').NextConfig} */
const nextConfig = {
async rewrites(){
    return [{
        source:'/api/:path*',
        destination:'https://web-course-backend-seven.vercel.app/api/:path*'
    },
];
},

};

export default nextConfig;
