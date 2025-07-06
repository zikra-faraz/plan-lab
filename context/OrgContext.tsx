"use client";

import { createContext, useContext } from "react";

export const OrgContext = createContext<any>(null);

export const useOrg = () => useContext(OrgContext);
