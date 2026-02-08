# System Test Checklist

## Configuration Verification
- [x] Backend environment matches server settings
- [x] Database credentials match server
- [x] JWT secret matches server
- [x] CORS configuration matches server
- [x] File upload settings match server

## Backend Tests

### 1. Server Health
- [ ] Backend starts without errors
- [ ] Health endpoint responds: `GET /api/system/health`
- [ ] Database connection successful

### 2. Authentication
- [ ] Login with admin credentials works
- [ ] JWT token is generated and valid
- [ ] Protected routes require authentication
- [ ] Token expiration works correctly

### 3. API Endpoints - Data Retrieval (GET)

#### ICT Assets Module
- [ ] `GET /api/category` - Returns categories array
- [ ] `GET /api/type` - Returns types array
- [ ] `GET /api/brand` - Returns brands array
- [ ] `GET /api/model` - Returns models array
- [ ] `GET /api/assets` - Returns assets array
- [ ] `GET /api/staff` - Returns staff array
- [ ] `GET /api/department` - Returns departments array
- [ ] `GET /api/division` - Returns divisions array
- [ ] `GET /api/facility` - Returns facilities array

#### Stores Module
- [ ] `GET /api/stores/grn` - Returns GRNs array
- [ ] `GET /api/stores/ledger` - Returns ledger entries array
- [ ] `GET /api/stores/form76a` - Returns Form 76A requisitions array

#### Fleet Module
- [ ] `GET /api/vehicles` - Returns vehicles array
- [ ] `GET /api/vehicles/types` - Returns vehicle types array

#### Finance Module
- [ ] `GET /api/activity` - Returns activities array
- [ ] `GET /api/reports/accountability` - Returns accountability reports

#### Servers Module
- [ ] `GET /api/servers` - Returns servers array
- [ ] `GET /api/servers/virtual` - Returns virtual servers array

### 4. API Endpoints - Data Creation (POST)

#### ICT Assets Module
- [ ] `POST /api/category` - Creates new category
- [ ] `POST /api/brand` - Creates new brand
- [ ] `POST /api/model` - Creates new model
- [ ] `POST /api/assets` - Creates new asset
- [ ] `POST /api/staff` - Creates new staff member

#### Stores Module
- [ ] `POST /api/stores/grn` - Creates new GRN
- [ ] `POST /api/stores/form76a` - Creates new Form 76A requisition

#### Fleet Module
- [ ] `POST /api/vehicles` - Creates new vehicle

#### Finance Module
- [ ] `POST /api/activity` - Creates new activity

#### Servers Module
- [ ] `POST /api/servers` - Creates new server
- [ ] `POST /api/servers/virtual` - Creates new virtual server

### 5. API Endpoints - Data Update (PUT)
- [ ] `PUT /api/assets/:id` - Updates asset
- [ ] `PUT /api/staff/:id` - Updates staff member
- [ ] `PUT /api/vehicles/:id` - Updates vehicle

### 6. API Endpoints - Data Deletion (DELETE)
- [ ] `DELETE /api/category/:id` - Deletes category
- [ ] `DELETE /api/brand/:id` - Deletes brand

### 7. Error Handling
- [ ] Invalid credentials return 401
- [ ] Missing required fields return 400
- [ ] Invalid data format returns 400
- [ ] Non-existent resources return 404
- [ ] Server errors return 500 with message

## Frontend Tests

### 1. Application Startup
- [ ] Frontend builds without errors
- [ ] Frontend starts on port 3000
- [ ] No console errors on initial load
- [ ] Login page loads correctly

### 2. Authentication Flow
- [ ] Login form displays correctly
- [ ] Login with valid credentials redirects to dashboard
- [ ] Invalid credentials show error message
- [ ] Token is stored in localStorage
- [ ] Logout clears token and redirects

### 3. Data Entry Forms

#### ICT Assets Module
- [ ] Add Asset form loads
- [ ] Assigned User Information table works
- [ ] ICT Asset Line Items table works
- [ ] Form validation works (required fields)
- [ ] Form submission creates asset in database
- [ ] Success message displays after creation
- [ ] Form resets after successful submission

- [ ] Add Category form works
- [ ] Add Brand form works
- [ ] Add Model form works
- [ ] Add Staff form works
- [ ] Add Department form works
- [ ] Add Division form works
- [ ] Add Facility form works

#### Stores Module
- [ ] Add GRN form works
- [ ] GRN items table works
- [ ] Form 76A requisition form works
- [ ] Form validation works

