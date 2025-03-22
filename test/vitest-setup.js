import { afterEach } from "vitest";

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
});

global.clearViMocks = (...mocks) => {
	mocks.forEach((mock) => {
		if (mock) {
			if (mock.mockClear) {
				mock.mockClear();
			} else {
				global.clearViMocks(...Object.values(mock));
			}
		}
	});
};
