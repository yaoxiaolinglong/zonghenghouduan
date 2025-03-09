/**
 * ID生成器工具
 * ID Generator Utility
 * 
 * 用于生成唯一标识符
 * Used to generate unique identifiers
 */

/**
 * 生成一个随机的字母数字ID
 * Generate a random alphanumeric ID
 * 
 * @param {number} length - ID长度（默认为8）| ID length (default is 8)
 * @returns {string} - 生成的ID | Generated ID
 */
function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 生成一个带时间戳的ID
 * Generate an ID with timestamp
 * 
 * @param {string} prefix - ID前缀（可选）| ID prefix (optional)
 * @returns {string} - 生成的ID | Generated ID
 */
function generateTimestampId(prefix = '') {
  const timestamp = Date.now().toString();
  const randomPart = generateId(4);
  return `${prefix}${timestamp}${randomPart}`;
}

/**
 * 生成一个随机的数字ID
 * Generate a random numeric ID
 * 
 * @param {number} length - ID长度（默认为6）| ID length (default is 6)
 * @returns {string} - 生成的ID | Generated ID
 */
function generateNumericId(length = 6) {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = {
  generateId,
  generateTimestampId,
  generateNumericId
}; 