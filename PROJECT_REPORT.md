# AgriPrime Project Analysis Report

## Phase 1: Project Discovery

### 1. High-Level Architecture
*   **Overall Purpose**: AgriPrime is a unified digital platform for livestock lifecycle management, veterinary health, workforce operations, inventory, e-commerce marketplace, logistics, and financial analytics. It bridges the gap between farm operations and consumer sales.
*   **Business Workflow**: The farm manages livestock (RFID tracking, breeding, health). Products derived from the farm (dairy, meat, feed) are managed in inventory and listed on the Marketplace. Customers purchase products, triggering orders and logistics. All financial transactions are logged for profit/loss tracking.
*   **User Journey**:
    *   **Customer**: Landing Page -> Product Exploration -> Registration/Login -> Cart Management -> Checkout -> Order Tracking.
    *   **Worker/Vet**: Login -> Attendance Marking -> Task Execution (Animal Care, Feed, Maintenance) -> Progress Logging.
    *   **Admin/Manager**: System Monitoring -> User/Staff Management -> Inventory/Financial Oversight -> Product/Category Management.
*   **System Architecture**: Classic MERN (MongoDB, Express, React, Node.js) with a focus on Role-Based Access Control (RBAC).
*   **Frontend ↔ Backend Communication**: Axios-driven REST API calls. Authentication via Bearer JWT in headers.
*   **Authentication Flow**: JWT issuance on Login/Register. Persistent storage in LocalStorage. Token verification via Middleware.
*   **Database Flow**: Mongoose Schema -> Controller Logic -> MongoDB Persistence.

### 2. Folder Structure Analysis

#### Backend/
*   `controllers/`: **Purpose**: Contains business logic for each resource. **Dependencies**: Models, Express. **Connection**: Called by Routes.
*   `middleware/`: **Purpose**: Request interception for Auth and RBAC. **Dependencies**: jsonwebtoken. **Connection**: Placed between Routes and Controllers.
*   `models/`: **Purpose**: Mongoose schemas and data validation. **Dependencies**: Mongoose. **Connection**: Used by Controllers for DB ops.
*   `routes/`: **Purpose**: Defines API endpoints. **Dependencies**: Express Router, Controllers. **Connection**: Entry point for API requests.
*   `services/`: **Purpose**: External integrations (e.g., Email). **Dependencies**: nodemailer. **Connection**: Utility used by Controllers.

#### Frontend/
*   `src/assets/`: **Purpose**: Static media. **Connection**: Imported by Components/Screens.
*   `src/components/`: **Purpose**: Reusable UI parts and complex forms. **Dependencies**: React, Axios. **Connection**: Used by Pages and Screens.
*   `src/contexts/`: **Purpose**: Global state (Auth, Cart). **Dependencies**: React Context API. **Connection**: Wraps the entire App.
*   `src/pages/`: **Purpose**: Role-based layouts and navigation containers. **Dependencies**: React Router. **Connection**: Entry points for User/Admin/Marketplace sections.
*   `src/screens/`: **Purpose**: High-fidelity feature pages with complex logic. **Dependencies**: Axios, Components. **Connection**: Injected into Page layouts.
*   `src/utils/`: **Purpose**: Helpers (ProtectedRoute, API instance, CSV export). **Dependencies**: Axios, React Router. **Connection**: Global utility support.

---

## Phase 2: Route & API Mapping

