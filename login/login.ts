import path from "path"

/*function for check server exist or not */
async function checkServerExist(): Promise<string[]> {
    const jsonPath = path.resolve(__dirname, '../server.json');
    const file = Bun.file(jsonPath);

    // Muat file JSON
    const servers = await file.json();

    //maping file server
    const serverIds = await servers.servers.map((s: any) => s.serverId);
    console.log("Server Avaible:", serverIds.join(", "));

    return serverIds;
}

/*function for check max player */
async function checkMaxPlayer(serverId: string): Promise<Boolean> {

    const jsonPath = path.resolve(__dirname, '../server.json');
    const file = Bun.file(jsonPath);

    // Muat file JSON
    const servers = await file.json();

    //maping file server
    const selectedServer = await servers.servers.find((s: any) => s.serverId === serverId);

    //check player in server
    if (Number(selectedServer.playerCount) >= Number(selectedServer.maxPlayer)) {
        return false
    }
    return true
}

/*function for add player in server */
async function addPlayerCountInServer(serverId: string) {
    const jsonPath = path.resolve(__dirname, '../server.json');
    const file = Bun.file(jsonPath);

    // Muat file JSON
    const servers = await file.json();
    // load file JSON

    //find serverId
    const selectedServer = await servers.servers.find((s: any) => s.serverId === serverId);

    //add player in server
    let countPlayer = Number(selectedServer.playerCount) + 1
    selectedServer.playerCount = countPlayer.toString()

    //writting to json file
    await Bun.write(jsonPath, JSON.stringify(servers, null, 2));
}

/*function for check user exist or not */
export async function checkUserExist() {
    //load file json
    const jsonPath = path.resolve(__dirname, '../user.json');
    const file = Bun.file(jsonPath);

    // Muat file JSON
    const userData = await file.json();

    //input id
    let userId = prompt("Please enter your id:");
    while (!userId || userId.trim() === "") {
        userId = prompt("Please enter your id:");
    }

    //find id
    let userExist = await userData.user.find((u: any) => u.id === userId);

    /*creat new user if not exist */
    if (!userExist) {

        userExist = { id: userId, server: [] }
        await userData.user.push(userExist);

    }

    //check server
    const servers = await checkServerExist();

    let serverId = prompt("Please enter the server id:");

    while (!serverId || serverId.trim() === "" || !servers.includes(String(serverId))) {
        serverId = prompt("Please enter your valid server Id:");

    }

    //check max player
    let canAddPlayer = false;

    while (!canAddPlayer) {
        // Periksa apakah server penuh
        canAddPlayer = await checkMaxPlayer(String(serverId));

        if (!canAddPlayer) {
            // Jika server penuh, minta pengguna untuk memilih server lain
            console.log(`Server ${serverId} is full. Please choose another server.`);
            serverId = prompt("Please enter another server id:");
            while (!serverId || serverId.trim() === "" || !servers.includes(String(serverId))) {
                serverId = prompt("Please enter your valid server Id:");
            }
        }
    }
    await addPlayerCountInServer(String(serverId));
    await addNicknameToUser(userExist, String(serverId));


    await Bun.write(jsonPath, JSON.stringify(userData, null, 2));

}

/*function for add nickname to user */
async function addNicknameToUser(user: any, serverId: String) {

    const isUserExistInServer = await user.server.find((s: any) => s.serverId === serverId);

    if (!isUserExistInServer) {

        let nickname = prompt("Please enter your nickname:");

        while (!nickname || nickname.trim() === "") {
            nickname = prompt("Please enter your nickname:");

        }

        const newAccountInServer = {
            serverId: serverId,
            nickname: nickname,
            ninjas: [{
                "tag": "1",
                "name": "naruto",
                "jutsu": [
                    "rasengan"
                ]
            }]
        }
        await user.server.push(newAccountInServer);
        console.log(`user dengan id ${user.id} mendaftar pada server ${serverId} dengan nickname : ${nickname}`);
    }

}