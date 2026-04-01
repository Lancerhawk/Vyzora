# Maintenance Checklist

Tracks fixes, improvements, and open issues across the platform. Checked items are shipped.

## Backend

- [x] 1. In production, the global error handler was returning raw internal error messages directly to the client — this included database field names, query details, and exception strings depending on where the failure occurred.

- [x] 2. The GitHub OAuth rate limiter was scoped to the entire auth router, so the callback route was also throttled. A user returning from GitHub after hitting the limit during redirect would be blocked from completing login.

- [x] 3. When processing a batch of ingest events, a single timestamp was computed once before the loop and applied to every event in the batch. This made entire groups of events appear simultaneous in time-series charts rather than spread across real arrival times.

- [x] 4. JWT signing and verification were using `process.env.JWT_SECRET` directly with a hardcoded `'secret'` fallback, bypassing the centralized config entirely. A deployment with a missing secret variable would run silently with a well-known signing key.

- [x] 5. Browser analytics SQL excluded events with no browser metadata from the count, while the event totals on the metrics cards included all events. This caused a persistent mismatch between the browser chart total and the overall numbers.

- [x] 6. Every single ingest request triggered a database query to validate the API key with no caching in between. At any real traffic level this made key validation — not the event write itself — the primary bottleneck.

- [x] 7. The logout endpoint had no origin or referer check. Any cross-site form POST could target it and silently clear a logged-in user's session cookie.

- [x] 8. If `JWT_SECRET` was absent from the environment, the server would start and quietly sign all tokens with the string `'secret'`. Anyone aware of the fallback could forge valid session tokens without credentials.

- [x] 9. The ingestion CORS policy reflected any requesting origin with credentials allowed. This was necessary for the SDK to work across arbitrary websites but was never documented, leaving the intent and the trade-off invisible to anyone reading the config.

- [x] 10. API keys were stored as plain text in the database. Any read-access breach or database dump would immediately expose every active key across every project.

- [x] 11. The events array on ingest requests had no upper bound set in the validation schema. A single request could contain thousands of minimal events designed to flood writes.

- [x] 12. The metadata field on ingest events accepted nested objects of any depth and values of any type. This opened the service to deeply nested payloads and prototype-polluting key names.

- [x] 13. The GitHub OAuth redirect launched with no state parameter. This left the flow open to CSRF attacks on the handshake itself — an attacker could redirect a victim to the callback with a forged code.

- [x] 14. Each analytics panel on the dashboard triggered its own project ownership database query independently. Loading the full dashboard simultaneously fired five or more identical ownership checks against the same project and user.

- [x] 15. The project list API returned the full API key hash for every project on every dashboard load, even though the dashboard never displayed it after the initial creation modal.

- [x] 16. No compression middleware was applied to API responses. All JSON payloads, metric responses, and analytics data traveled uncompressed regardless of whether the client supported it.

- [x] 17. Changing the time range on the dashboard triggered six independent API calls at the same time, each re-running the date range logic and ownership check separately instead of combining them.

- [x] 18. Time-series daily bucketing used the PostgreSQL server's local timezone. Users in different regions would see daily boundaries cut off at unexpected local times, making day-level trends unreliable.

- [ ] 19. When a project is deleted, the in-process API key cache and ownership cache are not cleared. Ingest requests for that project can keep succeeding for several minutes after deletion, eventually hitting a foreign key constraint error when trying to write against the now-removed record.

- [ ] 20. Project names are trimmed on the frontend before being submitted but not validated on the backend. A name made entirely of whitespace passes the minimum length check server-side and ends up in the database as-is.

- [ ] 21. After exchanging the GitHub OAuth code for a GitHub access token, the response is used directly without checking whether the exchange actually succeeded. When GitHub returns a structured error response for an expired or reused code, it goes undetected and produces a confusing downstream failure.

- [ ] 22. The process does not handle `SIGTERM` or `SIGINT`. On container platforms the orchestrator sends a termination signal before force-killing — without a handler, active database transactions and in-flight ingest batches are cut off immediately with no chance to drain.

- [ ] 23. No HTTP security headers are set on any response. Standard browser-level protections like `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, and `Referrer-Policy` are entirely absent.

- [ ] 24. Startup validation only checks for the JWT secret. If `DATABASE_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, or `FRONTEND_URL` are missing from a deployment environment, the server starts successfully and fails later at the first point of use with a cryptic runtime error instead of a clear startup message.

- [ ] 25. The OAuth state cookie is set with `SameSite=Lax`. For a short-lived security token whose only function is CSRF prevention, `Strict` is the more appropriate value — `Lax` allows it to be sent on top-level cross-site GET requests, which is unnecessary for this use case.

- [ ] 26. The JSON body size limit is set globally across all routes at 1MB. Auth and project management endpoints realistically need a few hundred bytes at most. Accepting large bodies on these routes is unnecessary surface area for slow-body attacks.

- [ ] 27. The Event table has no composite database index on project ID and creation timestamp together. Every analytics query — timeseries, browser distribution, top pages, top events, sessions — filters on exactly this pair of columns. Without the index, each query falls back to a full table scan regardless of how much data exists.

- [ ] 28. The sessions endpoint returns the 50 most recent sessions with no pagination or cursor support. Older sessions beyond the limit are silently inaccessible, and the dashboard gives no indication that more data exists beyond what is shown.

- [ ] 29. All backend logging goes through plain `console.log`, `console.warn`, and `console.error` with unstructured string messages. In any production log aggregation tool, these are unsearchable and unfiltered — debugging an incident means manually reading interleaved output rather than querying structured fields.

- [ ] 30. Log output has no request correlation ID. When multiple requests overlap — which is constant under real traffic — their log lines are interleaved with no way to group them back to a single request lifecycle.

- [ ] 31. The `axios` library is a backend dependency used exclusively for the three GitHub API calls made during OAuth. Node.js 18 ships with native `fetch`, making `axios` an unnecessary addition to the dependency tree for this purpose.

## Frontend

- [x] 1. Changing the time range on the dashboard fired six separate API calls simultaneously rather than a single batched request, meaning every range toggle multiplied network overhead by six.

- [ ] 2. The project object type on the dashboard includes an API key field on the list view, but the list endpoint no longer returns it after the plain-text key removal change. The type is incorrect and will cause confusion when working on the dashboard going forward.

- [ ] 3. Project deletion uses `window.confirm()` for the confirmation step. This is a synchronous browser dialog that freezes the main thread and looks visually inconsistent with the rest of the modal-based interface throughout the dashboard.

## SDK

- [x] 1. The browser history monkeypatching had no global guard — only a per-instance flag. React Strict Mode's double-invocation and hot module replacement both create a second instance, which would patch `pushState` again and double every navigation event recorded.

- [ ] 2. Events are sent via `sendBeacon` using a JSON content type. This triggers a CORS preflight in spec-compliant browsers, but `sendBeacon` cannot negotiate preflights — it fires and ignores the response. Some browsers drop the request entirely in this case, causing silent event loss specifically on page unload.

- [ ] 3. The in-memory event queue has no maximum size cap. If the backend is unreachable for an extended period on a high-traffic page, the queue grows without bound as events keep being pushed faster than the retries can clear them.

- [ ] 4. Browser detection misclassifies Android WebView and Electron environments as Chrome because both include Chrome's version token in their user agent strings. This merges meaningfully different runtime environments into a single browser bucket and inflates the Chrome count.
