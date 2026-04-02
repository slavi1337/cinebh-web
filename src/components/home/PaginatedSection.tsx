import { useEffect, useMemo, useState, type ReactNode } from "react";
import SectionHeader from "@/components/home/SectionHeader";
import SectionPagination from "@/components/home/SectionPagination";

type PaginatedSectionProps<T> = {
  title: string;
  seeAllTo: string;
  items: T[];
  itemsPerPage?: number;
  renderItem: (item: T) => ReactNode;
  getItemKey: (item: T) => string;
};

export default function PaginatedSection<T>({
  title,
  seeAllTo,
  items,
  itemsPerPage = 4,
  renderItem,
  getItemKey,
}: PaginatedSectionProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, items, itemsPerPage]);

  return (
    <section className="mx-auto w-full max-w-360 px-4 py-12 md:px-8 lg:px-23">
      <SectionHeader title={title} seeAllTo={seeAllTo} />

      <div className="mt-10 grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2 xl:grid-cols-4">
        {paginatedItems.map((item) => (
          <div key={getItemKey(item)}>{renderItem(item)}</div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <SectionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={items.length}
          visibleItems={itemsPerPage}
          onPrevious={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          onNext={() =>
            setCurrentPage((page) => Math.min(page + 1, totalPages))
          }
        />
      </div>
    </section>
  );
}
