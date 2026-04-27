# Project111 Ecosystem: Workflow Profiles

Updated: 2026-04-27

Maps each end-to-end user workflow to its relevant files per repository, with the
current integration status of every layer.

Status legend:
- **WORKING**  — implemented and wired end to end
- **PARTIAL**  — some layers present, integration incomplete
- **STUB**     — integration point is a no-op that logs [NOT IMPLEMENTED]
- **MISSING**  — required file or function does not exist yet

---

## WF-01: Staff Login

Staff opens the admin app and authenticates with username/password to receive a JWT.

**Status: WORKING**

**Flow**
1. `UnauthorizedView` renders — no valid token in localStorage
2. Staff submits credentials → `useAuthorization.authorizeWithCredentials()`
3. `LOGIN_MUTATION` sent over HTTP
4. Backend validates Argon2id hash, issues JWT via `signAccessToken()`
5. `persistAuthToken()` stores token and expiry in localStorage
6. Auth expiry timer started; admin app renders main view

| Repo | File | Role |
|---|---|---|
| project111-admin | `src/views/UnauthorizedView.tsx` | Login form UI |
| project111-admin | `src/api/hooks/auth.hooks.ts` | `useAuthorization`, `LOGIN_MUTATION`, expiry timer, `resetAppState` |
| project111-admin | `src/api/auth/tokenStorage.ts` | `persistAuthToken`, `getValidStoredToken`, `clearStoredAuth` |
| project111-admin | `src/api/graphql/client.ts` | Apollo client with auth link |
| project111-api | `src/resolvers/mutations/auth.ts` | `login` resolver, rate limiting |
| project111-api | `src/utils/auth/password.ts` | `verifyPassword` (Argon2id + pepper) |
| project111-api | `src/utils/auth/jwt.ts` | `signAccessToken`, `verifyAccessToken` |
| project111-api | `src/utils/security/rateLimiter.ts` | Per-identity and per-IP rate limiters |
| project111-api | `src/context.ts` | `resolveVerifiedAuth` — token → `context.auth` |

**Known constraint:** Rate limiter state is process-local. Does not survive restart and
does not apply across multiple API instances.

---

## WF-02: Tablet PIN Pairing

Staff generates a pairing PIN in the admin app. The customer tablet enters it to receive
a JWT. Only the admin side is functional.

**Status: PARTIAL — admin side WORKING; customer side STUB**

**Flow**
1. Staff opens Device Management → `useDeviceManagement()` fetches tablet list
2. Staff requests a PIN → `requestTabletPin` mutation sent
3. Backend issues PIN via `TabletPinManager` (in-memory), publishes via `pubSub`
4. Admin receives PIN via `organizationTabletPinIssued` subscription, shows in dialog
5. Staff shows PIN to customer — customer enters it on the tablet
6. **(STUB)** Customer calls `useTabletAuth().submitPin()` → logs `[NOT IMPLEMENTED]`,
   returns `{ success: false }` — `verifyTabletPin` mutation is never sent
7. **(MISSING)** Backend `verifyTabletPin` creates the tablet DB row and returns a JWT
8. **(MISSING)** Customer app stores JWT in `tablet_token` localStorage key

| Repo | File | Role |
|---|---|---|
| project111-admin | `src/views/DeviceManagementView.tsx` | Entry point, PIN request dialog |
| project111-admin | `src/components/deviceManagement/PairDeviceDialog.tsx` | PIN display |
| project111-admin | `src/api/hooks/device.hooks.ts` | `REQUEST_TABLET_PIN_MUTATION`, `ORGANIZATION_TABLET_PIN_ISSUED_SUBSCRIPTION` |
| project111 | `src/views/auth/UnauthorizedView.tsx` | PIN entry UI |
| project111 | `src/api/hooks/auth.hooks.ts` | `useTabletAuth` — STUB, logs `[NOT IMPLEMENTED] verifyTabletPin` |
| project111 | `src/context/authStore.ts` | `tabletTokenAtom` (localStorage `tablet_token`), `isAuthorizedAtom` (derived) |
| project111 | `src/components/auth/AuthGuard.tsx` | Gates app on `isAuthorizedAtom` |
| project111-api | `src/resolvers/mutations/tabletAuth.ts` | `requestTabletPin`, `verifyTabletPin` |
| project111-api | `src/utils/auth/tabletPin.ts` | `TabletPinManager` — in-memory PIN store |
| project111-api | `src/utils/auth/jwt.ts` | `signTabletToken` |
| project111-api | `src/websocket/pubSub.ts` | `publishTabletPinIssued`, `publishTabletPaired` |
| project111-api | `src/resolvers/subscriptions/tabletPin.ts` | `organizationTabletPinIssued`, `organizationTabletPaired` |

