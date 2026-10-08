/**
 * ================================================================
 * CLASSROOM DEMO ONLY - INTENTIONALLY UNSAFE
 * ================================================================
 * `true`: Form Login goi demoLoginUnsafeAction, noi email/password vao SQL
 *         tren bang demo_login_users; tao session cho ho so sql_demo_a/b vao Feed.
 * `false`: Form Login goi loginAction goc (parameterized query va bcrypt).
 *
 * KHONG deploy production va KHONG commit voi gia tri `true`.
 * Sau buoi demo, chi can doi dong duoi day thanh `false`.
 * Action demo tu choi chay khi NODE_ENV la production.
 */
export const ENABLE_UNSAFE_LOGIN_SQL_DEMO = false;
