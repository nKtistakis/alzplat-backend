import ClientError from "../helpers/client_error.js";

export default async function query(
  Model,
  req,
  defaultSort = "_id",
  defaultOrder = 1,
  defaultSize = 30
) {
  const { sort, order, cursor, ...query } = req.query;

  const sortOrderBy = {
    [sort ?? defaultSort]: order ? (order == "asc" ? 1 : -1) : defaultOrder,
  };

  let results;
  let nextCursor = null;
  try {
    results = await Model.find(query)
      .sort(sortOrderBy)
      .skip((cursor - 1) * defaultSize)
      .limit(defaultSize + 1);
  } catch (error) {
    throw new ClientError("Invalid query provided:" + error.message, 400, true);
  }

  if (results.length == 0) {
    return { results, nextCursor };
  }

  if (results.length > defaultSize) {
    results.pop();
    nextCursor = cursor ? Number(cursor) + 1 : 1;
  }

  return {
    cursor: nextCursor,
    totalResults: results.length,
    results,
  };
}