**Next implementation step:** Wire `submitPin` in `auth.hooks.ts` to call
`verifyTabletPin` mutation and on success call `set(tabletTokenAtom, token)`.

---

## WF-03: Dining Session Start

A paired tablet starts a dining session. Backend creates an in-memory session and
persists a recovery row. Admin table grid updates.

**Status: PARTIAL — customer STUB; backend session start WORKING but persistence is STUB**

**Flow**
1. Tablet loads → `AuthGuard` passes (JWT present)
2. `App.tsx` reads `sessionStateAtom` → `SessionState.Welcome` → `WelcomeView`
3. Customer taps Start → `startSessionAtom` write
4. **(STUB)** `startSessionAtom` logs `[NOT IMPLEMENTED] startDiningSession` — no mutation sent
5. **(STUB)** If `startDiningSession` were called: backend creates session, calls
   `upsertActiveSession()` which logs `[NOT IMPLEMENTED]` — session not persisted to DB
6. **(MISSING)** Backend publishes `SESSION_STARTED` via `pubSub`
7. Admin `organizationSessionStarted` subscription → table becomes active

| Repo | File | Role |
|---|---|---|
| project111 | `src/App.tsx` | Session state machine entry point |
| project111 | `src/views/welcome/WelcomeView.tsx` | Welcome screen |
| project111 | `src/context/orderStore.ts` | `sessionStateAtom`, `startSessionAtom` — STUB, logs `[NOT IMPLEMENTED]` |
| project111-api | `src/resolvers/mutations/session.ts` | `startDiningSession` resolver |
| project111-api | `src/websocket/sessionManager.ts` | `createSession`, `restoreSession`, `restoreSessions` |
| project111-api | `src/websocket/sessionPersistence.ts` | `upsertActiveSession` — STUB, logs `[NOT IMPLEMENTED]` |
| project111-api | `src/websocket/pubSub.ts` | `publishSessionStarted` |
| project111-api | `src/resolvers/subscriptions/sessions.ts` | `organizationSessionStarted` subscription |
| project111-admin | `src/views/TableView.tsx` | Table grid, session active state |
| project111-admin | `src/api/hooks/table.hooks.ts` | `useGetTableMonitor`, session started subscription |

**Next implementation steps (in order):**
1. Implement `upsertActiveSession` in `sessionPersistence.ts`
2. Wire `startSessionAtom` to call `startDiningSession` mutation with tablet JWT claims
3. Implement restart recovery that calls `restoreSessions()` from DB rows on startup

---

## WF-04: Menu and Product Browsing

Customer browses the menu after a session is active.

**Status: STUB — UI renders mock data; no GraphQL calls made**

**Flow**
1. `MenuView` renders after `sessionState === Active`
2. `useGetProducts('')` — skipped (empty string), falls through to `MOCK_PRODUCTS`
3. `useGetActiveCampaignProducts('')` — skipped, falls through to `MOCK_CAMPAIGN_PRODUCTS`
4. Categories and products render from mock data

