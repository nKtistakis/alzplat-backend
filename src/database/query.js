import ClientError from "../helpers/client_error.js";

export default async function query(
  Model,
  req,
  defaultSort = "_id",
  defaultOrder = 1
) {
  const { sort, order, ...query } = req.query;

  const sortOrderBy = {
    [sort ?? defaultSort]: order ? (order === "asc" ? 1 : -1) : defaultOrder,
  };

  let results;
  try {
    results = await Model.find(query).sort(sortOrderBy);
  } catch (error) {
    throw new ClientError(
      "Invalid query provided: " + error.message,
      400,
      true
    );
  }

  return results;
}
