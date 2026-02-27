export { default } from "next-auth/middleware"

export const config = { 
  matcher: [
    "/simulate/:path*", 
    "/compare/:path*", 
    "/dashboard/:path*"
  ] 
}
