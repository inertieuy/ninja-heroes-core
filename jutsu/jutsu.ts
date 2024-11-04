import path from 'path';
import { IJutsu } from '../interface';
import { IRollJutsu, IWriteJutsuToNinja } from './interface';

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
  private async rollJutsu(existingJutsu: string[]): Promise<any> {
    const jsonPath = path.resolve(__dirname, '../jutsu.json');
    const file = Bun.file(jsonPath);

    try {
      // Muat file JSON
      const allJutsu = await file.json();

      if (!allJutsu.jutsu || !Array.isArray(allJutsu.jutsu)) {
        throw new Error('jutsu not found');
      }

      const jutsuList: IJutsu[] = allJutsu.jutsu;

      const availableJutsu = jutsuList.filter(
        (jutsu) => !existingJutsu.includes(jutsu.name),
      );

      if (availableJutsu.length === 0) {
        throw new Error('No new jutsu available to roll.');
      }

      return availableJutsu[Math.floor(Math.random() * availableJutsu.length)];
    } catch (error) {
      console.log(error);
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
        throw new Error('User not found');
      }

      const serverFind = userFind.server.find(
        (s: any) => s.serverId === this._serverId,
      );
      if (!serverFind) {
        throw new Error('Server not found');
      }

      const ninjaFind = serverFind.ninjas.find(
        (n: any) => n.name === this._ninja && n.tag === this._tag,
      );
      if (!ninjaFind) {
        throw new Error('Ninja not found');
      }

      const starValues = {
        S: 50,
        A: 40,
        B: 30,
        C: 20,
        D: 10,
      };

      const existingJutsu = ninjaFind.jutsu.map((j: any) => j.name);
      console.log(existingJutsu);
      const jutsuName = await this.rollJutsu(existingJutsu);

      const jutsuFind = ninjaFind.jutsu.filter(
        (n: any) => n.name === jutsuName.name,
      );

      const maxJutsu = 5;

      if (ninjaFind.jutsu.length >= maxJutsu) {
        const userChoice = prompt(
          `Jutsu maksimum (${maxJutsu}) tercapai. Pilih \n 1. 'burn' untuk menambah star \n 2. 'replace' untuk mengganti jutsu lama \n user : `,
        );

        if (userChoice === '1') {
          const burnJutsu = starValues[jutsuName.class] ?? 0;

          serverFind.star = (parseInt(serverFind.star) + burnJutsu).toString();
        } else if (userChoice === '2') {
          const jsonPath = path.resolve(__dirname, '../jutsu.json');
          const file = Bun.file(jsonPath);
          const jutsuData = await file.json();

          const jutsuIdx = ninjaFind.jutsu.map((j: any) => j.name);
          console.log('Jutsu Available:');
          jutsuIdx.forEach((jutsu, index) => {
            console.log(`${index + 1}. ${jutsu}`);
          });

          const user = prompt('Enter the number of the jutsu to replace:');

          if (!isNaN(user) && user >= 1 && user <= jutsuIdx.length) {
            const indexToReplace = user - 1;

            const selectedJutsu = jutsuIdx[indexToReplace];

            const classFind = jutsuData.jutsu.find(
              (j: any) => j.name === selectedJutsu,
            );
            const replacedJutsu = ninjaFind.jutsu[indexToReplace];
            const burnJutsu = starValues[classFind.class] ?? 0;

            serverFind.star = (
              parseInt(serverFind.star) + burnJutsu
            ).toString();

            // Ganti jutsu pada indeks yang dipilih
            ninjaFind.jutsu[indexToReplace] = {
              tag: (jutsuFind.length + 1).toString(),
              name: jutsuName.name,
              level: '1',
            };
          }
        } else {
          console.log('Invalid choice. No jutsu replaced.');
        }
      } else {
        const resultJutsu: IWriteJutsuToNinja = {
          jutsu: {
            tag: (jutsuFind.length + 1).toString(),
            name: jutsuName.name,
            level: '1',
          },
        };
        console.log(`anda mendapatkan ${jutsuName.name}`);

        ninjaFind.jutsu.push(resultJutsu.jutsu);
      }
      await Bun.write(jsonPath, JSON.stringify(userData, null, 2));
    } catch (error) {
      console.log(error);
    }
  }
}

const jutsu = new RollJutsu('yogs1', '1', 'naruto', '1');

jutsu.writeSkillToNinjaUser().finally(async () => {
  console.log('done');
});
