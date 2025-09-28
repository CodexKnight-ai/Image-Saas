import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/home", "/login", "/register"])
const isPublicApi = createRouteMatcher(["/api/videos"])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();
    const currentUrl = new URL(req.url)
    const isHomePage = currentUrl.pathname === "/home"
    const isApiReq = currentUrl.pathname.startsWith("/api")

    if(userId && isPublicRoute(req) && !isHomePage){
        return NextResponse.redirect(new URL("/home", req.url))
    }

    if(!userId){
        if(!isPublicRoute(req) && !isPublicApi(req)){
            return NextResponse.redirect(new URL("/login", req.url))
        }
        if(isApiReq && !isPublicApi(req)){
            return NextResponse.redirect(new URL("/login", req.url))
        }
    }
    return NextResponse.next()
})

export const config = {
    matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