| Route | Method | Controller | Purpose | Frontend Page Using It |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | authController.register | Customer signup | `Register.jsx` |
| `/api/auth/login` | POST | authController.login | User authentication | `Login.jsx` |
| `/api/auth/me` | GET | authController.getMe | User session verification | `AuthContext.jsx` |
| `/api/auth/profile` | PUT | authController.updateProfile | Profile info update | `UserProfile.jsx` |
| `/api/auth/password` | PUT | authController.changePassword | User security update | `UserSettings.jsx` |
| `/api/auth/forgot-password`| POST | authController.forgotPassword | Password recovery | `ForgotPassword.jsx` |
| `/api/auth/reset-password/:token`| POST | authController.resetPassword | Password reset | `ResetPassword.jsx` |
| `/api/animals` | GET | animalController.getAllAnimals | Livestock listing | `LivestockManagement.jsx` |
| `/api/animals` | POST | animalController.createAnimal | Add new animal | `AnimalForm.jsx` |
| `/api/animals/status/:status`| GET | animalController.getByStatus | Filter by status | `LivestockManagement.jsx` |
| `/api/animals/:id` | GET | animalController.getAnimalById | Animal details | `AnimalForm.jsx` |
| `/api/animals/:id` | PUT | animalController.updateAnimal | Animal data update | `AnimalForm.jsx` |
| `/api/animals/:id` | DELETE | animalController.deleteAnimal | Animal removal | `LivestockManagement.jsx` |
| `/api/animal-groups` | GET | animalGroupController.getAllGroups | Group listing | `InventoryFeedControl.jsx` |
| `/api/animal-groups` | POST | animalGroupController.createGroup | Group creation | `AnimalGroupForm.jsx` |
| `/api/animal-groups/report`| GET | animalGroupController.generateReport| Inventory report | `InventoryFeedControl.jsx` |
| `/api/animal-groups/auto-adjust`| POST | animalGroupController.autoAdjustFeed| AI feed adjustment | `InventoryFeedControl.jsx` |
| `/api/health` | GET | healthController.getAllHealthRecords| Medical history logs | `VeterinaryBreedingCalendar.jsx`|
| `/api/health` | POST | healthController.createHealthRecord| Add medical record | `HealthRecordForm.jsx` |
| `/api/health/export` | GET | healthController.exportMedicalHistory| Medical history export | `VeterinaryBreedingCalendar.jsx`|
| `/api/breeding` | GET | breedingController.getAllBreedingRecords| Breeding cycle logs | `VeterinaryBreedingCalendar.jsx`|
| `/api/breeding/stats`| GET | breedingController.getBreedingStats| Breeding performance | `VeterinaryBreedingCalendar.jsx`|
| `/api/inventory` | GET | inventoryController.getAllInventory | Stock levels tracking | `InventoryFeedControl.jsx` |
| `/api/inventory` | POST | inventoryController.createInventory | Add stock item | `InventoryForm.jsx` |
| `/api/financial` | GET | financialController.getAllFinancialRecords| Ledger tracking | `FinancialProfitTracking.jsx` |
| `/api/financial` | POST | financialController.createFinancialRecord| Add transaction | `FinancialRecordForm.jsx` |
| `/api/products` | GET | productController.getAllProducts | Marketplace catalog | `Marketplace.jsx` |
| `/api/products` | POST | productController.createProduct | Add shop item | `ProductForm.jsx` |
| `/api/products/search`| GET | productController.searchProducts | Catalog search | `Marketplace.jsx` |
| `/api/products/category/rename`| PUT | productController.renameCategory | Category management | `AdminCategories.jsx` |
| `/api/orders` | GET | orderController.getAllOrders | System orders | `UserOrders.jsx`, `AdminOrders.jsx`|
| `/api/orders` | POST | orderController.createOrder | Order placement | `CheckoutModal.jsx` |
| `/api/employees` | GET | employeeController.getAllEmployees | Staff directory | `HRWorkerProfileDashboard.jsx` |
| `/api/employees/:id/credentials`| POST | employeeController.generateCredentials| Worker login setup | `HRWorkerProfileDashboard.jsx` |
| `/api/tasks` | GET | taskController.getAllTasks | Workforce task list | `WorkerDashboard.jsx` |
| `/api/tasks` | POST | taskController.createTask | Assign work | `TaskForm.jsx` |
| `/api/tasks/:id/progress`| PUT | taskController.updateProgress | Work progress update | `WorkerDashboard.jsx` |
| `/api/attendance` | GET | attendanceController.getAllAttendance| Attendance logs | `WorkerDashboard.jsx` |
| `/api/attendance/mark`| POST | attendanceController.markAttendance | Daily attendance | `WorkerDashboard.jsx` |
| `/api/admin/stats` | GET | adminController.getDashboardStats | Admin dashboard metrics | `AdminAnalytics.jsx` |
| `/api/admin/users` | GET | adminController.getAllUsers | User management | `AdminUsers.jsx` |
| `/api/newsletter/subscribe`| POST | newsletterController.subscribe | Newsletter signup | `Marketplace.jsx` |

---

## Phase 3: Frontend Workflow Analysis

### Pages

#### Marketplace (`Marketplace.jsx`)
*   **Purpose**: Public commerce hub.
*   **Components**: `Navigation`, `CartDrawer`, `CheckoutModal`, `Toast`.
*   **APIs**: `GET /api/products`, `POST /api/newsletter/subscribe`.
*   **Actions**: Search, Filter by Category, Add to Cart, Newsletter Signup.
*   **Navigation**: `ProductDetail`, `Login`, `Dashboard`.

