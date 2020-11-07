import {Role} from "../api/v1/UserApi";
import React from "react";

export function UserRole(props: IUserRoleProps) {
    switch (props.value) {
        case Role.Standard:
            return <span>Standard</span>;
        case Role.SuperUser:
            return <span>Super User</span>;
        case Role.Admin:
            return <span>Admin</span>;
        default:
            return <span>Unknown</span>
    }
}

export interface IUserRoleProps {
    value: number;
}