import ClientError from "../helpers/client_error.js";


const getObjectPaths = (obj, prefix = "") => {
  let paths = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullPath = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        paths = paths.concat(getObjectPaths(obj[key], fullPath)); // Recurse into the nested object
      } else {
        paths.push(fullPath); // Add the current path
      }
    }
  }

  return paths;
};
export default async function patch(Model, modelID, updates) {
  const updateFields = getObjectPaths(updates);
  // This check is required to make sure that no fields that do not exists get passed for an update
  // ----------------------------------------------------------------------------------------------

  const schemaFields = extractSchemaPaths(Model.schema);

  const invalidFields = updateFields.filter(
    (field) => !schemaFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new ClientError(
      `Invalid fields provided for update:\n ${invalidFields.join(", ")}`
    );
  }
  // ----------------------------------------------------------------------------------------------

  const updatedDocument = await Model.findByIdAndUpdate(modelID, updates, {
    new: true, // Return the updated document
    runValidators: true, // Ensure schema validation
  });

  if (!updatedDocument) {
    throw new ClientError(`Document with ID |${modelID}| not found.`, 404);
  }

  return updatedDocument;
}

// Extract all valid paths from the schema, including nested ones
const extractSchemaPaths = (schema, prefix = "") => {
  return Object.entries(schema.paths)
    .filter(([key]) => !key.startsWith("_"))
    .flatMap(([key, value]) => {
      if (value.schema) {
        // If it's a nested schema, recurse
        return extractSchemaPaths(value.schema, `${prefix}${key}.`);
      }
      return `${prefix}${key}`;
    });
};