#### User Orders (`UserOrders.jsx`)
*   **Purpose**: Customer order history.
*   **Components**: Status badges, Order cards.
*   **APIs**: `GET /api/orders`.
*   **Actions**: View order status, order date, items, total.
*   **Navigation**: Dashboard Home.

#### Livestock Management (`LivestockManagement.jsx`)
*   **Purpose**: Core farm operational screen.
*   **Components**: `AnimalForm`, `Toast`.
*   **APIs**: `GET /api/animals`, `DELETE /api/animals/:id`.
*   **Actions**: Add Animal, Edit Profile, Delete Animal, Search (RFID/Name), Status Filter.
*   **Navigation**: Admin Dashboard.

#### HR Worker Profile Dashboard (`HRWorkerProfileDashboard.jsx`)
*   **Purpose**: Employee and Task management.
*   **Components**: `EmployeeForm`, `TaskForm`, Kanban board.
*   **APIs**: `GET /api/employees`, `GET /api/tasks`, `POST /api/employees/:id/credentials`.
*   **Actions**: Add/Edit/Delete Employee, Generate Login, Drag-and-drop Tasks.
*   **Navigation**: Admin Dashboard.

### Buttons Analysis

| Page | Button | Action | API Called | Navigation |
| :--- | :--- | :--- | :--- | :--- |
| Marketplace | Add to Cart | Local cart update | None | None |
| Marketplace | Checkout | Open Modal | None | None |
| Checkout Modal | Place Order | Order creation | `POST /api/orders` | `/dashboard/orders` |
| Login | Sign In | Auth Request | `POST /api/auth/login` | Role-based (Admin/User) |
| Worker Dash | Mark Present | Attendance log | `POST /api/attendance/mark`| None |
| Worker Dash | Mark Complete | Task update | `PUT /api/tasks/:id/progress`| None |
| Admin Products | Edit | Open Form | `GET /api/products/:id` | None |
| Admin Products | Delete | Delete item | `DELETE /api/products/:id` | None |
| Vet Calendar | Export CSV | History download | `GET /api/health/export`| None |
| Inventory | Auto-Adjust | AI Feed recalc | `POST /api/animal-groups/auto-adjust`| None |
| HR Dashboard | Generate Login| Credential creation | `POST /api/employees/:id/credentials`| None |

---

## Phase 4: Component Relationship Mapping

### Dependency Map

*   **App.jsx** (Root Router)
    *   **AuthProvider** (State: user, token, isAdmin; APIs: login, register, me)
    *   **CartProvider** (State: cart, cartTotal; Utils: addToCart, clearCart)
        *   **Navigation** (Props: cartCount; Actions: logout, navigate)
        *   **ProtectedRoute** (Props: requiredRole, allowedRoles)
            *   **Marketplace** (Parent)
                *   **CartDrawer** (Child: props cart, onClose)
                *   **CheckoutModal** (Child: props onClose, onSuccess; APIs: /api/orders)
            *   **AdminDashboard** (Parent Layout)
                *   **AdminAnalytics** (Child; APIs: /api/admin/stats)
                *   **LivestockManagement** (Child)
                    *   **AnimalForm** (Child: props productId, onSuccess)
            *   **WorkerDashboard** (Parent; APIs: /api/tasks, /api/attendance)

---

## Phase 5: Database Analysis

### Model ERD-style Explanation

#### User
*   **Fields**: `name`, `email`, `password`, `role`.
*   **Validation**: Required email (unique), required password.
*   **Referenced by**: `Animal`, `BreedingRecord`, `HealthRecord`, `Employee`, `Task`.

#### Animal
*   **Fields**: `rfid` (unique), `name`, `species` (enum), `breed`, `gender`, `status` (enum), `weightKg`.
*   **Referenced by**: `HealthRecord`, `BreedingRecord`, `FinancialRecord`, `Product`.

#### Product
*   **Fields**: `name` (unique), `price`, `stock`, `category`, `certified`, `imageUrl`.
*   **Referenced by**: `Order` (via items), `Animal`.

#### Order
*   **Fields**: `orderNumber` (unique), `customer` (nested), `items` (array), `totalAmountPKR`, `status` (enum).
*   **Referenced by**: `FinancialRecord`.

#### HR/Workforce
*   **Employee**: `cnic` (unique), `role`, `department`, `salaryPKR`, `userId` (ref).
*   **Task**: `title`, `status`, `assignedTo` (ref Employee), `assignedBy` (ref User).
*   **Attendance**: `employeeId` (ref), `date`, `status`, `taskId` (ref).

