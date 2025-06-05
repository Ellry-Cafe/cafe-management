export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  MANAGER: 'manager',
  CASHIER: 'cashier'
}

export const DEFAULT_ROUTE = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.STAFF]: '/staff',
  [ROLES.MANAGER]: '/manager',
  [ROLES.CASHIER]: '/cashier'
}

export const ROLE_ROUTES = {
  [ROLES.ADMIN]: ['/admin', '/staff', '/manager', '/cashier'],
  [ROLES.MANAGER]: ['/manager', '/staff', '/cashier'],
  [ROLES.STAFF]: ['/staff'],
  [ROLES.CASHIER]: ['/cashier']
}

// Allowed roles for each route
export const ROUTE_PERMISSIONS = {
  '/admin': [ROLES.ADMIN],
  '/staff': [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF],
  '/manager': [ROLES.ADMIN, ROLES.MANAGER],
  '/cashier': [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER]
} 