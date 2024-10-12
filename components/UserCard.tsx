import { user } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const UserCard = async ({ user }: { user: user }) => {
  return (
    <Link href={`/profile/${user.userId}`}>
      <article className="background-light900_dark200 border light-border flex w-full flex-col items-center justify-center rounded-2xl p-8">
        <Image
          src={user.imageUrl}
          alt="user profile"
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.userName}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
