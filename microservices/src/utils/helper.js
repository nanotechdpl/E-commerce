/**
 * Sends a standardized JSON response.
 *
 * @param {import("express").Response} res - Express response object.
 * @param {number} status - HTTP status code.
 * @param {boolean} successful - Indicates if the response is successful.
 *  * @param {string} feature - The feature name (used for title formatting). Defaults to "Example".
 * @param {string} message - The response message.
 * @param {Object | null} [data=null] - Optional response data.
 * @param {string | null} [error=null] - Optional error message.
 * @returns {import("express").Response} - Express response object.
 */

const sendResponse = (
  res,
  status,
  successful,
  feature = "Example",
  message,
  data = null,
  error = null
) => {
  const response = {
    title: `${feature} Message`,
    status,
    successful,
    message,
  };

  if (data) response.data = data;
  if (error) response.error = error;

  return res.status(status).json(response);
};


module.exports = { sendResponse };