| Repo | File | Role |
|---|---|---|
| project111 | `src/views/menu/MenuView.tsx` | Menu layout — passes `''` to hooks (real IDs needed) |
| project111 | `src/api/hooks/product.hooks.ts` | `useGetProducts` — returns `MOCK_PRODUCTS` while real query is commented out |
| project111 | `src/api/hooks/campaignProduct.hooks.ts` | `useGetActiveCampaignProducts` — returns `MOCK_CAMPAIGN_PRODUCTS` |
| project111 | `src/api/mockData/products.mock.ts` | `MOCK_PRODUCTS` |
| project111 | `src/api/mockData/campaignProducts.mock.ts` | `MOCK_CAMPAIGN_PRODUCTS` |
| project111 | `src/components/menu/ProductCard.tsx` | Product display card |
| project111 | `src/components/category/CategoryPill.tsx` | Category filter |
| project111-api | `src/resolvers/queries/product.ts` | `products`, `product` |
| project111-api | `src/resolvers/queries/menu.ts` | `menus`, `menu`, `activeMenu` |
| project111-api | `src/resolvers/queries/menuProduct.ts` | `menuProducts` |

**Next implementation step:** Once WF-02 and WF-03 supply a real `organizationId`
from the tablet JWT, pass it to `useGetProducts` and un-comment the real query in
`product.hooks.ts`. Same for `campaignProduct.hooks.ts`.

---

## WF-05: Order Creation

Customer submits a cart as an order. Admin dashboard receives the new order.

**Status: PARTIAL — mutation schema is now correct; customer-side status feedback is STUB**

**Flow**
1. Customer adds products → `orderItemsAtom` via `ActionBar`
2. `OrderSummaryDialog` confirms → `CREATE_ORDER` mutation sent with correct camelCase fields
3. Backend inserts `orders` + `order_products` rows in a DB transaction
4. Backend calls `sessionManager.addOrderToSession()` on the in-memory session
5. Backend publishes `NEW_ORDER` and `ORDER_PLACED` via `pubSub`
6. Admin `organizationOrderPlaced` subscription fires → dashboard updated
7. **(STUB)** Customer `useOrderConfirmation().confirmOrder()` logs `[NOT IMPLEMENTED]`,
   returns `false` — no status feedback shown to customer

| Repo | File | Role |
|---|---|---|
| project111 | `src/context/orderStore.ts` | `orderItemsAtom`, `submittedOrdersAtom`, `updateOrderStatusAtom` |
| project111 | `src/components/actionbar/ActionBar.tsx` | Cart controls, order submit trigger |
| project111 | `src/components/order/OrderSummaryDialog.tsx` | Order review, calls `confirmOrder` |
| project111 | `src/api/mutations/order.mutations.ts` | `CREATE_ORDER` — fields now match backend schema |
| project111 | `src/api/hooks/order.hooks.ts` | `useCreateOrder` |
| project111 | `src/api/hooks/orderStatus.hooks.ts` | `useOrderConfirmation` — STUB, logs `[NOT IMPLEMENTED]` |
| project111-api | `src/resolvers/mutations/order.ts` | `createOrder` resolver, transaction |
| project111-api | `src/websocket/sessionManager.ts` | `addOrderToSession`, `updateSessionOrder` |
| project111-api | `src/websocket/pubSub.ts` | `publishNewOrder`, `publishOrderPlaced` |
| project111-api | `src/resolvers/subscriptions/orders.ts` | `organizationOrderPlaced`, `organizationNewOrderNotification` |
| project111-admin | `src/api/hooks/dashboardWebSocket.hooks.ts` | `organizationOrderPlaced` handler |
| project111-admin | `src/context/dashboardStore.ts` | `upsertDashboardSnapshotAtom` |

**Known issue:** `createOrder` checks for an active in-memory session. If WF-03 is not
yet wired, the session will not exist and the order total/status will not track correctly
in the session manager even though the DB row is written.

**Next implementation step:** Replace `useOrderConfirmation` with a real
`orderStatusChanged` subscription (WF-06 is a prerequisite).

---

## WF-06: Order Status Lifecycle (Admin → Customer)

Staff updates order status; customer receives real-time feedback.

