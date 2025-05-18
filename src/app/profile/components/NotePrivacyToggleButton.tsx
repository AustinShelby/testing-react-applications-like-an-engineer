"use client";

import { FC } from "react";
import { toggleNotePrivacy } from "../actions/toggleNotePrivacy";

export const NotePrivacyToggleButton: FC<{
  isPrivate: boolean;
  noteId: number;
}> = ({ isPrivate, noteId }) => {
  const toggle = async () => {
    await toggleNotePrivacy({ isPrivate: !isPrivate, noteId });
  };

  return (
    <button
      onClick={toggle}
      className="px-4 py-2 text-white font-medium bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
    >
      {isPrivate ? "Make public" : "Make private"}
    </button>
  );
};
