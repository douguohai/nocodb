import { Request, Response, Router } from 'express';
import Model from '../../../../noco-models/Model';
import Base from '../../../../noco-models/Base';
import NcConnectionMgrv2 from '../../../common/NcConnectionMgrv2';
import { PagedResponseImpl } from '../../helpers/PagedResponse';
import View from '../../../../noco-models/View';
import ncMetaAclMw from '../../helpers/ncMetaAclMw';
import { getViewAndModelFromRequestByAliasOrId } from './helpers';
import { NcError } from '../../helpers/catchError';

export async function mmList(req: Request, res: Response, next) {
  const { model, view } = await getViewAndModelFromRequestByAliasOrId(req);

  if (!model) return next(new Error('Table not found'));

  const base = await Base.get(model.base_id);

  const baseModel = await Model.getBaseModelSQL({
    id: model.id,
    viewId: view?.id,
    dbDriver: NcConnectionMgrv2.get(base)
  });

  const column = await getColumnByIdOrName(req.params.columnName, model);

  const data = await baseModel.mmList(
    {
      colId: column.id,
      parentId: req.params.rowId
    },
    req.query as any
  );
  const count: any = await baseModel.mmListCount({
    colId: column.id,
    parentId: req.params.rowId
  });

  res.json(
    new PagedResponseImpl(data, {
      count,
      ...req.query
    })
  );
}

export async function mmExcludedList(req: Request, res: Response, next) {
  const view = await View.get(req.params.viewId);

  const model = await Model.getByIdOrName({
    id: view?.fk_model_id || req.params.viewId
  });

  if (!model) return next(new Error('Table not found'));

  const base = await Base.get(model.base_id);

  const baseModel = await Model.getBaseModelSQL({
    id: model.id,
    viewId: view?.id,
    dbDriver: NcConnectionMgrv2.get(base)
  });
  const column = await getColumnByIdOrName(req.params.columnName, model);

  const data = await baseModel.getMmChildrenExcludedList(
    {
      colId: column.id,
      pid: req.params.rowId
    },
    req.query
  );

  const count = await baseModel.getMmChildrenExcludedListCount(
    {
      colId: column.id,
      pid: req.params.rowId
    },
    req.query
  );

  res.json(
    new PagedResponseImpl(data, {
      count,
      ...req.query
    })
  );
}

export async function hmExcludedList(req: Request, res: Response, next) {
  const view = await View.get(req.params.viewId);

  const model = await Model.getByIdOrName({
    id: view?.fk_model_id || req.params.viewId
  });

  if (!model) return next(new Error('Table not found'));

  const base = await Base.get(model.base_id);

  const baseModel = await Model.getBaseModelSQL({
    id: model.id,
    viewId: view?.id,
    dbDriver: NcConnectionMgrv2.get(base)
  });

  const column = await getColumnByIdOrName(req.params.columnName, model);

  const data = await baseModel.getHmChildrenExcludedList(
    {
      colId: column.id,
      pid: req.params.rowId
    },
    req.query
  );

  const count = await baseModel.getHmChildrenExcludedListCount(
    {
      colId: column.id,
      pid: req.params.rowId
    },
    req.query
  );

  res.json(
    new PagedResponseImpl(data, {
      count,
      ...req.query
    })
  );
}

export async function btExcludedList(req: Request, res: Response, next) {
  const view = await View.get(req.params.viewId);

  const model = await Model.getByIdOrName({
    id: view?.fk_model_id || req.params.viewId
  });

  if (!model) return next(new Error('Table not found'));

  const base = await Base.get(model.base_id);

  const baseModel = await Model.getBaseModelSQL({
    id: model.id,
    viewId: view?.id,
    dbDriver: NcConnectionMgrv2.get(base)
  });

  const column = await getColumnByIdOrName(req.params.columnName, model);

  const data = await baseModel.getBtChildrenExcludedList(
    {
      colId: column.id,
      cid: req.params.rowId
    },
    req.query
  );

  const count = await baseModel.getBtChildrenExcludedListCount(
    {
      colId: column.id,
      cid: req.params.rowId
    },
    req.query
  );

  res.json(
    new PagedResponseImpl(data, {
      count,
      ...req.query
    })
  );
}