**Status: PARTIAL — admin path WORKING; customer subscription path STUB**

**Flow**
1. Admin `OrderDashboardView` shows incoming order
2. Staff accepts → `updateOrderStatus` mutation (Pending → Preparing)
3. Backend updates in-memory session state, publishes `ORDER_STATUS_CHANGED`
4. Admin `organizationOrderStatusChanged` subscription fires → dashboard updated
5. **(STUB)** Customer `orderStatusChanged` subscription would fire — but `useOrderConfirmation`
   is a no-op and the customer `client.ts` now has `GraphQLWsLink` wired (infra ready)

| Repo | File | Role |
|---|---|---|
| project111 | `src/api/client.ts` | Apollo client — `GraphQLWsLink` now wired; splits on subscription operations |
| project111 | `src/api/hooks/orderStatus.hooks.ts` | `useOrderConfirmation` — STUB, replace with subscription |
| project111 | `src/context/orderStore.ts` | `orderStatusAtom`, `submittedOrdersAtom`, `updateOrderStatusAtom` |
| project111-api | `src/resolvers/mutations/order.ts` | `updateOrderStatus` resolver |
| project111-api | `src/websocket/sessionManager.ts` | `updateOrderStatus` — updates in-memory status map |
| project111-api | `src/websocket/pubSub.ts` | `publishOrderStatusChange` |
| project111-api | `src/resolvers/subscriptions/orders.ts` | `orderStatusChanged` (tablet), `organizationOrderStatusChanged` |
| project111-admin | `src/api/hooks/dashboardWebSocket.hooks.ts` | `organizationOrderStatusChanged` handler |
| project111-admin | `src/api/hooks/dashboard.hooks.ts` | `useOrderActions` — `acceptOrder`, `rejectOrder`, `markOrderReady` |
| project111-admin | `src/views/OrderDashboardView.tsx` | Dashboard UI, order status controls |

**Next implementation step:** Replace `useOrderConfirmation` body with a `useSubscription`
call to `orderStatusChanged` keyed on `tabletId` from the tablet JWT. The infra
(`GraphQLWsLink` + token forwarding) is already in place.

---

## WF-07: Bill Request

Customer requests the bill. Staff receive the notification in the admin app.

**Status: PARTIAL — UI sets local state and logs warn; mutation never sent to backend**

**Flow**
1. Customer taps "Request Bill" → `TotalOrderSummaryDialog`
2. **(STUB)** `console.warn('[NOT IMPLEMENTED] requestBill mutation not called')`
3. `billRequestedAtom` set to `true` — customer sees bill-requested UI
4. **(MISSING)** `requestBill` mutation not sent — staff receive no event
5. **(MISSING)** Admin `organizationBillRequested` subscription fires (never triggered)
6. Table shows bill-requested indicator (never reaches this state from customer)

| Repo | File | Role |
|---|---|---|
| project111 | `src/context/orderStore.ts` | `billRequestedAtom` |
| project111 | `src/components/order/TotalOrderSummaryDialog.tsx` | Bill request trigger — STUB warns at all three `setBillRequested(true)` sites |
| project111 | `src/components/order/BillRequestOptionsDialog.tsx` | Split bill options dialog |
| project111 | `src/components/order/SplitBillDialog.tsx` | Split bill configuration UI |
| project111-api | `src/resolvers/mutations/session.ts` | `requestBill` resolver |
| project111-api | `src/websocket/pubSub.ts` | `publishBillRequest` |
| project111-api | `src/resolvers/subscriptions/sessions.ts` | `organizationBillRequested` subscription |
| project111-admin | `src/api/hooks/dashboardWebSocket.hooks.ts` | `organizationBillRequested` handler |
| project111-admin | `src/api/hooks/table.hooks.ts` | `billRequestedSubscription` in `useGetTableMonitor` |
| project111-admin | `src/views/TableView.tsx` | Bill-requested indicator on table card |

**Next implementation step:** Add a `requestBill` mutation call at each warn site in
`TotalOrderSummaryDialog.tsx`, passing `sessionId` from the tablet JWT context.

