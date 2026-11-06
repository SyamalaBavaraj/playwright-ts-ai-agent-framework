# SauceDemo Login Test Plan

## Application Overview

Validate SauceDemo authentication from a fresh login page using the requested standard, locked-out, empty-field, and invalid-credential cases. The password for valid and locked-out accounts is secret_sauce. Each scenario is independent and starts at https://www.saucedemo.com/.

## Test Scenarios

### 1. Login flow

**Seed:** `tests/seed.spec.ts`

#### 1.1. standard_user logs in successfully @smoke

**File:** `tests/login/standard-user-login.spec.ts`

**Steps:**
  1. Open https://www.saucedemo.com/ in a fresh browser state.
    - expect: The Swag Labs login page is displayed with Username, Password, and Login controls.
  2. Enter standard_user in Username and secret_sauce in Password.
    - expect: Both credential fields contain the entered values.
  3. Click Login.
    - expect: The browser navigates to /inventory.html.
    - expect: The Products page heading is displayed.
    - expect: The inventory shows the product catalog (six products).
    - expect: No login error is displayed.

#### 1.2. locked_out_user sees the locked account error @regression

**File:** `tests/login/locked-out-user.spec.ts`

**Steps:**
  1. Open https://www.saucedemo.com/ in a fresh browser state.
    - expect: The Swag Labs login page is displayed.
  2. Enter locked_out_user in Username and secret_sauce in Password.
    - expect: Both credential fields contain the entered values.
  3. Click Login.
    - expect: The user remains on the login page.
    - expect: An alert displays: Epic sadface: Sorry, this user has been locked out.
    - expect: The inventory page is not opened.

#### 1.3. Login rejects an empty username @regression

**File:** `tests/login/empty-username.spec.ts`

**Steps:**
  1. Open https://www.saucedemo.com/ in a fresh browser state.
    - expect: The Swag Labs login page is displayed.
  2. Leave Username empty and enter secret_sauce in Password.
    - expect: Username is empty and Password contains secret_sauce.
  3. Click Login.
    - expect: The user remains on the login page.
    - expect: An alert displays: Epic sadface: Username is required.
    - expect: The inventory page is not opened.

#### 1.4. Login rejects an empty password @regression

**File:** `tests/login/empty-password.spec.ts`

**Steps:**
  1. Open https://www.saucedemo.com/ in a fresh browser state.
    - expect: The Swag Labs login page is displayed.
  2. Enter standard_user in Username and leave Password empty.
    - expect: Username contains standard_user and Password is empty.
  3. Click Login.
    - expect: The user remains on the login page.
    - expect: An alert displays: Epic sadface: Password is required.
    - expect: The inventory page is not opened.

#### 1.5. Login rejects invalid credentials @regression

**File:** `tests/login/invalid-credentials.spec.ts`

**Steps:**
  1. Open https://www.saucedemo.com/ in a fresh browser state.
    - expect: The Swag Labs login page is displayed.
  2. Enter invalid_user in Username and secret_sauce in Password.
    - expect: Username contains invalid_user and Password contains secret_sauce.
  3. Click Login.
    - expect: The user remains on the login page.
    - expect: An alert displays: Epic sadface: Username and password do not match any user in this service.
    - expect: The inventory page is not opened.
