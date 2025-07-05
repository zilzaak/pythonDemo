import { Role } from "./role";

export class UserEntity{
    id!:number;
    username!:string;
    email!:string;
    roles!:Role[];
    password!:string;
    groupUser!:boolean;
    userTitle!:string;
    groupUsername!:string;
    enabled!:boolean;
    accountExpired!:boolean;
    accountLocked!:boolean;
    passwordExpired!:boolean;
}