---

## WF-08: Session Close

Staff closes a dining session. Session is persisted to history, in-memory state is
cleared, admin table becomes inactive, and the customer tablet should reset.

**Status: PARTIAL — staff → admin path WORKING (pending WF-03 persistence); customer receives no event**

**Flow**
1. Staff opens `TableView`, selects active table, clicks Finalize
2. `closeDiningSession` mutation sent
3. Backend retrieves in-memory session → inserts row into `dining_sessions`
4. `sessionManager.endSession()` clears in-memory state
5. **(STUB)** `deleteActiveSession()` logs `[NOT IMPLEMENTED]` — active session row not removed
6. Backend publishes `SESSION_CLOSED` via `pubSub`
7. Admin `organizationSessionClosed` subscription fires → table becomes inactive
8. **(STUB)** Customer app `MenuView` `useEffect` logs `[NOT IMPLEMENTED] session close subscription`
9. **(MISSING)** Customer tablet does not reset to `SessionState.Welcome`

| Repo | File | Role |
|---|---|---|
| project111 | `src/views/menu/MenuView.tsx` | One-shot `useEffect` stub — logs `[NOT IMPLEMENTED] session close subscription (WF-08)` |
| project111 | `src/context/orderStore.ts` | `resetAppStateAtom` — already correct, resets all state and returns to Welcome |
| project111 | `src/components/order/ThankYouDialog.tsx` | End-of-session UI |
| project111-api | `src/resolvers/mutations/session.ts` | `closeDiningSession`, `terminateCurrentTabletSession` |
| project111-api | `src/resolvers/shared/sessionClose.ts` | `closeSessionWithReason`, `endActiveSessionForTablet` |
| project111-api | `src/websocket/sessionManager.ts` | `endSession` |
| project111-api | `src/websocket/sessionPersistence.ts` | `deleteActiveSession` — STUB, logs `[NOT IMPLEMENTED]` |
| project111-api | `src/websocket/pubSub.ts` | `publishSessionClosed` |
| project111-api | `src/resolvers/subscriptions/sessions.ts` | `organizationSessionClosed` subscription |
| project111-api | `src/resolvers/mutations/tablet.ts` | `deauthTablet` — triggers `endActiveSessionForTablet` |
| project111-admin | `src/views/TableView.tsx` | Finalize button, `handleFinalize` |
| project111-admin | `src/api/hooks/table.hooks.ts` | `useCloseTableSession`, `CLOSE_DINING_SESSION_MUTATION` |
| project111-admin | `src/context/dashboardStore.ts` | `removeDashboardOrdersByTableNumberAtom` |

**Next implementation step:** In `MenuView.tsx`, replace the warn stub with a
`useSubscription` on `organizationSessionClosed` filtered by `sessionId`. On event,
call `resetAppStateAtom`. Requires WF-02 (tablet JWT) and WF-06 infra already in place.

---

## WF-09: Admin Real-time Order Dashboard

Staff monitor incoming orders, change order statuses, and manage the queue in real time.

**Status: WORKING (with known dual-source reconciliation caveat)**

**Flow**
1. `OrderDashboardView` mounts → `useSyncDashboardOrders()` starts polling (15 s)
2. `useDashboardWebSocket()` establishes subscriptions
3. New order → `organizationOrderPlaced` subscription → snapshot upserted
4. Staff accepts → `updateOrderStatus` mutation (Pending → Preparing)
5. Status update → `organizationOrderStatusChanged` subscription → snapshot updated
6. Session close → `organizationSessionClosed` → orders removed

