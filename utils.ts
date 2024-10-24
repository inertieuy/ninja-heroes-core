import path from "path";

export async function loadServer(): Promise<any> {
    const jsonPath = path.resolve(__dirname, './server.json');
    const file = Bun.file(jsonPath);

    // Muat file JSON
    const servers = await file.json();
    return servers;
}
export async function loadUser(): Promise<any> {
    const jsonPath = path.resolve(__dirname, './user.json');
    const file = Bun.file(jsonPath);

    // Muat file JSON
    const servers = await file.json();
    return servers;
}
