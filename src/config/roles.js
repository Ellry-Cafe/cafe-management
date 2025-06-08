export const ROLES = {
  ADMIN: 'admin',
  BARISTA: 'barista',
  CASHIER: 'cashier',
  COOK: 'cook',
  ASSISTANT_COOK: 'assistant_cook',
  MANAGER: 'manager'
}

export const ROLE_ROUTES = {
  [ROLES.ADMIN]: ['/admin', '/admin/users', '/admin/menu', '/admin/orders'],
  [ROLES.BARISTA]: ['/staff', '/staff/orders'],
  [ROLES.CASHIER]: ['/cashier', '/cashier/orders', '/cashier/menu'],
  [ROLES.COOK]: ['/kitchen', '/kitchen/orders'],
  [ROLES.ASSISTANT_COOK]: ['/kitchen', '/kitchen/orders'],
  [ROLES.MANAGER]: ['/manager', '/manager/reports', '/manager/menu']
}

export const DEFAULT_ROUTE = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.BARISTA]: '/staff',
  [ROLES.CASHIER]: '/cashier',
  [ROLES.COOK]: '/kitchen',
  [ROLES.ASSISTANT_COOK]: '/kitchen',
  [ROLES.MANAGER]: '/manager'
} 