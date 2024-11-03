import path from "path";
import { Jutsu } from '../interface';

interface IWriteJutsuToNinja {
    jutsu: string
}
interface IRollJutsu {
    writeSkillToNinjaUser(): Promise<void>
}
class RollJutsu implements IRollJutsu {
    private _userId: string;
    private _serverId: string;
    private _ninja: string;
    private _tag: string;

    constructor(userId: string, serverId: string, ninja: string, tag: string) {
        this._userId = userId;
        this._serverId = serverId;
        this._ninja = ninja;
        this._tag = tag;
    }
    private async rollJutsu(): Promise<any> {
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

    async writeSkillToNinjaUser(): Promise<void> {
        const jsonPath = path.resolve(__dirname, '../user.json');
        const file = Bun.file(jsonPath);

        try {
            // Muat file JSON
            const userData = await file.json();

            const userFind = userData.user.find((u: any) => u.id === this._userId);

            if (!userFind) {
                throw new Error("User not found")
            }

            const serverFind = userFind.server.find((s: any) => s.serverId === this._serverId)
            if (!userFind) {
                throw new Error("Server not found")
            }

            const ninjaFind = serverFind.ninjas.find((n: any) => n.name === this._ninja && n.tag === this._tag)
            if (!ninjaFind) {
                throw new Error("Ninja not found")
            }

            const maxJutsu = 5
            if (ninjaFind.jutsu.length >= maxJutsu) {
                throw new Error("Ninja already have max jutsu")
            }

            const jutsu = await this.rollJutsu()

            const resultJutsu: IWriteJutsuToNinja = {
                jutsu: jutsu.name
            }
            console.log(`anda mendapatkan ${resultJutsu.jutsu}`);


            ninjaFind.jutsu.push(resultJutsu.jutsu)

            await Bun.write(jsonPath, JSON.stringify(userData, null, 2));

        } catch (error) {
            console.log(error)
        }
    }
}

const jutsu = new RollJutsu("yogs", "1", "kakashi", "2")
jutsu.writeSkillToNinjaUser()