export async function hmList(req: Request, res: Response, next) {
  const view = await View.get(req.params.viewId);

  const model = await Model.getByIdOrName({
    id: view?.fk_model_id || req.params.viewId
  });

  if (!model) return next(new Error('Table not found'));

  const base = await Base.get(model.base_id);

  const baseModel = await Model.getBaseModelSQL({
    id: model.id,
    viewId: view?.id,
    dbDriver: NcConnectionMgrv2.get(base)
  });

  const column = await getColumnByIdOrName(req.params.columnName, model);

  const data = await baseModel.hmList(
    {
      colId: column.id,
      id: req.params.rowId
    },
    req.query
  );

  const count = await baseModel.hmListCount({
    colId: column.id,
    id: req.params.rowId
  });

  res.json(
    new PagedResponseImpl(data, {
      totalRows: count
    } as any)
  );
}

//@ts-ignore
async function relationDataDelete(req, res) {
  const view = await View.get(req.params.viewId);

  const model = await Model.getByIdOrName({
    id: view?.fk_model_id || req.params.viewId
  });

  if (!model) NcError.notFound('Table not found');

  const base = await Base.get(model.base_id);

  const baseModel = await Model.getBaseModelSQL({
    id: model.id,
    viewId: view?.id,
    dbDriver: NcConnectionMgrv2.get(base)
  });

  const column = await getColumnByIdOrName(req.params.columnName, model);

  await baseModel.removeChild({
    colId: column.id,
    childId: req.params.childId,
    rowId: req.params.rowId
  });

  res.json({ msg: 'success' });
}

//@ts-ignore
async function relationDataAdd(req, res) {
  const view = await View.get(req.params.viewId);

  const model = await Model.getByIdOrName({
    id: view?.fk_model_id || req.params.viewId
  });

  if (!model) NcError.notFound('Table not found');

  const base = await Base.get(model.base_id);

  const baseModel = await Model.getBaseModelSQL({
    id: model.id,
    viewId: view?.id,
    dbDriver: NcConnectionMgrv2.get(base)
  });

  const column = await getColumnByIdOrName(req.params.columnName, model);
  await baseModel.addChild({
    colId: column.id,
    childId: req.params.childId,
    rowId: req.params.rowId
  });

  res.json({ msg: 'success' });
}

async function getColumnByIdOrName(columnNameOrId: string, model: Model) {
  const column = (await model.getColumns()).find(
    c =>
      column.title === columnNameOrId ||
      c.id === columnNameOrId ||
      column.column_name === columnNameOrId
  );

  if (!column)
    NcError.notFound(`Column with id/name '${columnNameOrId}' is not found`);

  return column;
}

const router = Router({ mergeParams: true });

router.get(
  '/api/v1/db/data/:orgs/:projectName/:tableName/mm/:columnName/exclude',
  ncMetaAclMw(mmExcludedList, 'mmExcludedList')
);
router.get(
  '/api/v1/db/data/:orgs/:projectName/:tableName/hm/:columnName/exclude',
  ncMetaAclMw(hmExcludedList, 'hmExcludedList')
);
router.get(
  '/api/v1/db/data/:orgs/:projectName/:tableName/bt/:columnName/exclude',
  ncMetaAclMw(btExcludedList, 'btExcludedList')
);

router.post(
  '/api/v1/db/data/:orgs/:projectName/:tableName/:relationType/:columnName/:refRowId',
  ncMetaAclMw(relationDataAdd, 'relationDataAdd')
);
router.delete(
  '/api/v1/db/data/:orgs/:projectName/:tableName/:relationType/:columnName/:refRowId',
  ncMetaAclMw(relationDataDelete, 'relationDataDelete')
);

export default router;
