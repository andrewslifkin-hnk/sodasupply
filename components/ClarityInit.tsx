"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const projectId = "rnyldrncy4";

export default function ClarityInit() {
  useEffect(() => {
    Clarity.init(projectId);
  }, []);
  return null;
} 