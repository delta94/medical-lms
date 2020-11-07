import React from "react";
import If, {Else, Then} from "./If";
import {PageItem, Pagination} from "react-bootstrap";

export default function TablePagination(props: IPaginationProps) {
    function pagesToShow() {
        let eitherSide = 3;
        let result: PageButton[] = [];
        result.push({number: 1, continuous: true});

        let startPage = Math.max(2, props.page - eitherSide);
        let endPage = Math.min(props.noOfPages, props.page + eitherSide);

        for (let i = startPage; i <= endPage; i++) {
            let last = result[result.length - 1];
            result.push({number: i, continuous: last.number + 1 === i});
        }

        if (props.noOfPages > endPage) {
            result.push({number: props.noOfPages, continuous: endPage + 1 === props.noOfPages});
        }

        return result;
    }

    let pageNumbers: JSX.Element[] = [];

    pagesToShow().forEach((p: PageButton) => {
        pageNumbers.push((
            <PageItem key={p.number} onClick={(e) => props.setPage(p.number)} active={p.number === props.page}>
                <If conditional={p.continuous} hasElse={true}>
                    <Then>
                        {p.number}
                    </Then>
                    <Else>
                        ...
                    </Else>
                </If>
            </PageItem>
        ));
    });

    const previousPage = () => {
        if (props.page > 1) {
            props.setPage(props.page - 1);
        }
    };

    const nextPage = () => {
        if (props.page < props.noOfPages) {
            props.setPage(props.page + 1);
        }
    };

    return (
        <nav className={props.className ?? ""}>
            <Pagination className="d-inline-flex">
                <PageItem onClick={previousPage} aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </PageItem>
                {pageNumbers}
                <PageItem onClick={nextPage} aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </PageItem>
            </Pagination>
        </nav>
    );
}

export interface IPaginationProps {
    noOfPages: number;
    page: number;
    setPage(page: number): void;
    className?: any;
}

interface PageButton {
    number: number;
    continuous: boolean;
}
