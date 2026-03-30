import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import SectionHeader from "./SectionHeader";
import SectionPagination from "./SectionPagination";

type ContentSectionProps<T> = {
  title: string;
  seeAllTo: string;
  items: T[];
  itemsPerPage?: number;
  renderCard: (item: T) => ReactNode;
};

export default function ContentSection<T>({
  title,
  seeAllTo,
  items,
  itemsPerPage = 4,
  renderCard,
}: ContentSectionProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, items, itemsPerPage]);

  return (
    <section className="mx-auto w-full max-w-360 px-4 py-12 md:px-8 lg:px-23">
      <SectionHeader title={title} seeAllTo={seeAllTo} />

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {paginatedItems.map((item, index) => (
          <div key={index}>{renderCard(item)}</div>
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
