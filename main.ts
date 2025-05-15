import "dotenv/load";
import { homeTemplate, loginTemplate } from "templates";

const ADMIN_USERNAME = Deno.env.get("PROXY_USERNAME") || "admin";
const ADMIN_PASSWORD = Deno.env.get("PROXY_PASSWORD") || "admin";
const SESSION_KEY = ["sessions"];

let SERVER_HOST = Deno.env.get("SERVER_HOST");

console.log("USERNAME", ADMIN_USERNAME);

console.log("PASSWORD", ADMIN_PASSWORD);

interface ProxyRoute {
  path: string;
  target: string;
}

function generateRoutesTable(routes: ProxyRoute[]): string {
  if (!routes.length) {
    return '<tr><td colspan="4">No routes configured</td></tr>';
  }

  const serverHost = SERVER_HOST;

  return routes
    .map(
      (route) => `
        <tr>
            <td>${route.path}</td>
            <td><a href="${route.target}" target="_blank">${route.target}</a></td>
            <td><a href="${serverHost}${route.path}" target="_blank">${serverHost}${route.path}</a></td>
            <td class="actions">
                <button onclick="editRoute('${route.path}', '${route.target}')" class="btn btn-edit">Edit</button>
                <form action="/routes/delete" method="POST" style="display: inline">
                    <input type="hidden" name="path" value="${route.path}">
                    <button type="submit" class="btn btn-delete">Delete</button>
                </form>
            </td>
        </tr>
    `
    )
    .join("");
}

// auth user login fn
async function verifySession(req: Request): Promise<boolean> {
  const sessionId = getCookie(req, "session");
  if (!sessionId) return false;
  const session = await kv.get([...SESSION_KEY, sessionId]);
  return !!session.value;
}

