// Strips newlines and tabs out of a query that is formatted in source code
function formatSQL(query) {
  return query.replace(/[\n\t]/g, ' ').replace(/\s+/g, ' ');
}

export { formatSQL }