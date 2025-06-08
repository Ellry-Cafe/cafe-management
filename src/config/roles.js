export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CASHIER: 'cashier',
  MANAGER: 'manager'
}

export const ROLE_ROUTES = {
  [ROLES.ADMIN]: ['/admin', '/admin/users', '/admin/menu', '/admin/orders'],
  [ROLES.CASHIER]: ['/cashier', '/cashier/orders', '/cashier/menu'],
  [ROLES.MANAGER]: ['/manager', '/manager/reports', '/manager/menu']
}

export const DEFAULT_ROUTE = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.STAFF]: '/staff',
  [ROLES.CASHIER]: '/cashier',
  [ROLES.MANAGER]: '/manager'
} 