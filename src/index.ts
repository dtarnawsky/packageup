//import { getGreeting } from "./getGreeting";
import { getArg } from "./args";
import { inspect } from "./inspect";

// const greeting = getGreeting("John");
// console.log(greeting);

(async () => {
    await inspect(getArg('path', '.'));
})();