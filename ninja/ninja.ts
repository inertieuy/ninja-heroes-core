import path from 'path';
import { Char } from '../interface';

interface IWriteNinja {
    tag: string
    name: string | undefined
    jutsu: string[]
}
interface INinja {

    writeNinjaToUser(): Promise<void>
}
class Ninja implements INinja {
    private _userId: string;
    private _serverId: string;

    constructor(userId: string, serverId: string) {
        this._userId = userId;
        this._serverId = serverId;
    }

    private async rollNinja(): Promise<Char | undefined> {
        const jsonPath = path.resolve(__dirname, '../char.json');
        const file = Bun.file(jsonPath);

        try {
            // Muat file JSON
            const allNinja = await file.json();

            if (!allNinja.chars || !Array.isArray(allNinja.chars)) {
                throw new Error("Ninja not found")
            }

            const ninjaList: Char[] = allNinja.chars;
            const randomNinja = ninjaList[Math.floor(Math.random() * ninjaList.length)];

            return randomNinja

        } catch (error) {
            console.log(error)
        }
    }

    async writeNinjaToUser(): Promise<void> {
        const jsonPath = path.resolve(__dirname, '../user.json');
        const file = Bun.file(jsonPath);

        try {

            const userData = await file.json();

            const userFind = userData.user.find((u: any) => u.id === this._userId);
            if (!userFind) {
                throw new Error("User not found")
            }

            const serverFind = userFind.server.find((s: any) => s.serverId === this._serverId)
            if (!serverFind || !Array.isArray(serverFind.ninjas)) {
                throw new Error("Server not found or ninja invalid")
            }

            const ninja = await this.rollNinja();

            const ninjaFind = serverFind.ninjas.filter((n: any) => n.name === ninja?.name)
            if (!ninjaFind) {
                throw new Error("Ninja not found")
            }

            const sumNinja = ninjaFind.length + 1

            const resultNinja: IWriteNinja = {
                tag: sumNinja.toString(),
                name: ninja?.name,
                jutsu: ninja?.jutsu || []
            }
            serverFind.ninjas.push(resultNinja)

            await Bun.write(jsonPath, JSON.stringify(userData, null, 2));

            console.log(`anda mendapatkan ${ninja?.name}`);


        } catch (error) {
            console.log(error)
        }
    }
}
const user = new Ninja("yogs", "1");
user.writeNinjaToUser()