async function checkServer(data: any, serverId: string | null) {
    const server = data.servers.find((s: any) => s.serverId === serverId)
    return server
}
async function checkStatsServer(): Promise<Boolean> {
    const path = "./server.json";
    const file = Bun.file(path);

    // Muat file JSON
    const servers = await file.json();


    const serverIds = servers.servers.map((s: any) => s.serverId);
    console.log("Server Avaible:", serverIds.join(", "));

    const inputServer = prompt(`Please choose a server:`)

    const selectedServer = await checkServer(servers, inputServer)


    if (!selectedServer) {
        console.log(`Server ${inputServer} not found.`);
        return false;

    }
    console.log(`Server ${inputServer} found:`, selectedServer);
    return true;

}

checkStatsServer()