---

## Phase 6: Authentication & Authorization

### Step-by-Step Flow:
1.  **User Click Login**: User enters credentials in `Login.jsx`.
2.  **Frontend Form**: `AuthContext.login(email, password)` is called.
3.  **API Request**: Axios POST request to `/api/auth/login`.
4.  **Controller**: `authController` looks up user, compares hashed password with `bcrypt`.
5.  **JWT Generation**: Token signed with `userId` and `role`. Returns `token` and `user` object.
6.  **Database Verification**: `authMiddleware.js` verifies token on every protected request.
7.  **RBAC Middleware**: `roleMiddleware.js` (`authorize`) checks if `req.user.role` matches required roles.
8.  **Redirect**: `Login.jsx` redirects `admin` to `/admin` and others to `/dashboard`.

---

## Phase 7: End-to-End Workflow Tracing

### User Registration Flow
*   `Register.jsx` -> `AuthContext` -> `POST /api/auth/register` -> `authController` -> `User` Model (Save) -> Response -> Redirect Login.

### Product Creation Flow
*   `AdminProducts.jsx` -> `ProductForm.jsx` -> `POST /api/products` -> `authMiddleware` -> `roleMiddleware(['admin', 'manager'])` -> `productController` -> `Product` Model -> Refresh List.

### Checkout Flow
*   `Marketplace.jsx` -> `CartContext` -> `CheckoutModal.jsx` -> `POST /api/orders` -> `orderController` -> `Order` Model -> `CartContext.clearCart` -> Redirect User Orders.

### Worker Attendance Flow
*   `WorkerDashboard.jsx` -> `POST /api/attendance/mark` OR `PUT /api/tasks/:id/progress` -> `attendanceController` -> `Attendance` Model (Save).

---

## Phase 8: Team Task Division

### Member 1 — Frontend Lead
*   **Responsibilities**: Pages, UI Components, React State Management, Routing, UX.
*   **Assigned Files**:
    *   `frontend/src/App.jsx`, `frontend/src/main.jsx`
    *   `frontend/src/pages/admin/*`, `frontend/src/pages/marketplace/*`, `frontend/src/pages/user/*`, `frontend/src/pages/worker/*`
    *   `frontend/src/screens/*`
    *   `frontend/src/components/*`
    *   `frontend/src/contexts/*`

### Member 2 — Backend Lead
*   **Responsibilities**: Routes, Controllers, Middleware, Authentication, APIs.
*   **Assigned Files**:
    *   `backend/server.js`
    *   `backend/routes/*`
    *   `backend/controllers/*`
    *   `backend/middleware/*`
    *   `backend/services/*`

### Member 3 — Database & Integration Lead
*   **Responsibilities**: Models, MongoDB, API Integration, Testing, Deployment.
*   **Assigned Files**:
    *   `backend/models/*`
    *   `backend/seed.js`
    *   `frontend/src/api.js`
    *   `backend/package.json`, `frontend/package.json`

---

## Phase 9: Knowledge Transfer Document

1.  **Application Entry**: `backend/server.js` starts the API. `frontend/src/main.jsx` mounts the React app.
2.  **Request Lifecycle**:
    *   Client `api.js` (Axios interceptor adds JWT) -> Server `Routes` -> `AuthMiddleware` (Token check) -> `RoleMiddleware` (RBAC) -> `Controller` -> `Mongoose` -> `MongoDB`.
3.  **State Flow**: `AuthContext` provides global user session. `CartContext` provides global checkout state.
4.  **Database Flow**: Mongoose models enforce validation before persistence. Controllers use `try/catch` for error propagation.

---

## Phase 10: Risk & Improvement Report

*   **Configuration**: Hardcoded API URL in `api.js`. **Recommendation**: Move to `.env`.
*   **Security**: Hardcoded CORS origin in `server.js`. **Recommendation**: Move to `.env`.
*   **Validation**: Backend lacks robust input schema validation (e.g., Zod). **Recommendation**: Add validation middleware.
*   **Tests**: No automated tests found. **Recommendation**: Implement Vitest (Frontend) and Supertest (Backend).
*   **Code Health**: Standardize forms to use a common `Form` wrapper to reduce 15+ nearly identical form files.
*   **Performance**: Optimize large hero images in `Marketplace.jsx` for faster LCP.
