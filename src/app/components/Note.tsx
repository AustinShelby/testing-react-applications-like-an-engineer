"use client";

import Link from "next/link";
import { FC } from "react";
import { NotePrivacyToggleButton } from "../profile/components/NotePrivacyToggleButton";

export const Note: FC<{
  noteId: number;
  content: string;
  userId: number;
  isPrivate: boolean;
  isCurrentUsers: boolean;
  username: string;
  createdAt: Date;
}> = ({
  noteId,
  content,
  userId,
  isPrivate,
  isCurrentUsers,
  username,
  createdAt,
}) => {
  return (
    <div className="flex justify-between items-start gap-6">
      <div>
        <p>
          <Link
            className="hover:text-primary-500 font-semibold"
            href={`/${userId}`}
          >
            {username}
          </Link>
          <span className="text-sm text-gray-600 ml-2">
            {createdAt.toLocaleDateString("se")}
            {isPrivate && <span className="italic"> - Private</span>}
          </span>
        </p>
        <p className="text-xl mt-2">
          <Link
            href={`/${userId}/${noteId}`}
            className="hover:text-primary-500"
            data-testid="note-content"
          >
            {content}
          </Link>
        </p>
      </div>
      <div className="flex-shrink-0">
        {isCurrentUsers && (
          <NotePrivacyToggleButton noteId={noteId} isPrivate={isPrivate} />
        )}
      </div>
    </div>
  );
};
