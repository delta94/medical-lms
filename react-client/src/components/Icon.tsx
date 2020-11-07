import React from "react";
import {Link} from "react-router-dom";

export default function Icon({onClick, href, to, children, disabled, className, invokeDefault, title}: IIconProps) {
    let icon = <i title={title} className={`material-icons ${className}`}>{children}</i>;
    if (href) {
        return <a title={title} className={disabled ? "disabled" : ""} onClick={(e) => {
            if (!invokeDefault) e.preventDefault();
            if (!disabled)
                onClick?.()
        }} href={href}>{icon}</a>;
    } else if (to) {
        return <Link title={title} className={disabled ? "disabled" : ""} onClick={(e) => {
            if (!invokeDefault) e.preventDefault();
            if (!disabled)
                onClick?.()
        }} to={to}>{icon}</Link>
    } else {
        return <i title={title} onClick={disabled ? () => null : onClick} className={`material-icons ${className}`}>{children}</i>
    }
}

export interface IIconProps {
    onClick?(): void;
    href?: string;
    to?: any;
    disabled?: boolean;
    children: any;
    className?: string;
    invokeDefault?: boolean;
    title?: string;
}