#### Fleet Module
- [ ] Add Vehicle form works
- [ ] Vehicle details form works
- [ ] Job Card form works

#### Finance Module
- [ ] Add Activity form works
- [ ] Activity participants form works

#### Servers Module
- [ ] Add Host Server form works
- [ ] Add Virtual Server form works
- [ ] Warranty field is optional

### 4. Data Display (Lists/Tables)

#### ICT Assets Module
- [ ] Categories list displays (no "Something went wrong" error)
- [ ] Types list displays
- [ ] Brands list displays
- [ ] Models list displays
- [ ] Assets list displays
- [ ] Staff list displays
- [ ] Departments list displays
- [ ] Divisions list displays
- [ ] Facilities list displays
- [ ] Empty states display correctly (no data)
- [ ] Loading states display correctly

#### Stores Module
- [ ] GRN list displays
- [ ] Ledger entries display
- [ ] Form 76A list displays

#### Fleet Module
- [ ] Vehicles list displays
- [ ] Job Cards list displays

#### Finance Module
- [ ] Activities list displays
- [ ] Reports display correctly

#### Servers Module
- [ ] Servers list displays
- [ ] Virtual Servers list displays

### 5. Data Retrieval
- [ ] All list pages load without errors
- [ ] Data displays in tables correctly
- [ ] Pagination works (if implemented)
- [ ] Search/filter works (if implemented)
- [ ] Sorting works (if implemented)

### 6. Error Handling
- [ ] Network errors show user-friendly message
- [ ] 401 errors redirect to login
- [ ] 400 errors show validation messages
- [ ] 500 errors show error message
- [ ] Error boundary catches React errors
- [ ] "Something went wrong" only shows for unexpected errors

### 7. Data Updates
- [ ] Edit forms load with existing data
- [ ] Updates save to database
- [ ] Success messages display
- [ ] Lists refresh after update

### 8. Data Deletion
- [ ] Delete confirmation works
- [ ] Deletion removes from database
- [ ] Lists refresh after deletion

## Database Tests

### 1. Connection
- [ ] Database connection successful
- [ ] All tables exist
- [ ] Permissions are correct

### 2. Data Integrity
- [ ] Foreign key constraints work
- [ ] Unique constraints work
- [ ] Required fields are enforced
- [ ] Data types are correct

### 3. CRUD Operations
- [ ] CREATE operations insert data correctly
- [ ] READ operations retrieve data correctly
- [ ] UPDATE operations modify data correctly
- [ ] DELETE operations remove data correctly

## Integration Tests

### 1. End-to-End Workflows

#### ICT Asset Workflow
1. [ ] Create category
2. [ ] Create brand
3. [ ] Create model
4. [ ] Create asset with assigned user
5. [ ] View asset in list
6. [ ] Edit asset
7. [ ] Add maintenance record
8. [ ] View maintenance history
9. [ ] Transfer asset
10. [ ] Dispose asset

#### Stores Workflow
1. [ ] Create GRN
2. [ ] Add items to GRN
3. [ ] Submit GRN
4. [ ] View GRN in list
5. [ ] Create Form 76A requisition
6. [ ] View ledger entries

#### Fleet Workflow
1. [ ] Create vehicle
2. [ ] Create job card
3. [ ] Add service request
4. [ ] View vehicle history

#### Finance Workflow
1. [ ] Create activity
2. [ ] Add participants
3. [ ] Generate report
4. [ ] View accountability reports

#### Servers Workflow
1. [ ] Create host server
2. [ ] Create virtual server
3. [ ] View servers list
4. [ ] Edit server details

## Performance Tests

- [ ] Page load times are acceptable (< 3 seconds)
- [ ] API response times are acceptable (< 1 second)
- [ ] Large lists render without lag
- [ ] No memory leaks during extended use

## Security Tests

- [ ] Authentication required for protected routes
- [ ] JWT tokens expire correctly
- [ ] CORS is configured correctly
- [ ] Input validation prevents SQL injection
- [ ] XSS protection works
- [ ] Rate limiting works

## Browser Compatibility

- [ ] Chrome/Edge works
- [ ] Firefox works
- [ ] Safari works (if applicable)

---

## Test Execution Log

**Date:** _______________
**Tester:** _______________
**Environment:** Local (matching server config)

### Notes:
- Record any errors or issues found
- Note any deviations from expected behavior
- Document any performance issues