| Repo | File | Role |
|---|---|---|
| project111-admin | `src/views/OrderDashboardView.tsx` | Dashboard entry point |
| project111-admin | `src/api/hooks/dashboard.hooks.ts` | `useSyncDashboardOrders`, polling queries, `useOrderActions` |
| project111-admin | `src/api/hooks/dashboardWebSocket.hooks.ts` | `useDashboardWebSocket`, all org-scoped subscriptions |
| project111-admin | `src/context/dashboardStore.ts` | `upsertDashboardSnapshotAtom`, `updateOrderStatusAtom`, `visibleOrderListSectionsAtom` |
| project111-admin | `src/viewModels/order.viewModel.ts` | `toOrderItemStatus`, `isRuntimeOrderStatus`, `isActiveRuntimeOrderStatus` |
| project111-admin | `src/api/hooks/organization.hooks.ts` | `useOrganizationId` — implicit org fallback when `VITE_ORGANIZATION_ID` unset |
| project111-api | `src/resolvers/mutations/order.ts` | `updateOrderStatus` |
| project111-api | `src/resolvers/queries/order.ts` | `orders` |
| project111-api | `src/resolvers/queries/session.ts` | `activeDiningSessions` |
| project111-api | `src/resolvers/subscriptions/orders.ts` | `organizationOrderPlaced`, `organizationOrderStatusChanged` |
| project111-api | `src/resolvers/subscriptions/sessions.ts` | `organizationSessionClosed` |
| project111-api | `src/websocket/pubSub.ts` | All publish methods |
| project111-api | `src/websocket/sessionManager.ts` | Runtime session/order state |

**Known caveat:** Polling (15 s) and subscriptions both feed `upsertDashboardSnapshotAtom`.
A stale poll result arriving after a more recent subscription event can revert visible
state momentarily. This is a structural issue inherited from the dual-source pattern.

---

## WF-10: Table Session Monitor

Staff monitor active tables, session metadata, bill requests, and can drill into orders
or close a session.

**Status: WORKING**

**Flow**
1. `TableView` mounts → `useGetTableMonitor()` queries tablets + active sessions
2. Subscriptions established for all session and bill events
3. Active tables show session metadata; bill-requested tables are flagged
4. Staff clicks table → `useGetTableSessionOrders(sessionId)` fetches orders
5. Staff finalizes → WF-08

| Repo | File | Role |
|---|---|---|
| project111-admin | `src/views/TableView.tsx` | Entry point, table grid, session dialog |
| project111-admin | `src/components/tableManagement/` | `ActiveTablesGrid`, `AvailableTablesGrid`, `TableDialog` |
| project111-admin | `src/api/hooks/table.hooks.ts` | `useGetTableMonitor`, `useGetTableSessionOrders`, `useCloseTableSession` — full subscription suite |
| project111-admin | `src/api/hooks/organization.hooks.ts` | `useOrganizationId` |
| project111-admin | `src/viewModels/table.viewModel.ts` | `toTableMonitorViewModel` |
| project111-api | `src/resolvers/queries/session.ts` | `activeDiningSessions` |
| project111-api | `src/resolvers/queries/tablet.ts` | `tablets` |
| project111-api | `src/resolvers/queries/order.ts` | `orders` |
| project111-api | `src/resolvers/subscriptions/sessions.ts` | `organizationSessionStarted`, `organizationSessionClosed`, `organizationBillRequested` |
| project111-api | `src/resolvers/subscriptions/orders.ts` | `organizationOrderPlaced`, `organizationOrderStatusChanged` |

---

## WF-11: Order History

Staff view historical closed orders with date-range filtering.

**Status: WORKING**

**Flow**
1. `OrderHistoryView` mounts → `useGetOrderHistory()` fetches all orders for org
2. Orders filtered client-side by preset (today / 3 days / week / month / custom)
3. Staff clicks order → `OrderHistoryDialog` shows detail

