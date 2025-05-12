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
}> = ({ noteId, content, userId, isPrivate, isCurrentUsers, username }) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <p>
          <strong>
            <Link className="hover:text-blue-500" href={`/${userId}`}>
              {username}
            </Link>
          </strong>
        </p>
        <p className="text-xl">
          <Link href={`/${userId}/${noteId}`} className="hover:text-blue-500">
            {content}
            {isPrivate && (
              <span className="italic text-gray-600"> Private</span>
            )}
          </Link>
        </p>
      </div>
      {isCurrentUsers && (
        <NotePrivacyToggleButton noteId={noteId} isPrivate={isPrivate} />
      )}
    </div>
  );
};
