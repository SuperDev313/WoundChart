// ** Imports createContext function
import { createContext } from "react";

// ** Imports createContextualCan function
import { createContextualCan } from "@casl/react";

// ** Create Context
export const AbilityContext = createContext({
    can: () => true, // Replace with your actual implementation
});

// ** Init Can Context
export const Can = createContextualCan(AbilityContext.Consumer);
