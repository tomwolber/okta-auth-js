/**
 * Check the content of a cookie against a given value
 * @param  {String}   name          The name of the cookie
 * @param  {String}   falseCase     Whether or not to check if the value matches
 *                                  or not
 * @param  {String}   expectedValue The value to check against
 */
export default async (
    name: string,
    falseCase: boolean,
    expectedValue: string
) => {
    /**
     * The cookie retrieved from the browser object
     * @type {Object}
     */
    const cookies = await browser.getCookies(name);

    expect(cookies).not.toHaveLength(
        0,
        // @ts-expect-error
        `Expected cookie "${name}" to exists but it does not`
    );
    const cookie = cookies[0];

    expect(cookie.name).toBe(
        name,
        // @ts-expect-error
        `no cookie found with the name "${name}"`
    );

    if (falseCase) {
        expect(cookie.value).not.toBe(
            expectedValue,
            // @ts-expect-error
            `expected cookie "${name}" not to have value "${expectedValue}"`
        );
    } else {
        expect(cookie.value).toBe(
            expectedValue,
            // @ts-expect-error
            `expected cookie "${name}" to have value "${expectedValue}"`
            + ` but got "${cookie.value}"`
        );
    }
};
