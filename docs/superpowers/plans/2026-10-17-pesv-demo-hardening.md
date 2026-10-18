# PESV Demo Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the PESV presentation demo safe, internally consistent, and automatically verifiable without adding production infrastructure.

**Architecture:** Keep Spring Security HTTP Basic and H2 in memory, but make every user-data endpoint authenticated and ownership-aware through `RouteService`. Keep the React app limited to implemented backend behavior, then prove the contract with MockMvc tests and GitHub Actions.

**Tech Stack:** Java 17, Spring Boot 3.1, Spring Security, Spring MockMvc, React 18, GitHub Actions, CodeQL.

**Spec:** `docs/superpowers/specs/2026-10-17-pesv-demo-hardening-design.md`

## Global Constraints

- Keep H2 in memory and the two Basic-auth demo accounts; this is a local presentation.
- Do not add JWT, public registration, multitenancy, PostgreSQL, deployment automation, or dependencies.
- License repository source under MIT.
- Use focused commits that describe the user-visible correction.

## Review Focus

- Missing, non-numeric, infinite, or out-of-range coordinates return 400 and do not write a route or emergency.
- A signed-in `user` account receives 403 when it targets the admin ID; an administrator retains cross-user access.
- A request without Basic credentials to a telemetry endpoint returns 401.
- An absent active route keeps the map in its empty state rather than rendering invented coordinates.
- Frontend production build succeeds without unused mock authentication code or credential logging.

---

### Task 1: Secure and validate the backend contract

**Files:**
- Modify: `backend/src/main/java/com/example/pesv/config/SecurityConfig.java`
- Modify: `backend/src/main/java/com/example/pesv/config/CorsConfig.java`
- Modify: `backend/src/main/java/com/example/pesv/DemoApplication.java`
- Modify: `backend/src/main/java/com/example/pesv/controller/AuthController.java`
- Modify: `backend/src/main/java/com/example/pesv/controller/UserRoutesController.java`
- Modify: `backend/src/main/java/com/example/pesv/service/RouteService.java`
- Modify: `backend/src/main/resources/application.properties`
- Create: `backend/src/test/java/com/example/pesv/DemoApplicationTests.java`

**Interfaces:**
- Consumes: Spring `Authentication` and the existing `UserRepository.findByEmail(String)`.
- Produces: `RouteService.findAuthenticatedUser(Authentication): User` and `RouteService.requireAccessibleUser(Long, Authentication): User`.
- Produces: authenticated `/api/users/**` endpoints with HTTP 400 for invalid telemetry, route, and emergency payloads.

- [ ] **Step 1: Write the failing MockMvc tests**

Add tests that assert: anonymous `POST /api/users/1/telemetry` is 401; `user` cannot write telemetry for admin's persisted ID; `/api/auth/me` returns the stored ID and email; invalid latitude returns 400; admin can list another user's routes.

- [ ] **Step 2: Run the focused tests to verify they fail**

Run: `mvn -f backend/pom.xml test -Dtest=DemoApplicationTests`  
Expected: FAIL because user endpoints are public, identity is hard-coded, and invalid payloads throw 500.

- [ ] **Step 3: Implement identity and ownership checks**

Seed `admin@pesv.co` and `user@pesv.co`. Implement `findAuthenticatedUser(Authentication)` by resolving `authentication.getName() + "@pesv.co"`; implement `requireAccessibleUser(Long, Authentication)` to allow admins or that resolved user's ID and otherwise throw `AccessDeniedException`. Make `AuthController.me(Authentication)` serialize that persisted user.

- [ ] **Step 4: Implement endpoint protection and payload checks**

Change the API fallback in `SecurityConfig` to `authenticated()`. In `UserRoutesController`, call `requireAccessibleUser` before every user-scoped operation. Reject null, non-finite, out-of-range latitude/longitude, or negative speed with `ResponseEntity.badRequest()`; keep the existing route provider behavior.

- [ ] **Step 5: Restrict demo configuration**

Allow only `http://localhost:3000`, `http://localhost`, and `capacitor://localhost` in CORS. Disable the H2 console while retaining the in-memory datasource and add a `shortcut:` comment explaining its presentation-only limit.

- [ ] **Step 6: Run backend verification**

Run: `mvn -f backend/pom.xml test`  
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add backend
git commit -m "fix: protect demo route data"
```

### Task 2: Align the React demo with the working API

**Files:**
- Modify: `frontend/src/services/api.js`
- Modify: `frontend/src/pages/user/MyRoutes.js`
- Modify: `frontend/src/pages/admin/Users.js`
- Modify: `frontend/src/components/layout/Sidebar.js`
- Modify: `frontend/src/App.js`

**Interfaces:**
- Consumes: `GET /api/users/{userId}/active-route` and the existing `POST /api/users/{userId}/emergency`.
- Produces: `userService.getActiveRoute(userId): Promise<AxiosResponse>`.
- Produces: an admin users page that consumes the backend `User` shape: `id`, `name`, `email`, and `role`.

- [ ] **Step 1: Remove unsupported mock and CRUD paths**

Delete `USE_MOCK`, `MOCK_USERS`, credential console logs, and the create/update/delete client methods. Do not retain buttons or a modal that call APIs the backend does not expose.

- [ ] **Step 2: Consume the active route and report emergency honestly**

Add `getActiveRoute` to `userService`. Replace the hard-coded route in `MyRoutes` with that request; set no route on an empty response or request failure. Await the emergency request before showing success, and display failure only from its catch path.

- [ ] **Step 3: Make administration display-only and routable**

Simplify `Users` to list the returned fields and view routes. Remove create, edit, delete, and non-existent fields. Register `/admin/users` in `App.js` and point the sidebar item to it.

- [ ] **Step 4: Build the frontend**

Run: `npm --prefix frontend ci`  
Run: `npm --prefix frontend run build`  
Expected: both commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add frontend
git commit -m "fix: align demo screens with API"
```

### Task 3: Add repository hygiene, license, and automated checks

**Files:**
- Modify: `.gitignore`
- Delete: `.idea/`
- Delete: `backend/target/`
- Create: `LICENSE`
- Modify: `README.md`
- Modify: `frontend/README.md`
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/codeql.yml`

**Interfaces:**
- Consumes: `npm ci && npm run build` in `frontend/` and `mvn test` in `backend/`.
- Produces: pull-request and main-branch CI statuses for the demo project.
- Produces: a root MIT license referenced by both READMEs.

- [ ] **Step 1: Remove generated and IDE artifacts**

Remove tracked `.idea` and `backend/target`. Add `.idea/` and `backend/target/` to `.gitignore`; retain all source, Android project files, and lockfiles.

- [ ] **Step 2: Add the MIT license**

Create the standard MIT `LICENSE` with copyright holder `PESV contributors`. Replace the frontend's “Todos los derechos reservados” statement with a link to the root MIT license, and add the same license reference to the root README.

- [ ] **Step 3: Add CI and security analysis**

Create `ci.yml` triggered by pull requests and pushes to `main`; it uses Node 22 for `npm ci` plus `npm run build`, and Java 17 for `mvn test`. Create `codeql.yml` triggered on the same events plus a weekly schedule, scanning Java and JavaScript.

- [ ] **Step 4: Run final local verification**

Run: `mvn -f backend/pom.xml test`  
Run: `npm --prefix frontend ci`  
Run: `npm --prefix frontend run build`  
Expected: all commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add .gitignore LICENSE README.md frontend/README.md .github
git rm -r --cached .idea backend/target
git commit -m "chore: add demo quality checks"
```
