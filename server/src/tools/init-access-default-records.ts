import { Connection, Repository } from 'typeorm';
import { Role } from 'src/models/role.model';
import { Access } from 'src/models/access.model';
import { User } from 'src/models/user.model';
import { ALLOW_ALL_ACCESS, ADMIN_USER, ADMIN_ROLE, ADMIN_ROLE_NAME, USER_ROLE, CONFIRMED_USER_ROLE } from 'src/consts/default-entity';

export async function initAccessDefRec(connection: Connection): Promise<void> {
    const roleRep: Repository<Role> = connection.getRepository(Role);
    const accessRep: Repository<Access> = connection.getRepository(Access);
    const usersRep: Repository<User> = connection.getRepository(User);
    try {
        const ADMIN_ROLE_INSTANSE = await roleRep.findOne({
            where: { name: ADMIN_ROLE_NAME },
        });
        if (!ADMIN_ROLE_INSTANSE) {
            const { identifiers } = await roleRep.insert(ADMIN_ROLE);
            await roleRep.insert(USER_ROLE);
            await roleRep.insert(CONFIRMED_USER_ROLE);
            await usersRep.insert({
                ...ADMIN_USER,
                roleId: identifiers[0].id,
            });
            const accessList = ALLOW_ALL_ACCESS.map(a => accessRep.create({ ...a, roleId: identifiers[0].id }));
            await accessRep.insert(accessList);
        }
    } catch (err) {
        throw new Error(`Init application was failed =( \n ${err}`);
    }
}
