async function checkServerExist(): Promise<string> {
    const path = "../server.json";
    const file = Bun.file(path);

    // Muat file JSON
    const servers = await file.json();

    const serverIds = servers.servers.map((s: any) => s.serverId);
    console.log("Server Avaible:", serverIds.join(", "));

    return serverIds;
}

async function checkUserExist(): Promise<boolean> {
    const path = "../user.json";
    const file = Bun.file(path);

    const userData = await file.json();

    const userId = prompt("Please enter your id:");
    let userExist = userData.user.find((u: any) => u.id === userId);

    if (!userExist) {
        console.log(`User ${userId} not found.`);

        userExist = { id: userId, server: [] }
        userData.user.push(userExist);

    }

    const servers = await checkServerExist();

    const serverId = prompt("Please enter the server id:")?.trim();

    if (!servers.includes(String(serverId))) {
        console.log(`Server ${serverId} not found.`);
        return false
    }
    const isUserExistInServer = userExist.server.find((s: any) => s.serverId === serverId);

    if (!isUserExistInServer) {
        const nickname = prompt("Please enter your nickname:");

        const newAccountInServer = {
            serverId: serverId,
            nickname: nickname,
            heroes: []
        }

        userExist.server.push(newAccountInServer);
    }
    await Bun.write(path, JSON.stringify(userData, null, 2));
    console.log(`User data successfully updated in ${path}.`);
    return true;
}
