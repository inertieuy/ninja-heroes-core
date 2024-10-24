import path from 'path';
import { Char, WriteNinja } from '../interface';

async function rollNinja(): Promise<any> {
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


export async function writeNinjaToUser(userId: string, serverId: string) {
    const jsonPath = path.resolve(__dirname, '../user.json');
    const file = Bun.file(jsonPath);

    try {

        const userData = await file.json();

        const userFind = userData.user.find((u: any) => u.id === userId);
        if (!userFind) {
            throw new Error("User not found")
        }

        const serverFind = userFind.server.find((s: any) => s.serverId === serverId)
        if (!serverFind || !Array.isArray(serverFind.ninjas)) {
            throw new Error("Server not found or ninja invalid")
        }

        const ninja = await rollNinja();

        const ninjaFind = serverFind.ninjas.filter((n: any) => n.name === ninja.name)
        if (!ninjaFind) {
            throw new Error("Ninja not found")
        }

        const sumNinja = ninjaFind.length + 1

        const resultNinja: WriteNinja = {
            tag: sumNinja.toString(),
            name: ninja?.name,
            jutsu: ninja?.jutsu || []
        }
        ninjaFind.ninjas.push(resultNinja)

        await Bun.write(jsonPath, JSON.stringify(userData, null, 2));

        console.log(`anda mendapatkan ${ninja?.name}`);


    } catch (error) {
        console.log(error)
    }
}

writeNinjaToUser("yogs", "1")