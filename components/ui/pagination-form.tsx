import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

interface PaginationProps {
  size: number
  page: number
  search?: string
}

function getPaginationRange(currentPage: number, totalPages: number): number[] {
  const start = Math.max(currentPage - 1, 1)
  const end = Math.min(start + 2, totalPages)
  const range = []
  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  return range
}

export default function PaginationCustom({ size, page, search }: PaginationProps) {
  const serializeNumber = getPaginationRange(Number(page), size)

  return (
    <Pagination className="my-6">
      <PaginationContent>
        {page > 1 ? (
          <PaginationItem>
            <PaginationPrevious href={`?page=${page > 1 ? Number(page) - 1 : 1}${search ? `&q=${search}` : ''}`} />
          </PaginationItem>
        ) : (
          ''
        )}

        {serializeNumber.map((item, index) => (
          <PaginationItem key={index}>
            <PaginationLink isActive={Number(page) === item} href={`?page=${item}${search ? `&q=${search}` : ''}`}>
              {item}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page < size ? (
          <PaginationItem>
            <PaginationNext href={`?page=${page < size ? Number(page) + 1 : size}${search ? `&q=${search}` : ''}`} />
          </PaginationItem>
        ) : (
          ''
        )}
      </PaginationContent>
    </Pagination>
  )
}
