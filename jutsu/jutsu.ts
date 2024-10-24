import path from "path";
import { Jutsu, WriteJutsuToNinja } from '../interface';

async function rollJutsu(): Promise<any> {
    const jsonPath = path.resolve(__dirname, '../jutsu.json');
    const file = Bun.file(jsonPath);

    try {
        // Muat file JSON
        const allJutsu = await file.json();

        if (!allJutsu.jutsu || !Array.isArray(allJutsu.jutsu)) {
            throw new Error("jutsu not found")
        }

        const jutsuList: Jutsu[] = allJutsu.jutsu;
        const rndJutsu = jutsuList[Math.floor(Math.random() * jutsuList.length)];

        return rndJutsu

    } catch (error) {
        console.log(error)
    }
}

async function writeSkillToNinjaUser(userId: string, serverId: string, ninja: string, tag: string) {
    const jsonPath = path.resolve(__dirname, '../user.json');
    const file = Bun.file(jsonPath);

    try {
        // Muat file JSON
        const userData = await file.json();

        const userFind = userData.user.find((u: any) => u.id === userId);

        if (!userFind) {
            throw new Error("User not found")
        }

        const serverFind = userFind.server.find((s: any) => s.serverId === serverId)
        if (!userFind) {
            throw new Error("Server not found")
        }

        const ninjaFind = serverFind.ninjas.find((n: any) => n.name === ninja && n.tag === tag)
        if (!ninjaFind) {
            throw new Error("Ninja not found")
        }

        const maxJutsu = 5
        if (ninjaFind.jutsu.length >= maxJutsu) {
            throw new Error("Ninja already have max jutsu")
        }
        
        const jutsu = await rollJutsu()

        const resultJutsu: WriteJutsuToNinja = {
            jutsu: jutsu.name
        }

        ninjaFind.jutsu.push(resultJutsu.jutsu)

        await Bun.write(jsonPath, JSON.stringify(userData, null, 2));

    } catch (error) {
        console.log(error)
    }
}

writeSkillToNinjaUser("yogs", "1", "sakura", "1")