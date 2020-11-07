export default function If(props: IIfProps) {
    if (props.hasElse) {
        let then = props.children.filter(c => c.type === Then);
        let el = props.children.filter(c => c.type === Else);
        return props.conditional ? then : el ?? null;
    } else {
        return props.conditional ? props.children : null;
    }
}

export function Then(props: any) {
    return props.children ?? null;
}
export function Else(props: any) {
    return props.children ?? null;
}

export interface IIfProps {
    conditional: any;
    hasElse?: boolean;
    children: any;
}