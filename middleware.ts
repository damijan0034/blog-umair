import { NextResponse } from "next/server"
import { authMiddleware } from "./middlewares/api/authMiddleware"
import { loggMiddleware } from "./middlewares/api/logMiddleware"

export const config = {
    matcher: "/api/:path*"
}

export default function middleware(request: Request) {

    if(request.url.includes("/api/blogs")){
        const logResult=loggMiddleware(request)
        console.log(logResult.response)
    }

    const authResult = authMiddleware(request)

    if (!authResult?.isValid) {
        return new NextResponse(JSON.stringify({ message: "Unauthorized" }),
            { status: 401 }
        )
    }

    return NextResponse.next()
}