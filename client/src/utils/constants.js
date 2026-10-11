export const ROLES = {
  ADMIN: 'ADMIN',
  STORE_OWNER: 'STORE_OWNER',
  USER: 'USER',
}

export const ROLE_HOME = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.STORE_OWNER]: '/owner',
  [ROLES.USER]: '/dashboard',
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.STORE_OWNER]: 'Store Owner',
  [ROLES.USER]: 'User',
}
