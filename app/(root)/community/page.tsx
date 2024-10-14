import { FetchUser } from "@/actions/FetchUser";
import CustomPagination from "@/components/global/CustomPagination";
import Filters from "@/components/global/Filters";
import MobileFilters from "@/components/global/MobileFilters";
import Searchbar from "@/components/Searchbar";
import UserCard from "@/components/UserCard";
import { UserFilters } from "@/constants/filters";
import { db } from "@/lib/db";

import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community | Dev Overflow",
};

const Page = async ({
  searchParams,
}: {
  searchParams: {
    page: number;
    filter: string;
    q: string;
  };
}) => {
  const pageNo = searchParams.page ? searchParams.page : 0;

  const userLength = await db.user.findMany();
  const users = await db.user.findMany({
    skip: 20 * Number(pageNo),
    take: 20,
    include: {
      answer: true,
    },
    where: {
      name: {
        contains: searchParams.q,
      },
    },
    orderBy: {
      createdAt: searchParams.filter === "new_users" ? "desc" : "asc",
    },
  });
  const result = await FetchUser(searchParams.filter, users);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      {users.length > 0 && (
        <>
          <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
            <Searchbar
              route="/"
              iconPosition="left"
              imgSrc="/assets/icons/search.svg"
              placeholder="Search for Users"
              otherClasses="flex-1"
            />
            {/* MobileFilters */}
            <MobileFilters
              filters={UserFilters}
              otherClasses="min-h-[56px] sm:min-w-[170px]"
              containerClasses="hidden max-md:flex"
            />
          </div>
          <Filters filters={UserFilters} />
        </>
      )}

      <div className="mt-12">
        {result?.length! > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {result?.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No users yet</p>
            <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
              Join to be the first!
            </Link>
          </div>
        )}
      </div>
      {userLength.length === 20 && (
        <div className="mt-10">
          <CustomPagination
            length={userLength.length}
            page={searchParams.page}
          />
        </div>
      )}
    </>
  );
};

export default Page;
