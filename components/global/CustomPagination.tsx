"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const CustomPagination = ({
  page,
  length,
}: {
  page: number;
  length: number;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [Next, setNext] = useState<number>(1);
  const [Previous, setPrevious] = useState<number | null>();

  const NoOfPages = Math.ceil(length / 10) - 1;

  useEffect(() => {
    const currentPage = Number(page) ? Number(page) : 0;

    if (currentPage > NoOfPages) {
      setNext(currentPage + 1);
    }

    if (currentPage > 1) {
      setPrevious(currentPage - 1);
    }
  }, [page, length, Next, Previous]);

  const createUrl = (
    pageNumber: number | null | undefined,
    use: "previous" | "next"
  ) => {
    const params = new URLSearchParams(searchParams);
    if (use === "previous" && Number(page) === 1) {
      // Deletes the given search parameter, and its associated value, from the list of all search parameters
      params.delete("page");
      replace(`${pathname}?${params.toString()}`);
    } else if (pageNumber) {
      // Sets the value associated to a given search parameter to the given value. If there were several values, delete the others.
      params.set("page", pageNumber.toString());
      replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        {page && (
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious
              onClick={() => createUrl(Previous, "previous")}
            />
          </PaginationItem>
        )}
        {page !== NoOfPages && (
          <PaginationItem className="cursor-pointer">
            <PaginationNext onClick={() => createUrl(Next, "next")} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
