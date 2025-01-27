export interface Role {
  name: string,
  id: string,
  permission: string[];
  usersWithRole: []
}

export interface UserRole {
  name: string;
  email:string;
  id:string;
}

 export interface UserUsingRole {
  user: UserRole;
  name: string;
  email: string;
}

 export type UserUsingRoleList = UserUsingRole[];


