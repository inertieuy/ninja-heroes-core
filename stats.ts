interface IStats {
    checkStatsServer(): Promise<Boolean>
}
class Stats {
    private async checkServer(data: any, serverId: string | null) {
        return data.servers.find((s: any) => s.serverId === serverId)
    }
    async checkStatsServer(): Promise<Boolean> {
        const path = "./server.json";
        const file = Bun.file(path);

        // Muat file JSON
        const servers = await file.json();


        const serverIds = servers.servers.map((s: any) => s.serverId);
        console.log("Server Avaible:", serverIds.join(", "));

        const inputServer = prompt(`Please choose a server:`)

        const selectServer = await this.checkServer(servers, inputServer)


        if (!selectServer) {
            console.log(`Server ${inputServer} not found.`);
            return false;

        }
        console.log(`Server ${inputServer} found:`, selectServer);
        return true;

    }
}

const stats = new Stats();
stats.checkStatsServer();