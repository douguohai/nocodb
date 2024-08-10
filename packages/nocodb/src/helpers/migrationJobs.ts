import { v4 as uuidv4 } from 'uuid';
import Noco from '~/Noco';
import { MetaTable, RootScopes } from '~/utils/globals';

export const MIGRATION_JOBS_STORE_KEY = 'NC_MIGRATION_JOBS';

export const instanceUuid = uuidv4();

const initState = {
  version: '0',
  stall_check: Date.now(),
  locked: false,
  instance: instanceUuid,
};

export const getMigrationJobsState = async (): Promise<{
  version: string;
  stall_check: number;
  locked: boolean;
  instance: string;
}> => {
  const ncMeta = Noco.ncMeta;

  const qb = await ncMeta.metaGet(
    RootScopes.ROOT,
    RootScopes.ROOT,
    MetaTable.STORE,
    {
      key: MIGRATION_JOBS_STORE_KEY,
    },
  );

  if (!qb) {
    await ncMeta.metaInsert2(
      RootScopes.ROOT,
      RootScopes.ROOT,
      MetaTable.STORE,
      {
        key: MIGRATION_JOBS_STORE_KEY,
        value: JSON.stringify(initState),
      },
      true,
    );

    return initState;
  }

  try {
    const migrationJobsState = JSON.parse(qb?.value || '{}');

    if ('version' in migrationJobsState) {
      return migrationJobsState;
    }

    return initState;
  } catch (e) {
    console.error('Error parsing migration jobs state', e);
    return initState;
  }
};

export const updateMigrationJobsState = async (
  state: Partial<{
    version: string;
    stall_check: number;
    locked: boolean;
  }>,
  oldState?: {
    version: string;
    stall_check: number;
    locked: boolean;
  },
) => {
  const ncMeta = Noco.ncMeta;

  const migrationJobsState = oldState || (await getMigrationJobsState());

  if (!migrationJobsState) {
    const updatedState = {
      ...initState,
      ...state,
      instance: instanceUuid,
    };

    await ncMeta.metaInsert2(
      RootScopes.ROOT,
      RootScopes.ROOT,
      MetaTable.STORE,
      {
        key: MIGRATION_JOBS_STORE_KEY,
        value: JSON.stringify(updatedState),
      },
      true,
    );
  } else {
    const updatedState = {
      ...migrationJobsState,
      ...state,
      instance: instanceUuid,
    };

    await ncMeta.metaUpdate(
      RootScopes.ROOT,
      RootScopes.ROOT,
      MetaTable.STORE,
      {
        value: JSON.stringify(updatedState),
      },
      {
        key: MIGRATION_JOBS_STORE_KEY,
      },
    );
  }
};

export const setMigrationJobsStallInterval = () => {
  // update stall check every 5 mins
  const interval = setInterval(async () => {
    const migrationJobsState = await getMigrationJobsState();

    migrationJobsState.stall_check = Date.now();

    await updateMigrationJobsState(migrationJobsState);
  }, 5 * 60 * 1000);

  return interval;
};
