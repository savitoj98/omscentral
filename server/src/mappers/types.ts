import { Domain, User } from '../models';

export type Mapper<TEntity extends Domain, TGraphQLEntity> = (
  entity: TEntity,
  user: User | null,
) => TGraphQLEntity;