function getCookie(req: Request, name: string): string | null {
  const cookies = req.headers.get("cookie");
  if (!cookies) return null;
  const match = cookies.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

function validatePath(path: string): { valid: boolean; error?: string } {
  if (!path.startsWith("/")) {
    return { valid: false, error: "Path must start with /" };
  }

  if (path === "/") {
    return { valid: false, error: "Path cannot be just /" };
  }

  if (!/^\/[a-zA-Z0-9\-_\/]+$/.test(path)) {
    return {
      valid: false,
      error: "Path can only contain letters, numbers, hyphens, and underscores",
    };
  }

  return { valid: true };
}

const kv = await Deno.openKv();

const ROUTES_KEY = ["ProxyRoutes"];

Deno.serve(async (req) => {
  const url = new URL(req.url);
  SERVER_HOST = url.origin;


  if (url.pathname === "/" || url.pathname === "") {
    if (!(await verifySession(req))) {
      return new Response("", {
        status: 302,
        headers: { Location: "/login" },
      });
    }

    const result = await kv.get<ProxyRoute[]>(ROUTES_KEY);
    const routes: ProxyRoute[] = result.value || [];
    //is logged in now
    return new Response(
      homeTemplate.replace("{{routesRows}}", generateRoutesTable(routes)),
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  /* ------------------------------ handle login ------------------------------ */
  if (url.pathname === "/login") {
    if (req.method === "GET") {
      return new Response(loginTemplate, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (req.method === "POST") {
      const formData = await req.formData();
      const username = formData.get("username");
      const password = formData.get("password");
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

        const sessionId = crypto.randomUUID();

        await kv.set([...SESSION_KEY, sessionId], true, {
          expireIn: 24 * 60 * 60 * 1000,
        });

        return new Response("", {
          status: 302,
          headers: {
            Location: "/",
            "Set-Cookie": `session=${sessionId}; Path=/; HttpOnly`,
          },
        });
      }

      return new Response(
        loginTemplate.replace(
          "</form>",
          '<div class="error">Invalid credentials</div></form>'
        ),
        {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }
  }

  /* ------------------------------- end logoin ------------------------------- */

  /* ---------------------------- add proxy routes ---------------------------- */
  if (url.pathname === "/routes/add" && req.method === "POST") {
    if (!(await verifySession(req))) {
      return new Response("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const path = formData.get("path") as string;
    const target = formData.get("target") as string;


    // add check if target contains SERVER_HOST
    if (target.includes(SERVER_HOST)) {
      return new Response(
          homeTemplate
            .replace("{{routesRows}}", target)
            .replace(
              "</form>",
              '<div class="error">It is not allowed !</div></form>'
            ),
          {
            status: 400,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          }
        );
    }

    const result = await kv.get<ProxyRoute[]>(ROUTES_KEY);
    const routes: ProxyRoute[] = result.value || [];

    const pathValidation = validatePath(path);

    if (!pathValidation.valid) {
      return new Response(
        homeTemplate
          .replace("{{routesRows}}", generateRoutesTable(routes))
          .replace(
            "</form>",
            `<div class="error">${pathValidation.error}</div></form>`
          ),
        {
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    try {
      new URL(target);

      if (routes.some((route) => route.path === path)) {
        return new Response(
          homeTemplate
            .replace("{{routesRows}}", generateRoutesTable(routes))
            .replace(
              "</form>",
              '<div class="error">Path already exists!</div></form>'
            ),
          {
            status: 400,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          }
        );
      }

      routes.push({ path, target });

      await kv.set(ROUTES_KEY, routes);

      return new Response("", {
        status: 302,
        headers: { Location: "/" },
      });
    } catch {
      return new Response("Invalid URL", { status: 400 });
    }
  }

  /* ------------------------------ delete routes ----------------------------- */

  if (url.pathname === "/routes/delete" && req.method === "POST") {
    if (!(await verifySession(req))) {
      return new Response("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const pathToDelete = formData.get("path") as string;

    const result = await kv.get<ProxyRoute[]>(ROUTES_KEY);
    const routes: ProxyRoute[] = result.value || [];
    const newRoutes = routes.filter((route) => route.path !== pathToDelete);
    await kv.set(ROUTES_KEY, newRoutes);

    return new Response("", {
      status: 302,
      headers: { Location: "/" },
    });
  }

  /* ------------------------------ edit routes ------------------------------ */

  if (url.pathname === "/routes/edit" && req.method === "POST") {
    if (!(await verifySession(req))) {
      return new Response("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const originalPath = formData.get("originalPath") as string;
    const newPath = formData.get("path") as string;
    const newTarget = formData.get("target") as string;

    const result = await kv.get<ProxyRoute[]>(ROUTES_KEY);
    const routes: ProxyRoute[] = result.value || [];

    const pathValidation = validatePath(newPath);
    if (!pathValidation.valid) {
      return new Response(
        homeTemplate
          .replace("{{routesRows}}", generateRoutesTable(routes))
          .replace(
            "</form>",
            `<div class="error">${pathValidation.error}</div></form>`
          ),
        {
          status: 400,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    try {
      new URL(newTarget); // Validate URL
      const result = await kv.get<ProxyRoute[]>(ROUTES_KEY);
      const routes: ProxyRoute[] = result.value || [];

      // Check if new path already exists (unless it's the same as original path)
      if (
        newPath !== originalPath &&
        routes.some((route) => route.path === newPath)
      ) {
        return new Response(
          homeTemplate
            .replace("{{routesRows}}", generateRoutesTable(routes))
            .replace(
              "</form>",
              '<div class="error">Path already exists!</div></form>'
            ),
          {
            status: 400,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          }
        );
      }

      const updatedRoutes = routes.map((route) =>
        route.path === originalPath
          ? { path: newPath, target: newTarget }
          : route
      );

      await kv.set(ROUTES_KEY, updatedRoutes);

      return new Response("", {
        status: 302,
        headers: { Location: "/" },
      });
    } catch {
      return new Response("Invalid URL", { status: 400 });
    }
  }

  /* --------------------------------- logout --------------------------------- */
  if (url.pathname === "/logout") {
    const sessionId = getCookie(req, "session");
    if (sessionId) {
      await kv.delete([...SESSION_KEY, sessionId]);
    }
    return new Response("", {
      status: 302,
      headers: {
        Location: "/login",
        "Set-Cookie": "session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      },
    });
  }

  /* ---------------------------- load static files --------------------------- */

  if (url.pathname.startsWith("/static/")) {
    try {
      const filePath = `.${url.pathname}`;
      const content = await Deno.readFile(filePath);
      const mimeType = url.pathname.endsWith(".ico")
        ? "image/x-icon"
        : "application/octet-stream";

      return new Response(content, {
        headers: {
          "Content-Type": mimeType,
          "Cache-Control": "public, max-age=604800", //一周
        },
      });
    } catch {
      return new Response("File not found", { status: 404 });
    }
  }

  const adminPaths = [
    "/login",
    "/",
    "/routes/add",
    "/routes/edit",
    "/routes/delete",
    "/logout",
  ];
  if (!adminPaths.includes(url.pathname)) {
    const result = await kv.get<ProxyRoute[]>(ROUTES_KEY);
    const routes: ProxyRoute[] = result.value || [];

    const matchingRoute = routes.find((route) =>
      url.pathname.startsWith(route.path)
    );

    if (!matchingRoute) {
      return new Response("No matching proxy route found.", { status: 404 });
    }

    const remainingPath = url.pathname.slice(matchingRoute.path.length);

    try {
      const finalUrl = new URL(
        remainingPath + url.search,
        matchingRoute.target
      ).toString();
      console.log("Proxying request to:", finalUrl);

      const newHeaders = new Headers();
      for (const [key, value] of req.headers.entries()) {
        if (!["host", "origin", "referer"].includes(key.toLowerCase())) {
          newHeaders.set(key, value);
        }
      }

      newHeaders.set("Host", new URL(matchingRoute.target).host);

      const proxyResponse = await fetch(finalUrl, {
        method: req.method,
        headers: newHeaders,
        body: req.body,
        // redirect: "follow",
      });

      if (proxyResponse.redirected) {
        console.log("Request was redirected to:", proxyResponse.url);
      }

      const responseHeaders = new Headers();

      responseHeaders.set("Access-Control-Allow-Origin", "*");
      responseHeaders.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      responseHeaders.set("Access-Control-Allow-Headers", "*");

      // 如果是文本内容，确保设置正确的字符编码
      // const contentType = proxyResponse.headers.get("content-type");
      // if (contentType && contentType.includes("text")) {
      //   responseHeaders.set("Content-Type", `${contentType}; charset=utf-8`);
      // } else {
      // }
      responseHeaders.set("Content-Type", "application/json; charset=utf-8");
      
      const proxyJSON = await proxyResponse.json();
      

      return new Response(proxyJSON, {
        status: proxyResponse.status,
        statusText: proxyResponse.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      console.error("Proxy error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return new Response("Failed to proxy request: " + errorMessage, {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }

  return new Response("Not Found", {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
});
