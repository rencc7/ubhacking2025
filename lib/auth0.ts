import { Auth0Client } from "@auth0/nextjs-auth0/server";

// Read config from environment
const {
	AUTH0_DOMAIN,
	AUTH0_CLIENT_ID,
	AUTH0_CLIENT_SECRET,
	AUTH0_SECRET,
	APP_BASE_URL,
} = process.env;

function _missingEnvMessage(missing: string[]) {
	return `Auth0 is not configured. Missing environment variables: ${missing.join(", ")}.\n` +
		`Set these in your environment or .env.local and restart. Required: AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_SECRET, APP_BASE_URL.`;
}

let auth0: any;

const required = [
	['AUTH0_DOMAIN', AUTH0_DOMAIN],
	['APP_BASE_URL', APP_BASE_URL],
	['AUTH0_CLIENT_ID', AUTH0_CLIENT_ID],
	['AUTH0_CLIENT_SECRET', AUTH0_CLIENT_SECRET],
	['AUTH0_SECRET', AUTH0_SECRET],
];

const missing: string[] = required.filter(([, val]) => !val).map(([name]) => String(name));

if (missing.length === 0) {
	// All required env vars present — create real Auth0Client
	auth0 = new Auth0Client({
		domain: AUTH0_DOMAIN!,
		clientId: AUTH0_CLIENT_ID!,
		clientSecret: AUTH0_CLIENT_SECRET!,
		secret: AUTH0_SECRET!,
		appBaseUrl: APP_BASE_URL!,
	});
} else {
	// Don't attempt to instantiate the real client (it logs warnings). Export a lightweight stub
	const msg = _missingEnvMessage(missing);
	// Log once so developer sees guidance in server logs
	// eslint-disable-next-line no-console
	console.warn("Auth0Client not created:", msg);

	// Stub implementation: async methods that return a Response with a helpful error message
	auth0 = {
		async startInteractiveLogin(_opts?: any) {
			return new Response(msg, { status: 500 });
		},
		async handleLogout(_req?: any) {
			return new Response(msg, { status: 500 });
		},
		async handleCallback(_req?: any, _opts?: any) {
			return new Response(msg, { status: 500 });
		},
		// keep a safe isStub flag for callers/tests
		__isStub: true,
	};
}

export { auth0 };
export default auth0;
