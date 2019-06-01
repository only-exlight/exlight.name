import { Provider } from '@nestjs/common';
import { ACCESS, DB_CONECTION } from 'src/consts/provider-names';
import { Connection } from 'typeorm';
import { Access } from 'src/models/access.model';

export const AccessProvider: Provider = {
    provide: ACCESS,
    useFactory: (connection: Connection) => connection.getRepository(Access),
    inject: [DB_CONECTION],
};
