"use client";
import { useEffect } from "react";

export function Lazy({ username }: { username: string }) {
  useEffect(() => {
    async function setupUser() {
      try {
        await Promise.all([
          fetch(`/api/github/setupUser?username=${username}`, {
            method: "POST",
          }),
          fetch(`/api/leetcode/setupUser?username=${username}`, {
            method: "POST",
          }),
        ]);
      } catch (err) {
        console.error("Error setting up user:", err);
      }
    }

    setupUser();
  }, [username]);

  return null;
}
