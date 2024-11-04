import path from 'path';

class Utils {
  private async loadServer(): Promise<any> {
    const jsonPath = path.resolve(__dirname, './server.json');
    const file = Bun.file(jsonPath);

    // Muat file JSON
    return await file.json();
  }

  private async loadUser(): Promise<any> {
    const jsonPath = path.resolve(__dirname, './user.json');
    const file = Bun.file(jsonPath);

    // Muat file JSON
    return await file.json();
  }

  async syncServer(
    serverId: string,
    serverData: any,
    userData: any,
  ): Promise<any> {
    let count = 0;
    userData.user.forEach((user: any) => {
      const hashServer = user.server.find(
        (server: any) => server.serverId === serverId,
      );
      if (hashServer) {
        count += 1;
      }
    });
    console.log(count);

    const syncUser = serverData.servers.find(
      (server: any) => server.serverId === serverId,
    );
    if (syncUser) {
      syncUser.playerCount = count.toString();
    }
  }

  async syncAllServers(): Promise<void> {
    const serverData = await this.loadServer();
    const userData = await this.loadUser();
    const serverIds = serverData.servers.map((server: any) => server.serverId);

    await Promise.all(
      serverIds.map((serverId: string) => {
        this.syncServer(serverId, serverData, userData);
      }),
    );
    const patha = path.resolve(__dirname, './server.json');
    await Bun.write(patha, JSON.stringify(serverData, null, 2));
  }
}
const util = new Utils();
util.syncAllServers().finally(() => {
  console.log('success sync server');
});
