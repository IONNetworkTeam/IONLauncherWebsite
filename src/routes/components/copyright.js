// copyright.js

/**
 * Gets the current copyright year or range
 * @param {number} startYear - The year the project started (optional)
 * @returns {string} Copyright year string
 */
export function getCopyrightYear(startYear = null) {
    const currentYear = new Date().getFullYear();

    if (!startYear || startYear >= currentYear) {
        return currentYear.toString();
    }

    return `${startYear}-${currentYear}`;
}

/**
 * Gets full copyright text
 * @param {string} owner - Copyright owner name
 * @param {number} startYear - The year the project started (optional)
 * @returns {string} Full copyright text
 */
export function getCopyrightText(owner, startYear = null) {
    const year = getCopyrightYear(startYear);
    return `© ${year} ${owner}. All rights reserved.`;
}
