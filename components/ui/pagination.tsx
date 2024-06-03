import React from "react";
import { Pagination } from "@nextui-org/react";
interface PaginationTypes {
    total: number
    initialPage: number
}
export default function FooterPagination({ total, initialPage }: PaginationTypes) {
    return (
        <Pagination loop showControls color="secondary" total={total} initialPage={initialPage} />
    );
}
