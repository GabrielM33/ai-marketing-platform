import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/pricing", "/api/upload"]);

// Define secure routes that require service worker authentication
// These routes are only accessible with a valid SERVER_API_KEY
const isSecureRoute = createRouteMatcher(["/api/asset-processing-job"]);

// Get the server API key from environment variables
// This key is used to authenticate service worker requests
const SERVER_API_KEY = process.env.SERVER_API_KEY;

if (!SERVER_API_KEY) {
  throw new Error("SERVER_API_KEY is not set in the environment variables");
}

// Main middleware function that handles authentication and routing
export default clerkMiddleware(async (auth, request) => {
  // For secure routes (service worker endpoints), check API key authentication
  if (isSecureRoute(request)) {
    return checkServiceWorkerAuth(request);
  }

  const session = await auth();
  // Redirect unauthenticated users to login if they try to access private routes
  // Private routes are any routes not defined in isPublicRoute
  if (!session.userId && !isPublicRoute(request)) {
    return session.redirectToSignIn({ returnBackUrl: request.url });
  }

  // Allow the request to proceed
  return NextResponse.next();
});

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Skip Next.js internal routes and static files
    // Only process routes that aren't Next.js internals or static assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always process API routes
    "/(api|trpc)(.*)",
  ],
};

// Helper function to validate service worker requests
// Checks for a valid Bearer token in the Authorization header
function checkServiceWorkerAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new NextResponse(
      JSON.stringify({ error: "Missing or invalid Authorization header" }),
      { status: 401 }
    );
  }

  // Verify that the provided token matches the SERVER_API_KEY
  const token = authHeader.split(" ")[1];
  if (token !== SERVER_API_KEY) {
    return new NextResponse(JSON.stringify({ error: "Invalid API key" }), {
      status: 403,
    });
  }

  // Allow the request to proceed if authentication is successful
  return NextResponse.next();
}
