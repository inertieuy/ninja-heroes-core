import { checkUserExist } from "./login/login";
import { checkStatsServer } from "./stats";

async function main() {
    checkUserExist()
    // checkStatsServer()
}
main();