| Repo | File | Role |
|---|---|---|
| project111-admin | `src/views/OrderHistoryView.tsx` | View entry point, filter state — `new Date()` now used correctly |
| project111-admin | `src/components/orderHistory/OrderHistoryFilters.tsx` | Date preset controls |
| project111-admin | `src/components/orderHistory/OrderHistoryTable.tsx` | Order list |
| project111-admin | `src/components/dashboard/OrderHistoryDialog.tsx` | Order detail dialog |
| project111-admin | `src/api/hooks/orderHistory.hooks.ts` | `useGetOrderHistory`, `ORDER_HISTORY_QUERY` |
| project111-admin | `src/viewModels/order.viewModel.ts` | `HistoryOrderViewModel` mapping |
| project111-api | `src/resolvers/queries/order.ts` | `orders` (staff-scoped) |
| project111-api | `src/resolvers/shared/loaders.ts` | DataLoader for `orderProducts` |

---

## WF-12: Menu and Product Management

Staff create and edit menus, categories, products, and campaign products.

**Status: WORKING (not exercised in this analysis cycle)**

| Repo | File | Role |
|---|---|---|
| project111-admin | `src/views/MenuEditorView.tsx` | Menu editor entry point |
| project111-admin | `src/views/ProductEditorView.tsx` | Product editor entry point |
| project111-admin | `src/components/menuEditor/` | Menu/category editor components |
| project111-admin | `src/components/productEditor/` | Product editor components |
| project111-admin | `src/api/hooks/menu.hooks.ts` | Menu queries and mutations |
| project111-admin | `src/api/hooks/product.hooks.ts` | Admin product queries and mutations |
| project111-admin | `src/api/graphql/mappers.ts` | `mapGraphQLProductToProduct`, `mapGraphQLMenuToMenu` |
| project111-api | `src/resolvers/mutations/menu.ts` | `createMenu`, `updateMenu`, `deleteMenu` |
| project111-api | `src/resolvers/mutations/product.ts` | `createProduct`, `updateProduct`, `deleteProduct` |
| project111-api | `src/resolvers/mutations/menuProduct.ts` | `createMenuProduct`, `deleteMenuProduct` |
| project111-api | `src/resolvers/queries/menu.ts` | `menus`, `menu`, `activeMenu` |
| project111-api | `src/resolvers/queries/product.ts` | `products`, `product` |

---

## Cross-workflow Blockers

Issues that must be resolved before multiple workflows can reach WORKING status.

| Blocker | Affects | Location | State |
|---|---|---|---|
| `verifyTabletPin` not called from customer app | WF-02, WF-03, WF-04, WF-05, WF-07, WF-08 | `project111/src/api/hooks/auth.hooks.ts` | STUB |
| `startDiningSession` not called from customer app | WF-03 | `project111/src/context/orderStore.ts` `startSessionAtom` | STUB |
| Active session persistence not implemented | WF-03, WF-08 restart recovery | `project111-api/src/websocket/sessionPersistence.ts` | STUB |
| Customer order status subscription not wired | WF-05, WF-06 | `project111/src/api/hooks/orderStatus.hooks.ts` | STUB |
| `requestBill` mutation not called from customer app | WF-07 | `project111/src/components/order/TotalOrderSummaryDialog.tsx` | STUB |
| Customer session close subscription not wired | WF-08 | `project111/src/views/menu/MenuView.tsx` | STUB |
| Menu/product data uses mock data | WF-04 | `project111/src/api/hooks/product.hooks.ts`, `campaignProduct.hooks.ts` | STUB |
| Organization ID implicit fallback in admin | WF-09, WF-10, WF-11, WF-12 | `project111-admin/src/api/hooks/organization.hooks.ts` | PARTIAL |

## Implementation Order

The blockers have hard dependencies on each other. The correct order to resolve them:

1. **WF-02** `verifyTabletPin` — all customer-side integration depends on a real JWT
2. **WF-03** `startDiningSession` + `upsertActiveSession` — session must exist before any
   order or bill operation works end to end
3. **WF-04** real product query — unblock once `organizationId` is available from JWT
4. **WF-06** `orderStatusChanged` subscription — infra (GraphQLWsLink) is already in place
5. **WF-05** `useOrderConfirmation` → real subscription — depends on WF-06 being done
6. **WF-07** `requestBill` mutation call — straightforward once session is established
7. **WF-08** session close subscription — depends on WF-06 infra and tablet JWT
