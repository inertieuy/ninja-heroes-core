import path from 'path';

class Utils {
  async loadServer(): Promise<any> {
    const jsonPath = path.resolve(__dirname, './server.json');
    const file = Bun.file(jsonPath);

    // Muat file JSON
    return await file.json();
  }

  async loadUser(): Promise<any> {
    const jsonPath = path.resolve(__dirname, './user.json');
    const file = Bun.file(jsonPath);

    // Muat file JSON
    return await file.json();
  }

  async syncServer(): Promise<any> {
    const serverData = await this.loadServer();
    const userData = await this.loadUser();
    console.log(userData);

    userData.user.forEach((user: any) => {
      const hashServer = user.server.find(
        (server: any) => server.serverId === 1,
      );
      if (hashServer) {
        console.log('Detail server dengan serverId 1:', hashServer);
      }
    });
    console.log(JSON.stringify(userData, null, 2));
  }
}
const util = new Utils();
util.syncServer();
