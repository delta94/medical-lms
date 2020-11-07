import React from "react";

export function FormattedDate(props: IFormattedDateProps) {
    const date = new Date(props.date);
    return <span>{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>
}

export interface IFormattedDateProps {
    date: string;
}